import { SAVED_ENTRIES_STORAGE_KEY, SAVED_SETTINGS_STORAGE_KEY, IUserSettings } from "~/src/constants";
import { showToast } from "~/src/toasts";

export type TSingleEntry = {
  url: string;
  labels: string[];
};

export const getStoredEntries = (): Promise<TSingleEntry[]> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(SAVED_ENTRIES_STORAGE_KEY, (itemsObject: { savedRepos: TSingleEntry[] }) => {
      resolve(itemsObject.savedRepos ? itemsObject.savedRepos : []);
    });
  });
};

export const storeSingleEntry = async ({ url, labels }: TSingleEntry): Promise<boolean> => {
  const currentItemsSaved = await getStoredEntries();
  const newArrayOfEntries = [...currentItemsSaved, { url, labels }];

  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [SAVED_ENTRIES_STORAGE_KEY]: newArrayOfEntries }, () => {
      if (chrome.runtime.lastError) {
        reject(false);
      }

      resolve(true);
    });
  });
};

export const updateStoredEntries = ({ updatedEntries }: { updatedEntries: TSingleEntry[] }): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [SAVED_ENTRIES_STORAGE_KEY]: updatedEntries }, () => {
      if (chrome.runtime.lastError) {
        reject("There was an error while storing your entry. Please try again.");
      }

      resolve(true);
    });
  });
};

export const getLabelsListHTML = (labels: string[]): string => {
  let labelsListHTML = "<ol>";
  labelsListHTML += labels.reduce((html, text) => {
    return html + `<li>${text}</li>`;
  }, "");

  labelsListHTML += "</ol>";
  return labelsListHTML;
};

export const getStoredUserSettings = (): Promise<IUserSettings> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(SAVED_SETTINGS_STORAGE_KEY, (settingsObject: { userSettings: IUserSettings }) => {
      resolve(settingsObject.userSettings);
    });
  });
};

export const updateUserSetting = async ({ settingKey, settingValue }: { settingKey: keyof IUserSettings; settingValue: boolean }): Promise<IUserSettings> => {
  const storedUserSettings = await getStoredUserSettings();
  const settingsToStore = { ...storedUserSettings, [settingKey]: settingValue };
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [SAVED_SETTINGS_STORAGE_KEY]: settingsToStore }, () => {
      if (chrome.runtime.lastError) {
        reject(`There was an error while storing user setting "${settingKey}" to chrome storage.`);
      }

      resolve(settingsToStore);
    });
  });
};

export const initUserSettings = async (): Promise<void> => {
  const storedUserSettings = await getStoredUserSettings();

  if (!storedUserSettings) {
    updateUserSetting({
      settingKey: "showLabelsAddSuccessMessage",
      settingValue: true,
    });
  }
};

export const setPRLabels = async (labelsToSelect: string[]): Promise<boolean> => {
  const labelsToggle = document.getElementById("labels-select-menu");

  if (labelsToggle == null) {
    return false;
  }

  const openAndLoadToggle = (): Promise<void> => {
    labelsToggle.setAttribute("open", "true");

    return new Promise((resolve, reject) => {
      let intervalId: number = null;
      let attempts = 0;

      window.setTimeout(() => {
        intervalId = window.setInterval(() => {
          const isLoading = labelsToggle.classList.contains("is-loading");
          attempts++;

          if (!isLoading) {
            clearInterval(intervalId);
            resolve();
          }

          if (attempts > 20) {
            reject("Failed to add desired label(s).");
          }
        }, 100);
      }, 200);
    });
  };

  const closeToggle = (): void => {
    labelsToggle.removeAttribute("open");
  };

  try {
    await openAndLoadToggle();
    const allLabelElements = labelsToggle.querySelectorAll(".select-menu-item .name");

    if (allLabelElements.length === 0) {
      throw new Error("Failed to add desired label(s).");
    }

    const labelsSet: string[] = [];

    Array.from(allLabelElements)
      .filter((singleElement) => labelsToSelect.includes(singleElement.textContent.toLowerCase()))
      .forEach((labelElement) => {
        labelsSet.push(labelElement.textContent.toLowerCase());
        (labelElement.closest(".select-menu-item") as HTMLElement).click();
      });

    closeToggle();

    if (labelsSet.length === 0) {
      showToast.error(
        `No labels were set on this pull request because all labels you defined don't exist in this repository. <br /> Labels you were trying to add:${getLabelsListHTML(
          labelsToSelect
        )}`
      );
      return;
    }

    if (labelsSet.length !== labelsToSelect.length) {
      const labelsNotSet = labelsToSelect.filter((singleLabel: string) => !labelsSet.includes(singleLabel));
      showToast.error(
        `Some labels were not set on this pull request because they do not exist in this repository. <br /> Labels not set: ${getLabelsListHTML(labelsNotSet)}`
      );
    }

    const storedUserSettings = await getStoredUserSettings();

    if (storedUserSettings.showLabelsAddSuccessMessage) {
      showToast.success(`These labels were successfully added to this pull request: <br /> ${getLabelsListHTML(labelsSet)}`);
    }
  } catch (error) {
    throw Error(error);
  }
};

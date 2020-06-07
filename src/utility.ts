import { SAVED_ENTRIES_STORAGE_KEY, SAVED_SETTINGS_STORAGE_KEY, IUserSettings } from "~/src/constants";
import { showToast } from "~/src/toasts";

export const isValidURL = (urlString: string): boolean => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator

  return !!pattern.test(urlString);
};

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

export const storeSingleEntry = async (newEntry: TSingleEntry): Promise<void> => {
  const currentItemsSaved = await getStoredEntries();
  const newArrayOfEntries = [...currentItemsSaved, newEntry];

  chrome.storage.sync.set({ [SAVED_ENTRIES_STORAGE_KEY]: newArrayOfEntries });
};

export const getEmphasizedLabels = (labels: string[]): string => {
  return `<em>${labels.join(", ")}</em>`;
};

export const getStoredUserSettings = (): Promise<IUserSettings> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(SAVED_SETTINGS_STORAGE_KEY, (settingsObject: { userSettings: IUserSettings }) => {
      resolve(settingsObject.userSettings);
    });
  });
};

export const updateUserSetting = async ({ settingKey, settingValue }: { settingKey: keyof IUserSettings; settingValue: boolean }): Promise<boolean> => {
  const storedUserSettings = await getStoredUserSettings();
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [SAVED_SETTINGS_STORAGE_KEY]: { ...storedUserSettings, [settingKey]: settingValue } }, () => {
      if (chrome.runtime.lastError) {
        reject(false);
      }

      resolve(true);
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

  if (!labelsToggle) {
    return false;
  }

  function openAndLoadToggle(): Promise<void> {
    labelsToggle.setAttribute("open", "true");

    return new Promise((resolve, reject) => {
      let intervalId: NodeJS.Timeout = null;
      let attempts = 0;

      setTimeout(() => {
        intervalId = setInterval(() => {
          const isLoading = labelsToggle.classList.contains("is-loading");
          attempts++;

          if (!isLoading) {
            clearInterval(intervalId);
            resolve();
          }

          if (attempts > 5) {
            reject("Failed to add desired label(s).");
          }
        }, 100);
      }, 200);
    });
  }

  function closeToggle(): void {
    labelsToggle.removeAttribute("open");
  }

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

    if (labelsSet.length !== labelsToSelect.length) {
      const labelsNotSet = labelsToSelect.filter((singleLabel: string) => !labelsSet.includes(singleLabel));
      showToast.error(
        `Some labels were not set on this PR because they do not exist in this repo. <br /> Labels not set: "${getEmphasizedLabels(labelsNotSet)}"`
      );
    }

    const storedUserSettings = await getStoredUserSettings();

    if (storedUserSettings.showLabelsAddSuccessMessage) {
      showToast.success(`These labels were successfully added: <br /> "${getEmphasizedLabels(labelsSet)}"`);
    }
  } catch (error) {
    throw Error(error);
  }
};

import { SAVED_ENTRIES_STORAGE_KEY } from "~/src/constants";

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

export const setPRLabels = async (labelsToSelect: string[]): Promise<void> => {
  const labelsToggle = document.getElementById("labels-select-menu");

  if (!labelsToggle) {
    return;
  }

  function openAndLoadToggle(): Promise<void> {
    labelsToggle.setAttribute("open", "true");

    return new Promise((resolve) => {
      let intervalId: NodeJS.Timeout = null;

      setTimeout(() => {
        intervalId = setInterval(() => {
          const isLoading = labelsToggle.classList.contains("is-loading");

          if (!isLoading) {
            clearInterval(intervalId);
            resolve();
          }
        }, 100);
      }, 200);
    });
  }

  function closeToggle(): void {
    labelsToggle.removeAttribute("open");
  }

  await openAndLoadToggle();
  const allLabelElements = labelsToggle.querySelectorAll(".select-menu-item .name");

  Array.from(allLabelElements)
    .filter((singleElement) => labelsToSelect.includes(singleElement.textContent.toLowerCase()))
    .forEach((labelElement) => {
      (labelElement.closest(".select-menu-item") as HTMLElement).click();
    });

  closeToggle();
};

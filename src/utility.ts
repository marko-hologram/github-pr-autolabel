import { STORAGE_KEY } from "~/src/constants";

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
    chrome.storage.sync.get(STORAGE_KEY, (itemsObject: { savedRepos: TSingleEntry[] }) => {
      resolve(itemsObject.savedRepos);
    });
  });
};

export const storeSingleEntry = async (newEntry: TSingleEntry): Promise<void> => {
  const currentItemsSaved = await getStoredEntries();
  const newArrayOfEntries = [...currentItemsSaved, newEntry];

  chrome.storage.sync.set({ [STORAGE_KEY]: newArrayOfEntries });
};

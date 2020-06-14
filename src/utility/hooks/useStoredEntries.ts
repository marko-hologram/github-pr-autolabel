import { TSingleEntry, getStoredEntries } from "~/src/utility";
import { useState, useEffect } from "react";

const useStoredEntries = (): TSingleEntry[] => {
  const [storedEntries, setStoredEntries] = useState([]);

  useEffect(() => {
    const updateLocalStoredEntries = async () => {
      try {
        const storedEntries = await getStoredEntries();
        setStoredEntries(storedEntries);
      } catch (error) {
        console.error("Error while trying to get stored entries: ", error);
      }
    };

    updateLocalStoredEntries();

    chrome.storage.onChanged.addListener(updateLocalStoredEntries);

    return () => {
      chrome.storage.onChanged.removeListener(updateLocalStoredEntries);
    };
  }, []);

  return storedEntries;
};

export default useStoredEntries;

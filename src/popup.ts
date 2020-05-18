import { getStoredEntries } from "~/src/utility";

const updatePopupMessage = (popupMessage: string): void => {
  const popupMessageElement = document.getElementById("popup-message") as HTMLParagraphElement;

  if (popupMessageElement) {
    popupMessageElement.textContent = popupMessage;
  }
};

const checkIfEntiresExist = async (): Promise<void> => {
  const storedEntries = await getStoredEntries();
  const storedEntriesLength = storedEntries.length;

  if (storedEntriesLength === 0) {
    updatePopupMessage("You don't have any data stored, why don't you add some in the settings page?");
    return;
  }

  updatePopupMessage(`You have ${storedEntriesLength} ${storedEntriesLength > 1 ? "entries" : "entry"} stored`);
};

chrome.storage.onChanged.addListener(checkIfEntiresExist);

checkIfEntiresExist();

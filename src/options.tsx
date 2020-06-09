import "toastify-js/src/toastify.css";
import "~/src/style/style.scss";

import React from "react";
import ReactDOM from "react-dom";
import { on } from "delegated-events";

import { isValidURL, TSingleEntry, getStoredEntries, storeSingleEntry, getStoredUserSettings, updateUserSetting } from "~/src/utility";
import { SAVED_ENTRIES_STORAGE_KEY, IUserSettings } from "~/src/constants";
import { showToast } from "~/src/toasts";
import OptionsPage from "~/src/pages/OptionsPage";

// const showErrorMessage = (errorMessages: string[]): void => {
//   const errorElement = document.getElementById("new-entry-form-error");

//   if (errorElement) {
//     errorElement.innerHTML = errorMessages
//       .map((singleMessage, index) => {
//         return `${index > 0 ? "<br /><br />" : ""}${singleMessage}`;
//       })
//       .join("")
//       .toString();
//     errorElement.classList.remove("u-hide");
//   }
// };

// const hideErrorMessage = (): void => {
//   const errorElement = document.getElementById("new-entry-form-error");

//   if (errorElement) {
//     errorElement.innerHTML = "";
//     errorElement.classList.add("u-hide");
//   }
// };

// const showSuccessMessage = (message: string, hideAfterMs = 5000): void => {
//   const successElement = document.getElementById("new-entry-form-success");

//   if (successElement) {
//     successElement.textContent = message;
//     successElement.classList.remove("u-hide");

//     if (hideAfterMs > 0) {
//       setTimeout(() => {
//         successElement.classList.add("u-hide");
//       }, hideAfterMs);
//     }
//   }
// };

// const createSingleActiveEntry = (entryData: TSingleEntry, index: number): string => {
//   return `
//     <div class="single-entry" data-single-entry-index="${index}">
//       <div class="single-entry__url"><span class="t-700">URL:</span> ${entryData.url}</div>
//       <div class="single-entry__labels"><span class="t-700">TAGS:</span> ${entryData.labels.join(", ").toString()}</div>
//       <div class="single-entry__actions">
//         <a class="btn btn--secondary" href="${entryData.url}" target="_blank">Go To URL</a>
//         <button type="button" class="btn btn--danger single-entry__delete">Delete Entry</button>
//       </div>
//     </div>
//   `;
// };

// const updateActiveEntries = async (): Promise<void> => {
//   const storedEntries = await getStoredEntries();
//   let activeEntriesHTML = "";

//   if (storedEntries && storedEntries.length > 0) {
//     storedEntries.forEach((singleEntry: TSingleEntry, index: number) => {
//       activeEntriesHTML += createSingleActiveEntry(singleEntry, index);
//     });
//   } else {
//     activeEntriesHTML = "<p>There are no entries saved yet.</p>";
//   }

//   const currentEntriesList = document.getElementById("current-entries-list") as HTMLDivElement;

//   if (currentEntriesList) {
//     currentEntriesList.innerHTML = activeEntriesHTML;
//   }
// };

// chrome.storage.onChanged.addListener(updateActiveEntries);

// const deleteSingleEntry = async (event: MouseEvent): Promise<void> => {
//   const target = event.target as HTMLButtonElement;
//   const didConfirm = window.confirm("Are you sure you want to delete this entry? This action cannot be undone!");

//   if (didConfirm) {
//     const entryIndex = parseInt(target.closest(".single-entry").getAttribute("data-single-entry-index"), 10);

//     const storedEntries = await getStoredEntries();
//     const newEntries = [...storedEntries];
//     newEntries.splice(entryIndex, 1);

//     chrome.storage.sync.set({ [SAVED_ENTRIES_STORAGE_KEY]: newEntries });
//   }
// };

// on("click", ".single-entry__delete", deleteSingleEntry);

// const urlField = document.getElementById("repo-url") as HTMLInputElement;
// const labelsField = document.getElementById("pr-labels") as HTMLInputElement;

// if (urlField) {
//   urlField.addEventListener("input", hideErrorMessage);
// }

// if (labelsField) {
//   labelsField.addEventListener("input", hideErrorMessage);
// }

// const newEntryForm = document.getElementById("new-entry-form");
// newEntryForm?.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   const urlFieldValue = urlField.value.trim();
//   const labelsFieldValue = labelsField.value.trim();
//   const submitButton = document.getElementById("new-entry-submit") as HTMLButtonElement;

//   const errorMessages: string[] = [];
//   const urlIsValid = isValidURL(urlFieldValue);

//   if (urlFieldValue.length > 0 && !urlIsValid) {
//     errorMessages.push("Oh come on, that is not a valid URL...You know it's not.");
//   }

//   if (urlFieldValue.length > 0 && urlIsValid && !urlFieldValue.includes("github.com")) {
//     errorMessages.push("Well, the URL is a valid URL, but it's not a 'github.com' URL. Please provide a valid GitHub URL.");
//   }

//   if (urlFieldValue.length === 0 || labelsFieldValue.length === 0) {
//     errorMessages.push("All fields are required!");
//   }

//   const savedRepos = await getStoredEntries();
//   if (savedRepos && savedRepos.some((singleItem: TSingleEntry) => singleItem.url === urlFieldValue)) {
//     errorMessages.push(
//       "You already added this URL! If you want to update labels for this URL, you will have to delete it then add it back again. Sorry, no editing of existing entries for now!"
//     );
//   }

//   if (errorMessages.length > 0) {
//     showErrorMessage(errorMessages);
//     return;
//   }

//   submitButton.disabled = true;

//   const labelsArray = labelsFieldValue.split(",").map((singleLabel: string) => singleLabel.trim());
//   storeSingleEntry({ url: urlFieldValue, labels: labelsArray });

//   showSuccessMessage("Entry successfully added!");
//   (document.activeElement as HTMLButtonElement | HTMLInputElement).blur();

//   (event.target as HTMLFormElement).reset();
//   submitButton.disabled = false;
// });

// const setUserOptions = async (): Promise<void> => {
//   const storedUserSettings = await getStoredUserSettings();

//   if (storedUserSettings.showLabelsAddSuccessMessage) {
//     (document.getElementById("showLabelsAddSuccessMessage") as HTMLInputElement).checked = true;
//   }
// };

// updateActiveEntries();
// setUserOptions();

// const toggleUserOption = async (event: any): Promise<void> => {
//   const target: HTMLInputElement = event.target;
//   const optionName: keyof IUserSettings = target.name as any;
//   const isChecked = target.checked;
//   target.setAttribute("disabled", "true");

//   const didUpdate = await updateUserSetting({
//     settingKey: optionName,
//     settingValue: isChecked,
//   });

//   target.removeAttribute("disabled");
//   if (didUpdate) {
//     showToast.success("Successfully updated user settings!");
//   } else {
//     showToast.error("Error while updating user settings.");
//     setUserOptions();
//   }
// };

// on("change", ".user-option-toggle", toggleUserOption);

ReactDOM.render(<OptionsPage />, document.getElementById("options-page"));

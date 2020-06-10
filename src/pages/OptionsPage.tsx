import React, { useState } from "react";
import SavedEntriesList from "~/src/components/SavedEntriesList";
import useStoredEntries from "~/src/utility/hooks/useStoredEntries";
import Button from "~/src/components/Button";
import FormGroup from "~/src/components/FormGroup";
import Input from "~/src/components/Input";
import { isValidURL } from "~/src/utility/hooks/validation";
import { useFormInput } from "~/src/utility/hooks/useFormInput";
import Alert from "~/src/components/Alert";

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

// if (urlFieldValue.length > 0 && !urlIsValid) {
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

const OptionsPage: React.FunctionComponent<Record<string, unknown>> = () => {
  const storedEntries = useStoredEntries();
  const urlInput = useFormInput();
  const labelsInput = useFormInput();
  // const [url, setUrl] = useState("");
  // const [labels, setLabels] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [entryAdded, setEntryAdded] = useState(false);

  const handleEntrySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errorMessagesArray = [];

    const urlIsValid = isValidURL(urlInput.value);

    errorMessagesArray.push("Oh come on, that is not a valid URL...You know it's not.");
    errorMessagesArray.push("Well, the URL is a valid URL, but it's not a 'github.com' URL. Please provide a valid GitHub URL.");
    errorMessagesArray.push("All fields are required!");

    setErrorMessages(errorMessagesArray);
  };

  return (
    <div className="options-main">
      <h1 className="options-title">GitHub PR Autolabel Settings</h1>
      <div className="options-settings">
        <div className="options-settings__user-settings">
          <h2>Settings</h2>
          <div className="form-group form-check">
            <input type="checkbox" id="showLabelsAddSuccessMessage" className="form-check-input user-option-toggle" name="showLabelsAddSuccessMessage" />
            <label htmlFor="showLabelsAddSuccessMessage" className="form-check-label">
              Show Notification When Labels Are Successfully Added
            </label>
          </div>
        </div>
        <div className="options-settings__add">
          <h2>Add New Entry</h2>
          <p>You have to refresh your GitHub tabs after adding entries here!</p>
          <form className="m-b-2" onSubmit={handleEntrySubmit}>
            <FormGroup>
              <Input labelText="Repo URL" name="repoUrl" placeholder="https://github.com/marko-hologram/github-pr-autolabel" {...urlInput} />
            </FormGroup>
            <FormGroup>
              <Input labelText="Labels (comma separated)" name="label" placeholder="bug,help wanted" {...labelsInput} />
            </FormGroup>
            <Button type="submit">Save Entry</Button>
            {urlInput.value}
          </form>
          {errorMessages.length > 0 &&
            errorMessages.map((singleMessage: string) => {
              return (
                <Alert key={singleMessage} variant="danger">
                  {singleMessage}
                </Alert>
              );
            })}
          {entryAdded && <Alert variant="success">Entry successfully added!</Alert>}
        </div>
        <div className="options-settings__current">
          <h2>Saved Entries</h2>
          <div className="options-settings__current-list">
            <SavedEntriesList savedEntries={storedEntries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsPage;

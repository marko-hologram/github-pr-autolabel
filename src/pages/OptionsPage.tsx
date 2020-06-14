import React, { useState, ReactElement, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { isValidURL, isGitHubURL } from "~/src/utility/validation";
import { storeSingleEntry, getStoredEntries, getStoredUserSettings, updateUserSetting } from "~/src/utility";
import { Button } from "~/src/components/Button";
import { FormGroup, Input, Checkbox } from "~/src/components/Form";
import { Alert } from "~/src/components/Alert";
import { SavedEntriesList } from "~/src/components/SavedEntriesList";
import useFormInput from "~/src/utility/hooks/useFormInput";
import useStoredEntries from "~/src/utility/hooks/useStoredEntries";
import { IUserSettings } from "~/src/constants";
import { showToast } from "~/src/toasts";

const OptionsPage = (): ReactElement => {
  const storedEntries = useStoredEntries();
  const [urlInput, resetUrlInput] = useFormInput();
  const [labelsInput, resetLabelsInput] = useFormInput();
  const [errorMessages, setErrorMessages] = useState([]);
  const [entryAdded, setEntryAdded] = useState(false);
  const [userSettings, setUserSettings] = useState<IUserSettings>(null);

  useEffect(() => {
    const getUserSettings = async () => {
      try {
        const storedUserSettings = await getStoredUserSettings();
        setUserSettings(storedUserSettings);
      } catch (error) {
        setUserSettings(null);
        showToast.error("There was an error while getting you user settings. Please reload this page.");
      }
    };

    getUserSettings();
  }, []);

  useEffect(() => {
    if (!entryAdded) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setEntryAdded(false);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [entryAdded]);

  const handleEntrySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errorMessagesArray = [];

    const urlIsValid = isValidURL(urlInput.value);
    const urlInputLowercase = urlInput.value.toLowerCase();

    if (urlInputLowercase.length > 0 && !urlIsValid) {
      errorMessagesArray.push("Oh come on, that is not a valid URL...You know it's not.");
    }

    if (urlInputLowercase.length > 0 && urlIsValid && !isGitHubURL(urlInputLowercase)) {
      errorMessagesArray.push("Well, the URL is a valid URL, but it's not a 'github.com' URL. Please provide a valid GitHub URL.");
    }

    if (urlInputLowercase.length === 0 || labelsInput.value.length === 0) {
      errorMessagesArray.push("All fields are required!");
    }

    const savedRepos = await getStoredEntries();
    if (savedRepos && savedRepos.some((singleItem) => singleItem.url.toLowerCase() === urlInputLowercase)) {
      errorMessagesArray.push(
        "You already added this URL! If you want to update labels for this URL, you will have to delete it then add it back again. Sorry, no editing of existing entries for now!"
      );
    }

    if (errorMessagesArray.length > 0) {
      setErrorMessages(errorMessagesArray);
      return;
    }

    const labelsArray = labelsInput.value.split(",").map((singleLabel: string) => singleLabel.trim());
    storeSingleEntry({ url: urlInput.value, labels: labelsArray })
      .then(() => {
        setEntryAdded(true);
        setErrorMessages([]);
        resetUrlInput();
        resetLabelsInput();
      })
      .catch((errorMessage) => {
        setErrorMessages([errorMessage]);
      });
  };

  const handleUserSettingChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const settingName = event.target.name as keyof IUserSettings;
    const isChecked = event.target.checked;

    try {
      const updatedUserSettings = await updateUserSetting({ settingKey: settingName, settingValue: isChecked });
      setUserSettings(updatedUserSettings);
      showToast.success("Successfully updated user settings!");
    } catch (error) {
      const storedUserSettings = await getStoredUserSettings();
      setUserSettings(storedUserSettings);
      showToast.error("Error while updating user settings.");
      console.error(error);
    }
  };

  return (
    <div className="options">
      <div className="options__main">
        <h1>GitHub PR Autolabel Settings</h1>
        <div className="options__settings">
          <div className="options__settings-user">
            <h2>Settings</h2>
            <Checkbox
              checked={userSettings?.showLabelsAddSuccessMessage ?? false}
              disabled={!userSettings}
              onChange={handleUserSettingChange}
              name="showLabelsAddSuccessMessage"
            >
              Show Notification When Labels Are Successfully Added
            </Checkbox>
          </div>
          <div className="options__add">
            <h2>Add New Entry</h2>
            <p>You have to refresh your GitHub tabs after adding entries here!</p>
            <form className="m-b-2" onSubmit={handleEntrySubmit}>
              <FormGroup>
                <Input labelText="Repository URL" name="repoUrl" placeholder="https://github.com/marko-hologram/github-pr-autolabel" {...urlInput} />
              </FormGroup>
              <FormGroup>
                <Input labelText="Labels (comma separated)" name="label" placeholder="bug, help wanted" {...labelsInput} />
              </FormGroup>
              <Button type="submit">Save Entry</Button>
            </form>
            <AnimatePresence>
              {errorMessages.length > 0 &&
                errorMessages.map((singleMessage: string) => {
                  return (
                    <Alert key={singleMessage} variant="danger">
                      {singleMessage}
                    </Alert>
                  );
                })}
            </AnimatePresence>

            <AnimatePresence>{entryAdded && <Alert variant="success">Entry successfully added!</Alert>}</AnimatePresence>
          </div>
        </div>
      </div>
      <div className="options__sidebar">
        <h2>Saved Entries</h2>
        <div className="options_entries-list">
          <SavedEntriesList savedEntries={storedEntries} />
        </div>
      </div>
    </div>
  );
};

export default OptionsPage;

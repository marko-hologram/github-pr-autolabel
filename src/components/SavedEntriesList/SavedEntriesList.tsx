import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TSingleEntry, getStoredEntries, updateStoredEntries, deleteStoredEntry, updateSingleStoredEntry, getLabelsFromInput } from "~/src/utility";
import Button from "~/src/components/Button/Button";
import Input from "~/src/components/Form/Input";
import useFormInput from "~/src/utility/hooks/useFormInput";
import { createAnimationDefinition } from "~/src/utility/animation";
import { showToast } from "~/src/toasts";

interface SavedEntriesListSingleProps {
  entryData: TSingleEntry;
}

interface SavedEntriesListProps {
  savedEntries: TSingleEntry[];
}

const SavedEntriesListSingle: React.FunctionComponent<SavedEntriesListSingleProps> = ({ entryData }) => {
  const [editModeOn, setEditModeOn] = useState(false);
  const [labelsInput] = useFormInput(entryData.labels.join(", ").toString());
  const labelsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editModeOn) {
      return;
    }

    labelsInputRef.current.focus();
  }, [editModeOn]);

  const toggleEditMode = () => {
    setEditModeOn((currentState) => !currentState);
  };

  const deleteSingleEntry = async () => {
    const didConfirm = window.confirm("Are you sure you want to delete this entry? This action cannot be undone!");

    if (didConfirm) {
      try {
        await deleteStoredEntry({ entryToDelete: entryData });
      } catch (error) {
        console.error(error);
        showToast.error(
          `There was an error while trying to delete entry data for repository at: <br /> <a href="${entryData.url}" target="_blank" rel="noreferrer">${entryData.url}</a>`
        );
      }
    }
  };

  const saveEditedEntry = async () => {
    try {
      await updateSingleStoredEntry({ updatedEntryData: { url: entryData.url, labels: getLabelsFromInput({ inputValue: labelsInput.value }) } });
      showToast.success(`Labels updated for repository at: <br /> <a href="${entryData.url}" target="_blank" rel="noreferrer">${entryData.url}</a>`);
      toggleEditMode();
    } catch (error) {
      showToast.error(
        `There was an error while updating labels data for repository at: <br /> <a href="${entryData.url}" target="_blank" rel="noreferrer">${entryData.url}</a>`
      );
    }
  };

  return (
    <motion.div className="saved-entries__item" {...createAnimationDefinition({ animationType: "heightIn" })}>
      <div className="saved-entries__url-container">
        <h4>URL</h4>
        <a className="saved-entries__url" href={entryData.url} target="_blank" rel="noreferrer">
          {entryData.url}
        </a>
      </div>
      <div className="saved-entries__labels">
        <h4>Labels</h4>
        {editModeOn && <Input disabled={!editModeOn} ref={labelsInputRef} {...labelsInput} />}
        {!editModeOn && labelsInput.value}
      </div>
      <div className="saved-entries__actions">
        <h4>Actions</h4>
        <Button onClick={!editModeOn ? toggleEditMode : saveEditedEntry} disabled={labelsInput.value.length === 0} variant={editModeOn ? "success" : "primary"}>
          {editModeOn ? "Save" : "Edit"}
        </Button>{" "}
        <Button variant="danger" onClick={deleteSingleEntry}>
          Delete Entry
        </Button>
      </div>
    </motion.div>
  );
};

const SavedEntriesList: React.FunctionComponent<SavedEntriesListProps> = ({ savedEntries }) => {
  if (savedEntries.length === 0) {
    return <motion.p {...createAnimationDefinition({ animationType: "heightIn" })}>There are no entries saved yet.</motion.p>;
  }

  return (
    <div className="saved-entries">
      <AnimatePresence>
        {savedEntries.map((singleEntry: TSingleEntry) => {
          return <SavedEntriesListSingle entryData={singleEntry} key={singleEntry.url} />;
        })}
      </AnimatePresence>
    </div>
  );
};

export default SavedEntriesList;

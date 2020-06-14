import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TSingleEntry, getStoredEntries, updateStoredEntries } from "~/src/utility";
import Button from "~/src/components/Button/Button";
import Input from "~/src/components/Form/Input";
import useFormInput from "~/src/utility/hooks/useFormInput";
import { createAnimationDefinition } from "~/src/utility/animation";

interface SavedEntriesListSingleProps {
  entryData: TSingleEntry;
}

interface SavedEntriesListProps {
  savedEntries: TSingleEntry[];
}

const SavedEntriesListSingle: React.FunctionComponent<SavedEntriesListSingleProps> = ({ entryData }) => {
  const [editModeOn, setEditModeOn] = useState(false);
  const [labelsInput] = useFormInput(entryData.labels.join(", ").toString());

  const toggleEditMode = () => {
    setEditModeOn((currentState) => !currentState);
  };

  const deleteSingleEntry = async () => {
    const didConfirm = window.confirm("Are you sure you want to delete this entry? This action cannot be undone!");

    if (didConfirm) {
      const storedEntries = await getStoredEntries();
      const newEntries = storedEntries.filter((singleEntry) => singleEntry.url !== entryData.url);

      updateStoredEntries({ updatedEntries: newEntries });
    }
  };

  return (
    <motion.div className="saved-entries__item" {...createAnimationDefinition({ animationType: "heightIn" })}>
      <a className="saved-entries__url" href={entryData.url} target="_blank" rel="noreferrer">
        {entryData.url}
      </a>
      <div className="saved-entries__labels">
        <Input disabled={!editModeOn} {...labelsInput} />
      </div>
      <div className="saved-entries__actions">
        <Button onClick={toggleEditMode} variant={editModeOn ? "success" : "primary"}>
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

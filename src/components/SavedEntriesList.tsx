import React, { useState } from "react";
import { TSingleEntry } from "~/src/utility";
import Button from "~/src/components/Button";

interface SavedEntriesListSingleProps {
  entryData: TSingleEntry;
}

interface SavedEntriesListProps {
  savedEntries: TSingleEntry[];
}

const SavedEntriesListSingle: React.FunctionComponent<SavedEntriesListSingleProps> = ({ entryData }) => {
  const [editModeOn, setEditModeOn] = useState(false);

  const toggleEditMode = () => {
    setEditModeOn((currentState) => !currentState);
  };

  return (
    <tr className="table__row">
      <td className="table__cell">{entryData.url}</td>
      <td className="table__cell">{entryData.labels.join(", ").toString()}</td>
      <td className="table__cell">
        <Button variant="secondary" href={entryData.url} target="_blank" rel="noreferrer">
          Open GitHub Repo
        </Button>{" "}
        <Button onClick={toggleEditMode}>Edit {editModeOn ? "On" : "Off"}</Button>
        <Button variant="danger" className="btn btn--danger single-entry__delete">
          Delete Entry
        </Button>
      </td>
    </tr>
  );
};

const SavedEntriesList: React.FunctionComponent<SavedEntriesListProps> = ({ savedEntries }) => {
  if (savedEntries.length === 0) {
    return <p>There are no entries saved yet.</p>;
  }

  return (
    <table className="table table--bordered">
      <thead className="table__header">
        <th>URL</th>
        <th>Tags</th>
        <th>Actions</th>
      </thead>
      <tbody className="table__body">
        {savedEntries.map((singleEntry: TSingleEntry) => {
          return <SavedEntriesListSingle entryData={singleEntry} key={singleEntry.url} />;
        })}
      </tbody>
    </table>
  );
};

export default SavedEntriesList;

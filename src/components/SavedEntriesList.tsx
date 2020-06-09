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
    <tr className="table-row">
      <td className="table-cell">
        <a href={entryData.url} target="_blank" rel="noreferrer">
          {entryData.url}
        </a>
      </td>
      <td className="table-cell">{entryData.labels.join(", ").toString()}</td>
      <td className="table-cell">
        <Button onClick={toggleEditMode}>Edit {editModeOn ? "On" : "Off"}</Button>
        <Button variant="danger">Delete Entry</Button>
      </td>
    </tr>
  );
};

const SavedEntriesList: React.FunctionComponent<SavedEntriesListProps> = ({ savedEntries }) => {
  if (savedEntries.length === 0) {
    return <p>There are no entries saved yet.</p>;
  }

  return (
    <table className="table table-striped table-bordered">
      <thead className="thead-dark">
        <tr>
          <th>URL</th>
          <th>Tags</th>
          <th>Actions</th>
        </tr>
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

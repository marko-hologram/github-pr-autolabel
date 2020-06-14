import React, { ReactElement } from "react";
import useStoredEntries from "~/src/utility/hooks/useStoredEntries";
import { Button } from "~/src/components/Button";

interface getPopupMainMessage {
  numberOfStoredEntries: number;
}

const getPopupMainMessage = ({ numberOfStoredEntries }: getPopupMainMessage) => {
  return numberOfStoredEntries === 0
    ? "You currently don't have any configuration stored, why don't you add some entries in the settings page?"
    : `You have ${numberOfStoredEntries} ${numberOfStoredEntries > 1 ? "entries" : "entry"} stored`;
};

const PopupPage = (): ReactElement => {
  const storedEntries = useStoredEntries();

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="popup-main">
      <p className="popup-main__message">{getPopupMainMessage({ numberOfStoredEntries: storedEntries.length })}</p>
      <Button variant="secondary" onClick={openOptionsPage}>
        Open Settings
      </Button>
    </div>
  );
};

export default PopupPage;

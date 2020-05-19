import { MessageType } from "~/src/constants";
import { setPRLabels, TSingleEntry } from "~/src/utility";

chrome.runtime.onMessage.addListener(function (request) {
  if (request && request.type === MessageType.MATCHED_PR_PAGE_OPENED) {
    const entryData: TSingleEntry = request.entryData;
    setPRLabels(entryData.labels);
  }
});

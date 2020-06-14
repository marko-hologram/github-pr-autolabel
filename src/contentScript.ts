import "toastify-js/src/toastify.css";
import "~/src/style/style-content.scss";
import { MessageType } from "~/src/constants";
import { setPRLabels, TSingleEntry, getLabelsListHTML } from "~/src/utility";
import { showToast } from "~/src/toasts";

chrome.runtime.onMessage.addListener(async (request) => {
  if (request && request.type === MessageType.MATCHED_PR_PAGE_OPENED) {
    const entryData: TSingleEntry = request.entryData;

    try {
      await setPRLabels(entryData.labels);
    } catch (error) {
      showToast.error(
        `There was an error while trying to set labels for this pull request. Please set them manually.<br /> Labels you were trying to set were: ${getLabelsListHTML(
          entryData.labels
        )}`
      );
    }
  }
});

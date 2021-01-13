import { ACTIVE_DOMAIN, MessageType } from "~/src/constants";
import { TSingleEntry, getStoredEntries, initUserSettings } from "~/src/utility";

chrome.runtime.onInstalled.addListener(async () => {
  if (chrome.declarativeContent) {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostEquals: ACTIVE_DOMAIN },
            }),
          ],
          actions: [new chrome.declarativeContent.ShowPageAction()],
        },
      ]);
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const storedEntries = await getStoredEntries();
    const matchedEntry = storedEntries.find((singleEntry: TSingleEntry) => tab.url.includes(singleEntry.url.replace(/\/+$/, "") + "/compare/"));

    if (matchedEntry) {
      chrome.tabs.sendMessage(tabId, { type: MessageType.MATCHED_PR_PAGE_OPENED, entryData: matchedEntry });
    }
  }
});

chrome.runtime.onStartup.addListener(() => {
  initUserSettings();
});

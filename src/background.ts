import { ACTIVE_DOMAIN } from "~/src/constants";

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("changeInfo", changeInfo);
  // read changeInfo data and do something with it
  // like send the new url to contentscripts.js
  if (changeInfo.url) {
    chrome.runtime.sendMessage("", {
      message: "hello sendMessage!",
      url: changeInfo.url,
    });
    chrome.tabs.sendMessage(tabId, {
      message: "hello!",
      url: changeInfo.url,
    });
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
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
});

console.log("fjiesngbsi");

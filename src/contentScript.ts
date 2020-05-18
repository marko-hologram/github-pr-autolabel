import { getStoredEntries } from "~/src/utility";

let STORED_ENTRIES = [];

getStoredEntries().then((items) => {
  STORED_ENTRIES = items;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request", request);
  // listen for messages sent from background.js
  console.log(request.url);
  // if (request.message === "hello!") {
  //   // new url is now in content scripts!
  // }
});

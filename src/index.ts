import "~/src/style/style.scss";
import "~/src/popup";

const openSettingsButton = document.getElementById("open-settings");

openSettingsButton?.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

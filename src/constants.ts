export const ACTIVE_DOMAIN = "github.com";
export const SAVED_ENTRIES_STORAGE_KEY = "savedRepos";
export const SAVED_SETTINGS_STORAGE_KEY = "userSettings";

export const MessageType = {
  PAGE_RENDERED: "pageRendered",
  MATCHED_PR_PAGE_OPENED: "pullRequestPageOpened",
};

export type IUserSettings = {
  showLabelsAddSuccessMessage: boolean;
};

export type AddonMessage = {
  tabId: number,
  action: `get`
} | {
  tabId: number,
  action: `set`,
  value: number
} | {
  action: `show`
};
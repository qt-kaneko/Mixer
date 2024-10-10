import { AddonMessage } from "../AddonMessage";

const _label = document.querySelector<HTMLSpanElement>(`#label`)!;
const _slider = document.querySelector<HTMLInputElement>(`#slider`)!;

let _tabId: number;

async function main()
{
  _slider.addEventListener(`input`, onVolumeChanged);

  let currentTab = await browser.tabs
                                .query({currentWindow: true, active: true})
                                .then(tabs => tabs[0]);
  _tabId = currentTab.id!;

  let addonMessage: AddonMessage = {
    tabId: _tabId,
    action: `get`
  };
  let value: number = await browser.runtime.sendMessage(addonMessage);

  _slider.value = value + ``;
  _label.textContent = Math.round(value * 100) + ``;
}
main();

async function onVolumeChanged()
{
  let value = +_slider.value;
  if (value > 1 && value < (1 + 0.2))
  {
    value = 1;
    _slider.value = value + ``;
  }

  _label.textContent = Math.round(value * 100) + ``;

  let addonMessage: AddonMessage = {
    action: `set`,
    value: value,
    tabId: _tabId
  };

  browser.tabs.sendMessage(_tabId, addonMessage);
  browser.runtime.sendMessage(addonMessage);
}
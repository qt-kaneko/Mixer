import { AddonMessage } from "./AddonMessage";

function main()
{
  browser.runtime.onMessage.addListener(onMessage);
}
main();

function onMessage(message: unknown,
                   sender: browser.runtime.MessageSender,
                   sendResponse: (response?: unknown) => void)
{
  onMessageAsync(message, sender)
    .then(sendResponse)
    .catch(sendResponse);

  return true;
}
async function onMessageAsync(message: unknown,
                              sender: browser.runtime.MessageSender)
{
  let addonMessage = message as AddonMessage;

  if (addonMessage.action === `get`)
  {
    let tabId = addonMessage.tabId !== -1
              ? addonMessage.tabId
              : sender.tab!.id!;
    let key = tabId + ``;

    let value = (await browser.storage.session.get(key))[key] ?? 1;
    return value;
  }
  else if (addonMessage.action === `set`)
  {
    let tabId = addonMessage.tabId !== -1
              ? addonMessage.tabId
              : sender.tab!.id!;
    let key = tabId + ``;

    await browser.storage.session.set({
      [key]: addonMessage.value
    });
  }
  else if (addonMessage.action === `show`)
  {
    let tabId = sender.tab!.id!;

    await browser.pageAction.show(tabId);
  }
  else throw new Error();
}
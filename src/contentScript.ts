import { AddonMessage } from "./AddonMessage";

const _audio = new AudioContext();
const _gain = _audio.createGain();

const _sources = new Map<HTMLMediaElement, MediaElementAudioSourceNode>();

let _shown = false;

async function main()
{
  _gain.connect(_audio.destination);

  for (let media of getMediaElements(document.documentElement))
    onNodeAdded(media);

  let observer = new MutationObserver(mutations => {
    for (let mutation of mutations)
    {
      for (let node of mutation.addedNodes)
        if (node instanceof Element)
          for (let subnode of getMediaElements(node))
            onNodeAdded(subnode);

      for (let node of mutation.removedNodes)
        if (node instanceof Element)
          for (let subnode of getMediaElements(node))
            onNodeRemoved(subnode);
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  browser.runtime.onMessage.addListener(onMessage);

  let addonMessage: AddonMessage = {
    tabId: -1,
    action: `get`
  };
  let value: number = await browser.runtime.sendMessage(addonMessage);

  _gain.gain.value = value;
}
main();

function getMediaElements(element: Element)
{
  let mediaElements: HTMLMediaElement[] = [
    ...element.getElementsByTagName(`audio`),
    ...element.getElementsByTagName(`video`)
  ];

  if (element instanceof HTMLMediaElement)
  {
    mediaElements.push(element);
  }

  return mediaElements;
}

function onNodeAdded(node: HTMLMediaElement)
{
  if (!_shown)
  {
    let addonMessage: AddonMessage = {
      action: `show`
    };

    browser.runtime.sendMessage(addonMessage);
  }

  // If already added node is readded (why this even possible???)
  if (_sources.has(node)) return;

  let source = _audio.createMediaElementSource(node);
  source.connect(_gain);

  _sources.set(node, source);
}
function onNodeRemoved(node: HTMLMediaElement)
{
  let source = _sources.get(node)!;

  source.disconnect();
  _sources.delete(node);
}

function onMessage(message: unknown)
{
  let addonMessage = message as AddonMessage;

  if (addonMessage.action === `set`)
  {
    _gain.gain.value = addonMessage.value;
  }
}
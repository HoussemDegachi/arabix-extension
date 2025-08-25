import posthog from "posthog-js/dist/module.no-external"
import { Storage } from "@plasmohq/storage"

export const createToastByBackground = (message, toastType) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "createToast",
        toastType,
        message
      })
    }
  })
}

export const isInjectablePage = (url: string): boolean => {
  const nonInjectableProtocols = [
    'about:', 'chrome:', 'chrome-extension:',
    'moz-extension:', 'firefox:', 'resource:',
    'brave:', 'edge:'
  ];
  return !nonInjectableProtocols.some(protocol => url.startsWith(protocol));
};


export const logInUser = async () => {
  const storage = new Storage();
  let userId = await storage.get("userId")
  if (!userId) { userId = self.crypto.randomUUID(); storage.set("UserId", userId) }
  // console.log(`User id pulled from local storage: ${userId}`)
  try {
    posthog.identify(userId)
    return true
  } catch {
    return false
  }

}
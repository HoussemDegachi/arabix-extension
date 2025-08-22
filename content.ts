import { createToast } from "~utils/toast"
import { transliterateSelectedInput } from "~utils/transliterate"

let port;
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    port = chrome.runtime.connect();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getInputToTransliterate") {
    // console.log("Shortcut triggered from background!")
    transliterateSelectedInput()
  }

  if (message.type === "createToast") {
    createToast(message.message, message.toastType)
  }
})
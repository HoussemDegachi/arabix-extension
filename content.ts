import { createToast } from "~utils/toast"
import { transliterateSelectedInput } from "~utils/transliterate"
import FingerprintJS from "@fingerprintjs/fingerprintjs"


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getInputToTransliterate") {
    console.log("Shortcut triggered from background!")
    transliterateSelectedInput()
  }

  if (message.type === "createToast") {
    createToast(message.message, message.toastType)
  }

  if (message.type === "getUserId") {
  const fpPromise = FingerprintJS.load();
  fpPromise
    .then(fp => fp.get())
    .then(result => {
        const userId = result.visitorId;
        console.log(userId);
        sendResponse({type: "success", userId})
    })
    .catch(error => sendResponse({type: "error", error}));
    return true
  }
})
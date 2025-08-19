import { createToast } from "~utils/toast"
import { transliterateSelectedInput } from "~utils/transliterate"



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getInputToTransliterate") {
    console.log("Shortcut triggered from background!")
    transliterateSelectedInput()
  }

  if (message.type === "createToast") {
    createToast(message.message, message.toastType)
  }
})
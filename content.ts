import { createToast } from "~utils/toast"
import { transliterateSelectedInput } from "~utils/transliterate"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getInputToTransliterate") {
    // console.log("Shortcut triggered from background!")
    transliterateSelectedInput()
  }

  if (message.type === "createToast") {
    createToast(message.message, message.toastType)
  }
})

// import { createToast } from "~utils/toast"
// import { transliterateSelectedInput } from "~utils/transliterate"

// // Check if the current site is supported
// const isSupportedSite = () => {
//   const unsupportedSites = [
//     'chrome://',
//     'chrome-extension://',
//     'file://',
//     'edge://',
//     'about:'
//   ];
  
//   return !unsupportedSites.some(site => window.location.href.startsWith(site));
// };

// if (isSupportedSite()) {
//   let port;
//   window.addEventListener('pageshow', (event) => {
//     if (event.persisted) {
//       port = chrome.runtime.connect();
//     }
//   });

//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === "getInputToTransliterate") {
//       transliterateSelectedInput()
//     }

//     if (message.type === "createToast") {
//       createToast(message.message, message.toastType)
//     }
//   });
// }
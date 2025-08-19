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

export const logInUser = async () => {
  const storage = new Storage();
  const userId = await storage.get("userId")
  if (userId) {
    console.log(`User id pulled from local storage: ${userId}`)
    try {
      posthog.identify(userId)
      return true
    } catch {
      return false
    }
  }

  return await new Promise((resolve, reject) =>  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "getUserId",
        }).then((res) => {
          if (res.type === "error") throw res.error
          console.log(`User identified: ${res.userId}`)
          posthog.identify(res.userId)
          storage.set("userId", res.userId)
          resolve(true)
        }).catch((err) => {
          console.error(err)
          resolve(false)
        })
      }
    }))
}
import { Storage } from "@plasmohq/storage"

  ; import { generateInitialUsage } from "~utils/usage";
import type { Usage } from "~types/Usage";
import dayjs from "dayjs";
import { getTempTransliteration } from "~utils/api";
import { createToast } from "~utils/toast"
import { createToastByBackground } from "~utils/background/helpers";

(async () => {
  const storage = new Storage();
  const today = dayjs().format("MMM D")
  let isAppRunning: boolean = await storage.get("isAppRunning");
  let usageLog: Usage = await storage.get("usageLog")
  let allTimeUsage: number | null = await storage.get("allTimeUsage")
  if (!usageLog) {
    const initialData = generateInitialUsage()
    storage.set("usageLog", initialData)
  } else if (usageLog[usageLog.length - 1].date != today) {
    usageLog.splice(0, 1)
    usageLog.push({
      usage: 0,
      date: today
    })
    storage.set("usageLog", usageLog)
  }
  if (!allTimeUsage) {
    storage.set("allTimeUsage", 0)
  }
  if (isAppRunning === undefined) isAppRunning = true
  storage.watch({
    isAppRunning: (c) => {
      isAppRunning = c.newValue
    },
    usageLog: (c) => {
      usageLog = c.newValue
    },
    allTimeUsage: (c) => {
      allTimeUsage = c.newValue
    }
  })
  const backend_url = process.env.PLASMO_PUBLIC_BACKEND_URL

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == "transliterate") {
      const { text } = request.payload
      console.log(`Message recieve (translitrate): ${text}`)
      getTempTransliteration(text).then((res: string) => {
        console.log("Recieved data")
        console.log(res)
        return sendResponse({ data: { text: res } })
      }).catch((err) => {
        createToastByBackground(err, "error")
        return sendResponse({ data: { text: text } })
      })
      return true
    }

    if (request.type == "createToast") {
      const { message, toastType } = request.payload
      console.log("Creating toast")
      createToastByBackground(message, toastType)
    }
  })

  chrome.commands.onCommand.addListener((command) => {
    if (command === "transliterateInput" && isAppRunning) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "getInputToTransliterate"
          })
        }
      })
    }
  })
})()
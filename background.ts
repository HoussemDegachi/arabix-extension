import axios from "axios"
import { Storage } from "@plasmohq/storage"

  ;import { generateInitialUsage, increaseUsage } from "~utils/usage";
import type { Usage } from "~types/Usage";
import dayjs from "dayjs";
 (async () => {

   const storage = new Storage();
   const today = dayjs().format("MMM D")
   let isAppRunning: boolean = await storage.get("isAppRunning");
   let usageLog: Usage = await storage.get("usageLog")
   let allTimeUsage:number | null = await storage.get("allTimeUsage") 
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
    console.log(backend_url)
    
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type == "transliterate") {
        const newUsageLog = increaseUsage(usageLog)
        storage.set("usageLog", newUsageLog)
        storage.set("allTimeUsage", allTimeUsage + 1)
        const { text } = request.payload
        console.log(`Message recieve (translitrate): ${text}`)
        axios
        .post(`${backend_url}/transliterate`, { text })
        .then((data) => {
          console.log("Recieved data")
          console.log(data)
          return sendResponse(data)
        })
        .catch((err) => sendResponse({ error: err.message }))
        return true
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
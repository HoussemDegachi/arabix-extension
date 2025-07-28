import axios from "axios"

const backend_url = process.env.PLASMO_PUBLIC_BACKEND_URL
console.log(backend_url)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type == "transliterate") {
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

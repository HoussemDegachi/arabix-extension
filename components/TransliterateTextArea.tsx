import React, { useState } from "react"
import submitIcon from "../assets/icon/submit.svg"
import LoadingText from "./ui/LoadingText"

function TransliterateTextArea() {
    const [text, setText] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [isRtl, setIsRtl] = useState<boolean>(false)
    const handleChange = (e) => {
        if (isRtl) setIsRtl(false)
        setText(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        chrome.runtime.sendMessage({
            type: "transliterate",
            payload: {text}
        }, (response) => {
            setLoading(false)
            if (response.error) {
                console.error("An error occured", response.error)
                setText("An error occured")
            } else {
                console.log("React: recieved response")
                console.log(response)
                setIsRtl(true)
                setText(response.data.text)
            }
        })
    }
  return (
    <form className="relative" onSubmit={handleSubmit}>
      <textarea
        onChange={handleChange}
        placeholder={`${!loading ? 'Ikteb bl 3arbi' : ''}`}
        disabled={loading}
        name="transliterate"
        id="transliterate"
        value={text}
        dir={`${isRtl && 'rtl'}`}
        className="resize-none min-h-20 g-gray-50 border border-gray-300 text-[12px] rounded-lg block w-full p-2.5 focus:outline-6 focus:outline-main focus:bg-gray-50">
      </textarea>
      {(!!text && !loading) && (
        <button
          type="submit"
          className="absolute bottom-2 right-2 w-[20px] h-[20px] rounded-full bg-slate-400 flex justify-center items-center p-[2px]">
          <img src={submitIcon} alt="transliterate arabizi" />
        </button>
      )}
       <LoadingText setText={setText} loading={loading} />
    </form>
  )
}

export default TransliterateTextArea

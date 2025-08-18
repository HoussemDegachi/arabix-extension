import React, { useRef, useState } from "react"
import submitIcon from "../assets/icon/submit.svg"
import LoadingText from "./ui/LoadingText"
import { getTransliteration, transliterateSelectedInput } from "~utils/transliterate"

function TransliterateTextArea() {
    const [text, setText] = useState<string>("")
    const [isRtl, setIsRtl] = useState<boolean>(false)
    const formRef = useRef(null);
    const handleChange = (e) => {
        if (isRtl) setIsRtl(false)
        setText(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (formRef.current && text.length != 0) {
          setIsRtl(true)
          transliterateSelectedInput(formRef.current)
        }
    }
  return (
    <form className="relative" onSubmit={handleSubmit}>
      <textarea
        onChange={handleChange}
        ref={formRef}
        placeholder='ikteb bl 3arabi'
        name="transliterate"
        id="transliterate"
        value={text}
        dir={`${isRtl && 'rtl'}`}
        className="resize-none min-h-20 g-gray-50 border border-gray-300 text-[12px] rounded-lg block w-full p-2.5 focus:outline-6 focus:outline-main focus:bg-gray-50">
      </textarea>
      {(!!text) && (
        <button
          type="submit"
          className="absolute bottom-2 right-2 w-[20px] h-[20px] rounded-full bg-slate-400 flex justify-center items-center p-[2px]">
          <img src={submitIcon} alt="transliterate arabizi" />
        </button>
      )}
    </form>
  )
}

export default TransliterateTextArea

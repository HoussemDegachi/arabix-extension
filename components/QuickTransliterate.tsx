import React, { useState } from 'react'
import submitIcon from "../assets/icon/submit.svg"

function QuickTransliterate() {
  const [text, setText] = useState<string>("")
  return (
    <div className='mb-px_base'>
      <h2 className="label mb-[1px]">Arabizi to Arabic</h2>
      <form className='relative'>
        <textarea onChange={(e) => {setText(e.target.value)}} placeholder='Ikteb bl 3arabi' name="transliterate" id="transliterate"  className='resize-none min-h-20 g-gray-50 border border-gray-300 text-[12px] rounded-lg block w-full p-2.5 focus:outline-6 focus:outline-main focus:bg-gray-50'>
            {text}
        </textarea>
        {
          !!text &&
          <button type="submit" className='absolute bottom-2 right-2 w-[20px] h-[20px] rounded-full bg-slate-400 flex justify-center items-center p-[2px]'><img src={submitIcon} alt="transliterate arabizi" /></button>
        }
      </form>
    </div>
  )
}

export default QuickTransliterate
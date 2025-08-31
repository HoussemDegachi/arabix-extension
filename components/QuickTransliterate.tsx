import React, { useEffect, useState } from 'react'
import TransliterateTextArea from './TransliterateTextArea'

function QuickTransliterate() {
  const [isAvailable, setIsAvailable] = useState<boolean>(true)
  
  useEffect(() => {
    chrome.runtime.sendMessage({type: "isInjectable"}, (res: {state: boolean}) => {
      setIsAvailable(res?.state)
    })
  }, [])
  return (
    <div className='mb-px_base'>
      <h2 className="label mb-[1px]">Quick transliterate</h2>
      {
        isAvailable ? 
        <TransliterateTextArea /> :
        <p className='text-center'>Sorry this service is not available on this tab!</p>
      }
    </div>
  )
}

export default QuickTransliterate
import React, { useEffect } from "react"

import startIcon from "../assets/icon/start.svg"
import stopIcon from "../assets/icon/stop.svg"
import { useStorage } from "@plasmohq/storage/hook"

function RunButton() {
  const [isRunning, setIsRunning] = useStorage("isAppRunning", true)


  return (
    <>
      {isRunning ? (
        <button onClick={() => setIsRunning(!isRunning)} className="bg-[#dd4b4b] hover:bg-opacity-90 main-btn">
          <img src={stopIcon} alt="stop" className="w-6" />
          Stop
        </button>
      ) : (
        <button onClick={() => setIsRunning(!isRunning)} className="bg-main hover:bg-opacity-90 main-btn">
          <img src={startIcon} alt="start" className="w-6" />
          Start
        </button>
      )}
    </>
  )
}

export default RunButton

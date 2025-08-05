import React, { useEffect, useState } from "react"
import Graph from "./Graph"
import RunButton from "./RunButton"
import { useStorage } from "@plasmohq/storage/dist/hook"

function Info() {
  const [allTimeUsage, setAllTimeUsage] = useStorage("allTimeUsage", 0)
  const [usageLog, setUsageLog] = useStorage("usageLog")
  const [todayUsage, setTodayUsage] = useState<number>(0);
  useEffect(() => {
    if (usageLog === undefined) return;
    setTodayUsage(usageLog[usageLog.length - 1].usage)
  }, [usageLog])
  console.log(todayUsage)
  return (
    <div className="border-b-2 pb-py_small mb-px_base flex justify-between gap-2">
      <div>
        <h2 className="label">Today's usage</h2>
        <div className="pt-py_small">
          <p className="main-stat">
            {todayUsage}<span className="max-stat">/&infin;</span>
          </p>
          <div>
            <Graph />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="label">Total usage</h2>
          <p className="secondary-stat">{allTimeUsage}</p>
        </div>  
        <div>
          <h2 className="label mb-2">Quick controls</h2>
          <RunButton />
        </div>
      </div>
    </div>
  )
}

export default Info

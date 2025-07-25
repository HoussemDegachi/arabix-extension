import React from "react"
import Graph from "./Graph"
import RunButton from "./RunButton"

function Info() {
  return (
    <div className="border-b-2 pb-py_small mb-px_base flex justify-between gap-2">
      <div>
        <h2 className="label">Today's usage</h2>
        <div className="pt-py_small">
          <p className="main-stat">
            100<span className="max-stat">/10</span>
          </p>
          <div>
            <Graph />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="label">Total usage</h2>
          <p className="secondary-stat">200</p>
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

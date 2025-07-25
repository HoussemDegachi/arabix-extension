import React from 'react'
import type { Model } from '~types/Model'

function QuickSettings() {
  const models: Model[] = [
    {
      title: "Arabix-small (Alpha)",
      hasAccess: true
    }
  ]
  return (
    <div className='mb-px_base'>
      <h2 className="label mb-[1px]">Model</h2>
      {/* <select className='border-[rgba(145, 148, 156, 0.95)] border-2 rounded-md px-4 py-2 font-bold text-sm w-full'>
      </select> */}
        <select id="countries" className="g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-6 focus:outline-main block w-full p-2.5">        
          {
            models.map((model: Model, _) => <option value={model.title} key={_}>{model.title}</option>)
          }
      </select>
    </div>
  )
}

export default QuickSettings
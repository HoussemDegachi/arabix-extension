import React from 'react'
import upgrade from "../assets/icon/upgrade.svg"

function Footer() {
  return (
    <div className='flex justify-between'>
      <figure className='flex gap-2 items-center'>
        <div className="w-[22px] h-[22px] rounded-full bg-gray-500"></div>
        <p className='font-bold text-[14px] text-[#1e1e1e]'>User n...</p>
      </figure>
      <button className="bg-main rounded-md text-white text-center px-2 py-2 text-[10px] font-bold flex justify-center items-center gap-[4px]">
        <img src={upgrade} className='w-[18px]' alt="upgrade" />
        Upgrade to pro
      </button>
    </div>
  )
}

export default Footer
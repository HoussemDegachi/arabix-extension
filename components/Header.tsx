import React from 'react'
import navDecoration from "../assets/ui/nav_decorations.svg"
import appIcon from "../assets/app_icon.webp"
import icon from "../assets/icon.png"

function Nav() {
  return (
    <div id='header' className='flex justify-between items-center pl-px_base border-b-2 border-label'>
      <figure className='flex items-center gap-2'>
        <img src={appIcon} alt="icon" className='w-[12px]' draggable={false}/>
        <h1 className='text-black font-bold text-[17px]'>arabix</h1>
        </figure>
      {/* <figure>
        <img src={icon} alt="icon" className='w-6' />
      </figure> */}
      <img src={navDecoration} draggable={false} alt="nav_decorations" className='h-[50px] w-[150px]'/>
    </div>
  )
}

export default Nav
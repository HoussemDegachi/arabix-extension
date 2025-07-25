import { useState } from "react"

import "./index.css"

import Footer from "~components/Footer"
import Header from "~components/Header"
import Info from "~components/Info"
import QuickSettings from "~components/QuickSettings"
import QuickTransliterate from "~components/QuickTransliterate"

function IndexPopup() {
  return (
    <div className="w-[330px] h-[420px] box-border border-none">
      <header>
        <Header />
      </header>
      <main className="px-px_base pt-py_base pb-[6px]">
        <Info />
        <QuickSettings />
        <QuickTransliterate />
      </main>
      <footer className="border-t-2 border-label py-[12px] px-px_base">
        <Footer />
      </footer>
    </div>
  )
}

export default IndexPopup

import dynamic from 'next/dynamic'
import React from 'react'

let Header=dynamic(()=>import("../Header/Header"))
let Footer=dynamic(()=>import("../Footer/Footer"))

const Wrapper = ({children}:{children:React.ReactNode}) => {
  return (
    <>
    <Header/>
      {children}
    <Footer/>
    </>
  )
}

export default Wrapper

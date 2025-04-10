import Image from 'next/image'
import React from 'react'
import errorimg from '@/public/assets/error.svg'
import { GoArrowLeft, GoArrowRight } from 'react-icons/go'
import Link from 'next/link'


const PagenotFound = () => {
  return (
    <div className="container">

       <div className='flex flex-col items-center mb-9'>
        <Image alt='error' src={errorimg} height={300} width={300}/>
        <h1 className='font-semibold text-4xl'>404, Page not founds</h1>
        <p>Something went wrong. It’s look that your requested could not be found. It’s look like the link is broken or the page is removed.</p>
        
          <Link href="/" className='my-3'>
          <button className="bg-[#FA8232] border p-2 border-amber-500 w-auto flex justify-center items-center max-w-[160px] gap-x-1 cursor-pointer font-semibold text-white">
          <GoArrowLeft className="text-[20px] font-semibold" />
          GO TO HOME
          </button>
          </Link>
      
      </div>
    </div>
  )
}

export default PagenotFound

import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h1 className='md:text-4xl text-xl text-gray-800 font-semibold'>Master skills. Build confidence. Get ahead.</h1>
      <p className='text-gray-500 sm:text-sm'>Unlock your potential with expert-led courses and hands-on projects.</p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <button className="px-10 py-3 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200">Get started</button>
        <button className='flex items-center gap-2'>
          Learn more
          <img src={assets.arrow_icon} alt="arrow_icon" />
        </button>
      </div>
    </div>
  )
}

export default CallToAction
import React from 'react'

const NewProjectDiv = () => {
  return (
    <div className='mt-4 min-h-[7vw] bg-slate-100 border-b-2 p-4 rounded-lg'>
        <div className='flex justify-between'>
            <h1 className='text-black' >Project 1</h1>
            <p className='text-black'>2023-08-01</p>
        </div>
        <div className='mt-5 flex justify-between'>
        <p className='text-black'>Users: Adam,Chris,John</p>
        <button className='bg-red-500 px-2  rounded-md'>Delete</button>
        </div>
    </div>
  )
}

export default NewProjectDiv
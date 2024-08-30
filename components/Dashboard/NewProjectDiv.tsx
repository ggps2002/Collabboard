import React from 'react'

const NewProjectDiv = () => {
  return (
    <div className='min-h-[7vw] border-y-2 p-[2vw] '>
      <div className='flex justify-between'>
        <h3  >Project 1</h3>
        <p >2023-08-01</p>
      </div>
      <div className='mt-5 flex justify-between'>
        <p >Users: Adam,Chris,John</p>
        <div className='flex'>
          <button className='bg-green-500 px-[.5vw] mr-4  rounded-md'>View</button>
          <button className='bg-red-500 px-[.5vw]  rounded-md'>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default NewProjectDiv
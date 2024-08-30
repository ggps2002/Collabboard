import React from 'react'

const Transition = () => {
  return (
    <div className='relative w-screen h-screen bg-[#1E232E] flex items-center justify-center'>
        <div className='absolute top-1/2 left-1/2 ml-[calc(0.7rem-0.5vw)] overflow-hidden'>
            <div className='w-16 h-16 bg-[#344793] rounded-tl-[120px] rounded-br-[6px] animate-rotate-bottom-right'></div>
        </div>
        <div className='absolute top-1/2 left-[49%] overflow-hidden'>
            <div className=' w-16 h-16 bg-[#4A6CF7] rounded-tr-[120px] rounded-bl-[6px] animate-rotate-bottom-left'></div>
        </div>
        <style jsx>{`
          @keyframes rotateBottomLeftAnimation {
            0%{
              transform: rotate(0deg);
            }
            30%,60%{
              transform: rotate(90deg);
            }
            100%,70%{
              transform: rotate(0deg);
            }
          }

          @keyframes rotateBottomRightAnimation {
            0%, 35%{
              transform: rotate(0deg);
            }
            60%,80%{
              transform: rotate(-90deg);
            }
            100%, 90%{
              transform: rotate(0deg);
            }
          }

          .animate-rotate-bottom-left {
            transform-origin: bottom left;
            animation: rotateBottomLeftAnimation 1.5s linear infinite;
            animation-delay: 0s; /* No delay, starts immediately */
          }

          .animate-rotate-bottom-right {
            transform-origin: bottom right;
            animation: rotateBottomRightAnimation 1.5s linear infinite;
            animation-delay: 0s; /* No delay, starts immediately */
          }
        `}</style>
    </div>
  )
}

export default Transition

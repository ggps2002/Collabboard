import React from 'react'
import dynamic from 'next/dynamic'

const WhiteBoard = dynamic(() => import('@/components/CanvasWorkspace/WhiteBoard'), { ssr: false })

const canvas = () => {
  return (
    <div>
      <WhiteBoard/>
    </div>
  )
}

export default canvas
'use client';

import React from 'react';
import WhiteBoard from '@/components/CanvasWorkspace/WhiteBoard';

const Canvas = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <WhiteBoard id={params.id} />
    </div>
  );
};

export default Canvas;



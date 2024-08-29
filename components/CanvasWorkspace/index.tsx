'use client'

import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';

const CanvasWorkspaceLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isErasing, setIsErasing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    if (isErasing) {
      erase(e);
    } else {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || isErasing) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const erase = (e: React.MouseEvent) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(e.nativeEvent.offsetX - 10, e.nativeEvent.offsetY - 10, 20, 20);
  };

  const updateMousePos = (e: React.MouseEvent) => {
    setMousePos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    if (isErasing) erase(e);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'black';
      ctxRef.current = ctx;
    }
  }, []);

  return (
    <div>
      <header className="flex justify-between p-4 bg-gray-950 shadow-md relative">
        <button
          className="text-2xl text-gray-100"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <div className='flex gap-5'>
          <button
            className={`bg-blue-500 p-2 rounded-md ${isErasing ? 'bg-blue-900' : ''}`}
            onClick={toggleEraser}
          >
            <p>Eraser <FontAwesomeIcon icon={faEraser} /></p>
          </button>
          <button
            className={`bg-red-500 p-2 rounded-md`}
            onClick={clearCanvas}
          >
            <p>Clear</p>
          </button>
        </div>
      </header>
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-lg text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out z-50`}
      >
        <button
          className="absolute top-4 right-4 text-white text-2xl"
          onClick={toggleSidebar}
        >
          ×
        </button>
        <nav className="flex flex-col h-full">
          <div className="p-4 text-lg font-bold">Participants</div>
          <ul className="flex-1">
            <li className="p-4 hover:bg-gray-700">user1</li>
            <li className="p-4 hover:bg-gray-700">user2</li>
            <li className="p-4 hover:bg-gray-700">user3</li>
          </ul>
        </nav>
      </div>
      <div className='h-screen w-full bg-white relative'>
        <canvas
          ref={canvasRef}
          className='w-full h-full cursor-none'
          onMouseDown={startDrawing}
          onMouseMove={(e) => {
            draw(e);
            updateMousePos(e);
          }}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div
          className={`absolute ${isErasing ? 'w-6 h-6 bg-white border-[2px] border-black' : 'w-2 h-2 bg-black'} rounded-full pointer-events-none`}
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
};

export default CanvasWorkspaceLayout;

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { Pen, Eraser } from "lucide-react";
import UndoIcon from '@mui/icons-material/Undo';
import TitleIcon from '@mui/icons-material/Title';

const Whiteboard: React.FC = () => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]); // Store refs for multiple pages
  const [tool, setTool] = useState<'pencil' | 'pen' | 'eraser'>('pencil');
  const [color, setColor] = useState('#000000');
  const [thickness, setThickness] = useState(4);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pages, setPages] = useState<number[]>([1]); // Array to track page indexes
  const colorPickRef = useRef<HTMLDivElement>(null);
  const colorPickPalleteRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<{ [key: number]: ImageData[] }>({}); // Undo stack for each page
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
  const [rectStartPos, setRectStartPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [rectCurrentShape, setRectCurrentShape] = useState<{ x: number, y: number, width: number, height: number, color: string }>({ x: 0, y: 0, width: 0, height: 0, color: '' });
  const [rectShapes, setRectShapes] = useState<{ x: number; y: number; width: number; height: number; }[]>([]);
  const [element, setElement] = useState('line');

  const handleClearCanvas = (pageIndex: number) => {
    const canvas = canvasRefs.current[pageIndex];
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleUndo = (pageIndex: number) => {
    const canvas = canvasRefs.current[pageIndex];
    if (canvas && undoStack[pageIndex]?.length > 0) {
      const context = canvas.getContext('2d');
      const previousImage = undoStack[pageIndex].pop();
      setUndoStack((prev) => ({ ...prev, [pageIndex]: [...prev[pageIndex]] }));
      if (context && previousImage) {
        context.putImageData(previousImage, 0, 0);
      }
    }
  };

  const handleToolChange = (selectedTool: 'pencil' | 'pen') => {
    setTool(selectedTool);
  };

  const addNewPage = () => {
    setPages((prevPages) => [...prevPages, prevPages.length + 1]); // Add a new page
    canvasRefs.current.push(null); // Keep canvasRefs in sync with pages
  };

  const removePage = (pageIndex: number) => {
    // Remove the page at the specified index
    console.log(pages);
    const updatedPages = pages.filter((_, index) => index !== pageIndex);
    console.log(updatedPages);
    handleClearCanvas(pageIndex);
    setPages(updatedPages);
  };



  const startDrawing = (e: React.MouseEvent, pageIndex: number) => {
    if (element === 'rectangle') {
      const canvas = canvasRefs.current[pageIndex];
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setRectStartPos({ x, y });
        setRectCurrentShape({ x, y, width: 0, height: 0, color: color }); // Store the current color with the shape
        setIsDrawingRectangle(true);
      }
    } else {
      setIsDrawing(true);
      const canvas = canvasRefs.current[pageIndex];
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          const { offsetX, offsetY } = e.nativeEvent;
          context.strokeStyle = color;
          context.lineWidth = thickness;
          context.beginPath();
          context.moveTo(offsetX, offsetY);
        }
      }
    }
  };

  const draw = (e: React.MouseEvent, pageIndex: number) => {
    if (element === 'rectangle') {
      if (!isDrawingRectangle) return;
      const canvas = canvasRefs.current[pageIndex];
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = x - rectStartPos.x;
      const height = y - rectStartPos.y;
      setRectCurrentShape({ x: rectStartPos.x, y: rectStartPos.y, width, height , color });
      drawAllShapes([...rectShapes, { x: rectStartPos.x, y: rectStartPos.y, width, height }], pageIndex);
    } else {
      if (!isDrawing) return;
      const canvas = canvasRefs.current[pageIndex];
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          const { offsetX, offsetY } = e.nativeEvent;
          context.strokeStyle = color;
          context.lineWidth = thickness;
          context.lineTo(offsetX, offsetY);
          context.stroke();
        }
      }
    }
  };

  const drawShape = (ctx: CanvasRenderingContext2D, shape: { x: any; y: any; width: any; height: any; color: string }) => {
    ctx.beginPath();
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
    ctx.strokeStyle = shape.color; // Use the color stored with the shape
    ctx.stroke();
  };

  const drawAllShapes = (allShapes: any[], pageIndex: number) => {
    const canvas = canvasRefs.current[pageIndex];
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) { // Add a null check for ctx
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        allShapes.forEach((shape) => drawShape(ctx, shape));
      } else {
        console.error("Failed to get 2D drawing context");
      }
    }
  };

  const stopDrawing = (pageIndex: number) => {
    if (element === 'rectangle') {
      setIsDrawingRectangle(false);
      if (rectCurrentShape) {
        setRectShapes([...rectShapes, rectCurrentShape]);
        drawAllShapes([...rectShapes, rectCurrentShape], pageIndex);
      }
    } else {
      setIsDrawing(false);
      const canvas = canvasRefs.current[pageIndex];
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.closePath();
          const currentImage = context.getImageData(0, 0, canvas.width, canvas.height);
          setUndoStack((prev) => ({
            ...prev,
            [pageIndex]: [...(prev[pageIndex] || []), currentImage],
          }));
        }
      }
    };
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickRef.current && !colorPickRef.current.contains(event.target as Node) &&
        colorPickPalleteRef.current && !colorPickPalleteRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  // Function to toggle the quadrilateral shape
  const toggleQuadrilateral = () => {

  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex justify-between p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="flex space-x-4">
          {/* Tool Selection */}
          {/* Color Picker */}
          {/* Thickness */}
        </div>
        {/* Add New Page Button */}
        <div className="flex space-x-4">
          <button onClick={addNewPage} className="p-2 bg-green-500 text-white rounded">
            Add Page
          </button>
        </div>
      </div>

      {/* Scrollable Canvas Area with Multiple Pages */}
      <div className="flex-grow overflow-y-scroll mt-16">
        {pages.map((_, pageIndex) => (
          <div key={pageIndex} className="mb-8">
            {/* Page Separation */}
            <div className="w-full h-full bg-white relative z-0 overflow-x-hidden border-gray-500 rounded-md">
              <div className='absolute top-16 left-6 w-12 shadow-lg z-10 rounded-lg'>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg'>
                  <div ref={colorPickRef} onClick={() => setShowColorPicker(!showColorPicker)} className='relative h-4 w-4 rounded-full' style={{ backgroundColor: `${color}` }}></div>
                  {showColorPicker && (
                    <div ref={colorPickPalleteRef} className="absolute top-2 left-[120%] z-10">
                      <SketchPicker
                        color={color}
                        onChange={(color) => setColor(color.hex)}
                      />
                    </div>
                  )}
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg'>
                  <Eraser className="h-4 w-4" color='black' />
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' onClick={() => { setElement('line'); handleToolChange('pencil') }}>
                  <Pen className="h-4 w-4" color='black' />
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' onClick={() => handleUndo(pageIndex)}>
                  <UndoIcon style={{ color: "black" }} />
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg'>
                  <TitleIcon style={{ color: "black" }} />
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' onClick={() => setThickness(12)}>
                  <div className='h-4 w-4 rounded-full' style={{ backgroundColor: `${color}` }}></div>
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' onClick={() => setThickness(8)}>
                  <div className='h-3 w-3 rounded-full' style={{ backgroundColor: `${color}` }}></div>
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' onClick={() => setThickness(4)}>
                  <div className='h-2 w-2 rounded-full' style={{ backgroundColor: `${color}` }}></div>
                </div>

                {/* Quadrilateral toggle */}
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' onClick={toggleQuadrilateral}>
                  <div className={`h-6 w-6 border-2`} onClick={() => setElement('rectangle')}></div>
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg'>
                  <div className='h-6 w-6 border-2 rounded-full'></div>
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg'>
                  <div className='w-6 border-[1px]'></div>
                </div>
              </div>
              <canvas
                className="border-2 mt-8 border-gray-400 shadow-lg rounded-lg"
                width={window.innerWidth}
                height={window.innerHeight}
                ref={(el) => {
                  canvasRefs.current[pageIndex] = el; // This now doesn't return anything
                }}
                onMouseDown={(e) => startDrawing(e, pageIndex)}
                onMouseMove={(e) => draw(e, pageIndex)}
                onMouseUp={() => stopDrawing(pageIndex)}
                onMouseLeave={() => stopDrawing(pageIndex)}
              />
              {pages.length > 1 && (
                <div className='w-full h-12 flex justify-center items-center rounded-lg'>
                  <div className="bg-red-500 p-2 rounded cursor-pointer" onClick={() => removePage(pageIndex)}>Remove Page</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

};

export default Whiteboard;

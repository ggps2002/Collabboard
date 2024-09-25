'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { SketchPicker } from 'react-color';
import { Pen, Eraser } from "lucide-react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import TitleIcon from '@mui/icons-material/Title';
import UndoIcon from '@mui/icons-material/Undo';

const Whiteboard: React.FC = () => {
  const canvasRefs = useRef<(ReactSketchCanvasRef | null)[]>([]); // Store refs for multiple pages
  const [tool, setTool] = useState<'pencil' | 'pen' | 'eraser'>('pencil');
  const [color, setColor] = useState('#000000');
  const [thickness, setThickness] = useState(4);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pages, setPages] = useState<number[]>([1]); // Array to track page indexes
  const colorPickRef = useRef<HTMLDivElement>(null);

  const handleClearCanvas = (pageIndex: number) => {
    canvasRefs.current[pageIndex]?.clearCanvas();
  };

  const handleUndo = (pageIndex: number) => {
    canvasRefs.current[pageIndex]?.undo();
  };

  const handleToolChange = (selectedTool: 'pencil' | 'pen') => {
    setTool(selectedTool);
  };

  const addNewPage = () => {
    setPages((prevPages) => [...prevPages, prevPages.length + 1]); // Add a new page
  };

  const removePage = (pageIndex: number) => {
    if (pages.length > 1) {
      setPages((prevPages) => prevPages.filter((_, index) => index !== pageIndex)); // Remove selected page
      canvasRefs.current.splice(pageIndex, 1); // Adjust refs
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickRef.current && !colorPickRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])


  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex justify-between p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="flex space-x-4">
          {/* Tool Selection */}
          {/* Color Picker */}
          {/* Thickness */}
          {/* <div className="flex items-center space-x-2">
            <label>Thickness</label>
            <input
              type="range"
              min="1"
              max="10"
              value={thickness}
              onChange={(e) => setThickness(4)}
              className="w-24"
            />
          </div> */}
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
            <div className="w-full h-[800px] bg-white relative z-0 border-2 border-gray-500 rounded-md">
              <div className='absolute mt-4 z-10 left-1/2 shadow-lg' >
                <ToggleGroup type="single">
                  <ToggleGroupItem onClick={() => handleToolChange('pencil')} value="bold" aria-label="Toggle bold" className="toggle-group-item">
                    <Pen className="h-4 w-4" color='black' />
                  </ToggleGroupItem>
                  <ToggleGroupItem onClick={() => handleToolChange('pencil')} value="italic" aria-label="Toggle italic" className="toggle-group-item">
                    <Eraser className="h-4 w-4" color='black' />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Toggle underline" className='toggle-group-item-static'>
                    <div onClick={() => setShowColorPicker(!showColorPicker)} className='h-4 w-4 rounded-full' style={{ backgroundColor: `${color}` }}></div>
                    {showColorPicker && (
                      <div ref={colorPickRef} className="absolute top-16 left-1/4 z-10">
                        <SketchPicker
                          color={color}
                          onChange={(color) => setColor(color.hex)}
                        />
                      </div>
                    )}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className='absolute mt-4 top-[15%] left-6 w-12 shadow-lg z-10 rounded-lg'>
              <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' onClick={() => handleUndo(pageIndex)}>
                  <UndoIcon style={{color: "black"}}/>
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' >
                  <TitleIcon style={{color: "black"}}/>
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
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' >
                  <div className='h-6 w-6 border-2'></div>
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' >
                  <div className='h-6 w-6 border-2 rounded-full'></div>
                </div>
                <div className='w-full h-12 flex justify-center items-center toggle-group-item rounded-lg' >
                  <div className='w-6 border-[1px]'></div>
                </div>
              </div>
              <ReactSketchCanvas
                ref={(el) => {
                  canvasRefs.current[pageIndex] = el;
                }} // Store refs for each page
                strokeColor={color}
                strokeWidth={thickness}
                canvasColor="white"
                className="w-full h-full absolute z-0 "
              />
            </div>
            {/* Page Actions */}
            <div className="flex space-x-4 justify-end mt-2">
              <button
                onClick={() => handleClearCanvas(pageIndex)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Clear Page {pageIndex + 1}
              </button>
              {/* Remove Page Button */}
              {pages.length > 1 && pageIndex !== 0 && (
                <button
                  onClick={() => removePage(pageIndex)}
                  className="p-2 bg-red-700 text-white rounded"
                >
                  Remove Page {pageIndex + 1}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Whiteboard;

'use client';

import { Excalidraw } from "@excalidraw/excalidraw";
import React, { useState, useEffect, useCallback } from "react";
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import debounce from "lodash.debounce";

export default function WhiteBoard() {
  const [scenes, setScenes] = useState([{}]); // Initialize with one empty scene
  const [currentPage, setCurrentPage] = useState(0);
  const [excalidrawAPIs, setExcalidrawAPIs] = useState([]); // Store API instances for each page

  // Add a new page
  const handleAddPage = () => {
    updateScene(); // Save current page's scene data
    setScenes((prevScenes) => {
      const newScenes = [...prevScenes, { elements: [], appState: {} }];
      setCurrentPage(newScenes.length - 1);
      return newScenes;
    });
  };

  // Delete the current page
  const handleDeletePage = () => {
    if (scenes.length > 1) {
      updateScene(); // Save current page's scene data
      setScenes((prevScenes) => {
        const updatedScenes = [...prevScenes];
        updatedScenes.splice(currentPage, 1); // Remove the current page
        return updatedScenes;
      });
      setCurrentPage((prevPage) => Math.max(0, prevPage - 1));
    } else {
      alert("Cannot delete the only page!");
    }
  };

  // Move to the next page
  const handleNextPage = () => {
    updateScene(); // Save current page's scene data
    if (currentPage < scenes.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Move to the previous page
  const handlePreviousPage = () => {
    updateScene(); // Save current page's scene data
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Update the current page's drawing data
  const updateScene = useCallback(() => {
    if (excalidrawAPIs[currentPage]) {
      const sceneElements = excalidrawAPIs[currentPage].getSceneElements();
      const appState = excalidrawAPIs[currentPage].getAppState();

      console.log("Updated scene:", sceneElements, appState);

      
      setScenes((prevScenes) => {
        const updatedScenes = [...prevScenes];
        updatedScenes[currentPage] = {
          elements: JSON.parse(JSON.stringify(sceneElements)), // Deep copy elements
          appState: JSON.parse(JSON.stringify(appState)), // Deep copy appState
        };
        return updatedScenes;
      });
    }
  }, [currentPage, excalidrawAPIs]);

  // Store Excalidraw API instances for each page
  const handleAPI = useCallback((api, pageIndex) => {
    setExcalidrawAPIs((prevAPIs) => {
      const updatedAPIs = [...prevAPIs];
      updatedAPIs[pageIndex] = api;
      return updatedAPIs;
    });
  }, []);

  useEffect(() => {
    if (excalidrawAPIs[currentPage]) {
      const handleChange = debounce(() => {
        updateScene();
      }, 500);

      excalidrawAPIs[currentPage].onChange(handleChange);

      return () => {
        // Cleanup debounced handler on page change
        handleChange.cancel();
      };
    }
  }, [excalidrawAPIs, currentPage, updateScene]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Page counter */}
      <div className="text-[#434349] absolute z-20 bottom-[14px] left-[50%] translate-x-[-50%] bg-white shadow-lg border-gray-200 border-2 px-4 py-2 rounded-lg font-sans text-[14px] font-[600]">
        Page {currentPage + 1} / {scenes.length}
      </div>

      {/* Controls */}
      <div className="absolute z-20 right-[14px] top-[74px]">
        <button
          onClick={handleAddPage}
          className="bg-green-500 p-3 rounded-lg font-sans text-[12px] font-[400] mb-2"
        >
          <AddIcon style={{ color: "black" }} />
        </button>
        <br />
        <button
          onClick={handleNextPage}
          disabled={currentPage >= scenes.length - 1}
          className={`p-3 rounded-lg font-sans text-[12px] font-[400] mb-2 ${currentPage >= scenes.length - 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-white shadow-lg border-gray-100 border-2"
            }`}
        >
          <ArrowForwardIosIcon style={{ color: currentPage >= scenes.length - 1 ? "gray" : "black" }} />
        </button>
        <br />
        <button
          onClick={handlePreviousPage}
          disabled={currentPage <= 0}
          className={`p-3 rounded-lg font-sans text-[12px] font-[400] mb-2 ${currentPage <= 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-white shadow-lg border-gray-100 border-2"
            }`}
        >
          <ArrowBackIosNewIcon style={{ color: currentPage <= 0 ? "gray" : "black" }} />
        </button>
        <br />
        <button
          onClick={handleDeletePage}
          disabled={scenes.length <= 1}
          className={`p-3 rounded-lg font-sans text-[12px] font-[400] mb-2 ${scenes.length <= 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-red-500"
            }`}
        >
          <DeleteIcon style={{ color: scenes.length <= 1 ? "gray" : "black" }} />
        </button>
      </div>

      {/* Excalidraw Canvas */}
      <Excalidraw
        key={currentPage} // Force re-render when the page changes
        excalidrawAPI={(api) => handleAPI(api, currentPage)}
        initialData={{
          elements: scenes[currentPage]?.elements || [],
          appState: {
            ...scenes[currentPage]?.appState,
            collaborators: scenes[currentPage]?.appState?.collaborators || [],
          },
        }}
        style={{ position: "absolute", height: "100%", width: "100%" }}
      />
    </div>
  );
}

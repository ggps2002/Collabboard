'use client';

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Client, Account, ID, Databases, Query } from 'appwrite';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import debounce from "lodash.debounce";
import dynamic from "next/dynamic";
import PeopleIcon from '@mui/icons-material/People';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import jsPDF from "jspdf";

const Excalidraw = dynamic(
  async () => (
    await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  },
);

const exportToCanvas = dynamic(
  async () => (
    await import("@excalidraw/excalidraw")).exportToCanvas,
  {
    ssr: false,
  },
)

export default function WhiteBoard({ id }) {
  const [scenes, setScenes] = useState([{}]); // Initialize with one empty scene
  const [currentPage, setCurrentPage] = useState(0);
  const [excalidrawAPIs, setExcalidrawAPIs] = useState([]); // Store API instances for each page
  const scenesRef = useRef(scenes); // Ref to track the latest scenes

  // set the scene from the data saved on appwrite projects database
  useEffect(() => {
    const mountScene = async () => {
        try {
          console.log(id);
          const client = new Client();
          client
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
          const database = new Databases(client);
          const project = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID,
            [Query.equal("$id", id)]
          );
          console.log(project.documents[0]);
          if (project.documents[0] && project.documents[0].scene.length > 0) {
            try {
              const parsedScene = project.documents[0].scene.map((scene) => JSON.parse(scene));
              console.log(parsedScene);
              setScenes([...parsedScene]);
              console.log(scenes);
              console.log("Scene loaded successfully!");
            } catch (error) {
              console.error("Failed to parse scene JSON:", error);
              setScenes([]); // Default to an empty array if parsing fails
            }
          }
          isMounted.current = true;
        } catch (error) {
          console.error(error);
        }
      }

    mountScene();

  }, [id])

  // Save the current page's scene data
  useEffect(() => {
    const saveScene = async () => {
      try {
        console.log(id);
        const client = new Client();
        client
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
        const database = new Databases(client);
        const project = await database.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID,
          [Query.equal("$id", id)]
        );
        console.log(project.documents[0]);
        if (project.documents[0]) {
          const updatedScene = scenesRef.current.map((scene) => JSON.stringify(scene));
          console.log(updatedScene);
          await database.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID,
            project.documents[0].$id,
            { scene: updatedScene }
          );
          console.log("Scene saved successfully!");
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Call saveScene every 30 seconds
    const intervalId = setInterval(() => {
      saveScene();
    }, 10000); // 10000 milliseconds = 180 seconds

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [id, scenesRef]); // Adding dependencies so it runs whenever `id` or `scenes` change
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

  const handleExportAsPDF = async () => {
    const pdf = new jsPDF();

    for (let i = 0; i < scenes.length; i++) {
      if (excalidrawAPIs[i]) {
        const elements = scenes[i].elements;
        if (!elements || !elements.length) {
          return;
        }

        // Capture the current page's canvas with scaling
        const canvas = await exportToCanvas({
          elements,
          appState: {
            ...scenes[i].appState,
            exportWithDarkMode: false,
          },
          files: scenes[i].files,
        });

        const imgData = canvas.toDataURL("image/png");

        // Maintain canvas to fit the PDF page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Add a new page if there are more scenes
        if (i < scenes.length - 1) {
          pdf.addPage();
        }
      }
    }

    // Save the PDF
    pdf.save("whiteboard.pdf");
  };

  // Update the current page's drawing data
  const updateScene = useCallback(() => {
    if (excalidrawAPIs[currentPage]) {
      const sceneElements = excalidrawAPIs[currentPage].getSceneElements();
      const appState = excalidrawAPIs[currentPage].getAppState();
      const files = excalidrawAPIs[currentPage].getFiles();

      setScenes((prevScenes) => {
        const updatedScenes = [...prevScenes];
        updatedScenes[currentPage] = {
          elements: JSON.parse(JSON.stringify(sceneElements)), // Deep copy elements
          appState: JSON.parse(JSON.stringify(appState)), // Deep copy appState
          files, // Save image files separately
        };
        scenesRef.current = updatedScenes; // Update the ref immediately
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
    scenesRef.current = scenes; // Keep the ref updated with the latest state
  }, [scenes]);
  
  useEffect(() => {
    if (excalidrawAPIs[currentPage]) {
      let once = false;
      const handleChange = debounce(() => {
        if (scenesRef.current[currentPage] === scenes[currentPage]) {
          updateScene();
          console.log("Scenes (ref):", scenesRef.current);
          if (!once && scenesRef.current[currentPage]) {
            excalidrawAPIs[currentPage].updateScene(scenesRef.current[currentPage]);
            once = true;
          } 
        }
      }, 100);
  
      excalidrawAPIs[currentPage].onChange(handleChange);
  
      return () => {
        handleChange.cancel(); // Cleanup debounce on unmount
      };
    }
  }, [excalidrawAPIs, currentPage]);
  

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* Excalidraw Canvas */}
      <div className="h-[93%] w-full">
        <Excalidraw
          key={currentPage}
          excalidrawAPI={(api) => handleAPI(api, currentPage)}
          initialData={{
            elements: scenes[currentPage]?.elements || [],
            appState: {
              ...scenes[currentPage]?.appState,
              collaborators: scenes[currentPage]?.appState?.collaborators || [],
            },
            files: scenes[currentPage]?.files || {},
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="flex justify-between items-center h-[7%] bg-[#FFFFFF] border-t border-gray-300 px-4">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div onClick={handleExportAsPDF} className="hover:bg-[#F1F0FF] bg-gray-200 text-black font-sans text-[12px] font-[400] p-2 rounded cursor-pointer transition ease-in-out duration-300">
                  Export
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export pages as pdf</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>
        <div className="flex p-[4px] gap-[0.2rem] rounded-md border-2 shadow-lg border-gray-200">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={handleAddPage}
                  className="bg-green-500 py-2 px-[0.7rem] rounded-lg cursor-pointer"
                >
                  <AddIcon fontSize="small" style={{ fontSize: "17px" }} />
                </div>
              </TooltipTrigger>

              <TooltipContent>
                <p>Create new page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={handlePreviousPage}
                  className={`py-2 px-[0.7rem] rounded-lg ${currentPage <= 0 ? "cursor-not-allowed opacity-50" : "hover:bg-[#E0DFFF] cursor-pointer"
                    }`}
                >
                  <ArrowBackIosNewIcon
                    fontSize="small"
                    style={{ color: currentPage <= 0 ? "gray" : "black", fontSize: "17px" }}
                  />
                </div>
              </TooltipTrigger>

              <TooltipContent>
                <p>previous page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-[#434349]  bg-white p-2 font-sans text-[12px] font-[400]">
            Page {currentPage + 1} / {scenes.length}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={handleNextPage}
                  className={`py-2 px-[0.7rem] rounded-lg ${currentPage >= scenes.length - 1 ? "cursor-not-allowed opacity-50" : "hover:bg-[#E0DFFF] cursor-pointer"
                    }`}
                >
                  <ArrowForwardIosIcon
                    fontSize="small"
                    style={{
                      color: currentPage >= scenes.length - 1 ? "gray" : "black",
                      fontSize: "17px",
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  onClick={handleDeletePage}
                  className={`bg-red-500 py-2 px-[0.7rem] rounded-lg ${scenes.length <= 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    }`}
                >
                  <DeleteIcon
                    fontSize="small"
                    style={{
                      color: scenes.length <= 1 ? "gray" : "white",
                      fontSize: "17px",
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete this page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="hover:bg-[#F1F0FF] bg-gray-200 text-black font-sans text-[12px] font-[400] p-2 rounded cursor-pointer transition ease-in-out duration-300">
                  <PeopleIcon style={{ fontSize: "17px" }} /> Participants
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>See the participants</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )

}
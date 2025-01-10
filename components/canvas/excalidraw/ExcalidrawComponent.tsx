'use client';
import dynamic from 'next/dynamic';
import React, { useState, useCallback, useEffect } from 'react';

import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useToolContext } from '@/context/ToolContext';
import { Tool } from '@/types/pdf';
import { getNoteById, syncNote } from '@/db/note/Note';
import { useSettings } from '@/context/SettingsContext';

const Excalidraw = dynamic(() =>
    import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw), // Adjust the import path if necessary
    { ssr: false } // Disable server-side rendering
);

const ExcalidrawComponent = ({ id }: { id: string }) => {
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
    const [zoom, setZoom] = useState<number>(1)
    const { selectedTool } = useToolContext()
    const { first } = useSettings()

    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    const handleInitialize = useCallback((api: ExcalidrawImperativeAPI) => {
        setExcalidrawAPI(api);
        console.log('Excalidraw API initialized:', api);
    }, []);




    // Fetch initial data once when the component is mounted
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const documentData = await getNoteById(id);
                if (documentData && excalidrawAPI) {
                    // Update the scene directly when data is fetched
                    excalidrawAPI.updateScene({
                        elements: documentData.note.elements,
                        appState: documentData.note.state,
                        commitToHistory: false, // Don't add this update to the undo stack
                    });
                    setInitialDataLoaded(true); // Mark the data as loaded
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };

        if (!initialDataLoaded) {
            loadInitialData();
        }
    }, [id, excalidrawAPI, initialDataLoaded]);



    // Handle changes in the Excalidraw component
    const handleChange = (elements: [], state: any) => {
        if (elements.length < 1) return
        console.log('Excalidraw Elements Changed:', elements);
        console.log('Current Excalidraw State:', state);
        const zoomValue = state?.zoom.value

        setZoom(zoomValue)


        // Sync the updated elements to IndexedDB
        syncNote(id, { elements, state })
            .then(() => {
                console.log('Note synced successfully');
            })
            .catch((error: any) => {
                console.error('Error syncing note:', error);
            });
    };





    const fitToViewport = (
        elements, // Excalidraw elements to fit
        options = { viewportZoomFactor: 0.9, animate: true, duration: 300 }
    ) => {
        if (!excalidrawAPI) return;

        const { viewportZoomFactor, animate, duration } = options;

        // Calculate bounding box for the elements
        const boundingBox = elements.reduce(
            (acc, el) => {
                return {
                    minX: Math.min(acc.minX, el.x),
                    minY: Math.min(acc.minY, el.y),
                    maxX: Math.max(acc.maxX, el.x + el.width),
                    maxY: Math.max(acc.maxY, el.y + el.height),
                };
            },
            { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
        );

        const { minX, minY, maxX, maxY } = boundingBox;

        // Calculate the center of the bounding box
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Calculate the width and height of the bounding box
        const boxWidth = maxX - minX;
        const boxHeight = maxY - minY;

        // Calculate the new zoom level
        const viewportWidth = 1000
        const viewportHeight = 1000


        const isPanningAllowed = checkPanningAllowed(viewportWidth, viewportHeight, zoom)



        // Update Excalidraw view
        if (isPanningAllowed) return

        excalidrawAPI.scrollToContent(
            elements,
            {
                // fitToViewport:true,
                // viewportZoomFactor:zoom
            }
        );

    };



    const ScrollTo = () => {
        if (!excalidrawAPI) return;
        const elements = excalidrawAPI.getSceneElements();
        fitToViewport(elements);
    }


    function checkPanningAllowed(viewportWidth: number, viewportHeight: number, zoom: number) {
        // Calculate the dimensions of the bounding client based on the zoom level
        const boundingWidth = viewportWidth * zoom;
        const boundingHeight = viewportHeight * zoom;

        // Determine if panning is allowed
        if (boundingWidth > viewportWidth || boundingHeight > viewportHeight) {
            console.log("You can pan");
            return true
        }
        console.log("You cannot pan");
        return false
    }

    function switchTool(selectedTool: Tool) {
        if (!excalidrawAPI) return;

        // Reset the scene properties to default when switching tools
        const resetToolProperties = () => {
            excalidrawAPI.updateScene({
                appState: {
                    currentItemStrokeColor: '#000000', // Default black color
                    currentItemStrokeWidth: 1,        // Default stroke width
                    currentItemOpacity: 100,          // Full opacity
                },
            });
        };

        switch (selectedTool) {
            case 'pen':
                resetToolProperties();
                excalidrawAPI.setActiveTool({ type: 'freedraw' });
                break;
            case 'objectEraser':
                resetToolProperties();
                excalidrawAPI.setActiveTool({ type: 'eraser' });
                break;
            case 'circle':
                resetToolProperties();
                excalidrawAPI.setActiveTool({ type: 'ellipse' });
                break;
            case 'square':
                resetToolProperties();
                excalidrawAPI.setActiveTool({ type: 'rectangle' });
                break;
            case 'diamond':
                resetToolProperties();
                excalidrawAPI.setActiveTool({ type: 'diamond' });
                break;
            case 'highlighter':
                excalidrawAPI.setActiveTool({ type: 'freedraw' });
                excalidrawAPI.updateScene({
                    appState: {
                        currentItemStrokeColor: '#FFD700', // Gold color
                        currentItemStrokeWidth: 4,         // Stroke width of 4
                        currentItemOpacity: 50,            // 50% opacity
                    },
                });

                break;
            case 'text':
                resetToolProperties();
                excalidrawAPI.setActiveTool({ type: 'text' });
                break;
            case 'rectangleSelection':
                resetToolProperties();
                excalidrawAPI.setActiveTool({ type: 'selection' });
                break;
            default:
                console.warn(`Unknown tool: ${selectedTool}`);
        }
    }

    useEffect(() => {
        switchTool(selectedTool);
    }, [selectedTool, excalidrawAPI]);


    return (
        <div className='w-full h-full'>
            <Excalidraw
                onChange={handleChange}
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                handleKeyboardGlobally={false}
                zenModeEnabled={false}
                gridModeEnabled={true}
                // onPointerUpdate={(e) => console.log("pointer", e)}

                onScrollChange={(x, y) => {
                    console.log(x, y);
                    // ScrollTo()
                }}

            // initialData={initialData}

            />
        </div>
    );
};

export default ExcalidrawComponent;



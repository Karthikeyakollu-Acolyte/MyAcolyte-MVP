'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { AppState, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useToolContext } from '@/context/ToolContext';
import { Tool } from '@/types/pdf';
import { getCanvasByPageIndex } from '@/db/pdf/canvas';
import { useSettings } from '@/context/SettingsContext';

const Excalidraw = dynamic(() =>
    import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
    { ssr: false }
);

const ExcalidrawFabric = ({saveCanvas,pageIndex,currentDocumentId}:{saveCanvas:any,pageIndex:number}) => {
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
    const { selectedTool } = useToolContext();
    const {scale} = useSettings()

    const initialAppState: AppState = {
        zoom: { value: 1 },
        scrollX: 0,
        scrollY: 0,
        // Add other default app state attributes here
    };
    
    const handleChange = (elements: readonly ExcalidrawElement[], state: AppState) => {
        if (!excalidrawAPI) return;
    
        // saveCanvas(elements, state, pageIndex);
    
        let shouldUpdateScene = false;
        const newAppState: Partial<AppState> = { ...state };
    
        // Reset zoom if it changes, even slightly
        if (state.zoom.value !== initialAppState.zoom.value) {
            newAppState.zoom = { value: initialAppState.zoom.value };
            shouldUpdateScene = true;
        }
    
        // Reset scroll positions if they change, even slightly
        if (state.scrollX !== initialAppState.scrollX) {
            newAppState.scrollX = initialAppState.scrollX;
            shouldUpdateScene = true;
        }
    
        if (state.scrollY !== initialAppState.scrollY) {
            newAppState.scrollY = initialAppState.scrollY;
            shouldUpdateScene = true;
        }
    
        // Update the scene instantly if any change was detected
        if (shouldUpdateScene) {
            excalidrawAPI.updateScene({
                appState: newAppState,
            });
        }
    };
    
    
    


    useEffect(() => {
        async function fetchAndSetCanvas() {

          const canvasData = await getCanvasByPageIndex(currentDocumentId, pageIndex);
          if (canvasData && excalidrawAPI) {
            excalidrawAPI.updateScene({
              elements: canvasData.elements,
              appState: canvasData.appState,
            });
          }
        }
      
        fetchAndSetCanvas();
      }, [pageIndex, currentDocumentId, excalidrawAPI]);


    function switchTool(selectedTool: Tool) {
        if (!excalidrawAPI) return;

        // Reset the scene properties to default when switching tools
        const resetToolProperties = () => {
            excalidrawAPI.updateScene({
                appState: {
                    currentItemStrokeColor: '#000000',
                    currentItemStrokeWidth: 1,
                    currentItemOpacity: 100,
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
                        currentItemStrokeColor: '#FFD700',
                        currentItemStrokeWidth: 4,
                        currentItemOpacity: 50,
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
                resetToolProperties();
                excalidrawAPI.setActiveTool({ type: 'selection' });
        }
    }

    useEffect(() => {
        switchTool(selectedTool);
    }, [selectedTool, excalidrawAPI]);

    return (
        <div className="w-full h-full">
            <Excalidraw
                onChange={handleChange}
                excalidrawAPI={(api) => setExcalidrawAPI(api)}
                handleKeyboardGlobally={false}
                zenModeEnabled={true}
                theme="light"
                viewModeEnabled={false}
                initialData={{
                    appState: {
                        viewBackgroundColor: "transparent",
                        zoom: { value: 1 },
                        scrollX: 0,
                        scrollY: 0,
                        showHelpDialog: false,
                        theme: "light"
                    }
                }}
                UIOptions={{
                    canvasActions: {
                        changeViewBackgroundColor: false,
                        export: false,
                        loadScene: false,
                        saveToActiveFile: false,
                        saveAsImage: false,
                        theme: false,
                        clearCanvas: false
                    },
                    tools: {
                        image: false
                    }
                }}
                renderTopRightUI={null}
                renderSidebar={null}
                renderFooter={null}
            />
        </div>
    );
};

export default ExcalidrawFabric;
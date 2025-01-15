import React, { useState, useCallback, useEffect } from "react";
import { useToolContext } from "@/context/ToolContext";
import { useCanvas } from "@/context/CanvasContext";
import { v4 as uuidv4 } from "uuid";
import { useSettings } from "@/context/SettingsContext";
import { getLayersById, syncLayers } from "@/db/pdf/layers";

// Types for the layer structure
import { Layer } from "@/context/CanvasContext";
import { LayerControls } from "./LayerControls";

interface LayerManagementProps {
  pageRects: any[];
  syncToStorage: (layers?: any) => void;
  layers: any;
  setLayers: any
}

export const LayerManagement: React.FC<LayerManagementProps> = ({ pageRects, syncToStorage, layers, setLayers }) => {
  const { currentDocumentId } = useSettings();
  const { setRect } = useCanvas();


  const addLayer = useCallback(() => {
    setLayers((prevLayers) => {
      const newLayer = {
        id: uuidv4(),
        visible: true,
        content: pageRects.map(() => ({})), // Initialize empty content for each page
        name: `Layer ${prevLayers.length + 1}`,
      };
      const updatedLayers = [...prevLayers, newLayer];
      syncToStorage(updatedLayers); // Synchronize updated layers with storage
      return updatedLayers;
    });
  }, [pageRects, syncToStorage]);

  const toggleLayerVisibility = useCallback((index: number) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer, i) => (i === index ? { ...layer, visible: !layer.visible } : layer))
    );
  }, []);

  const deleteLayer = useCallback((index: number) => {
    setLayers((prevLayers) => {
      const updatedLayers = prevLayers.filter((_, i) => i !== index);
      syncToStorage(updatedLayers); // Synchronize updated layers with storage
      return updatedLayers;
    });
  }, [syncToStorage]);




  useEffect(() => {
    const handleFetch = async () => {
      if (!currentDocumentId) return;

      try {
        const result = await getLayersById(currentDocumentId);
        if (result) {
          setLayers(result.layers);
          // console.log(result)
        }
      } catch (error) {
        console.error('Error fetching layers:', error);
      }
    };
    handleFetch();
  }, [currentDocumentId]);

  useEffect(()=>{
   if(!(layers.length > 0)){
    addLayer()
   }
  },[])


  return (
    <div>
      <LayerControls
        layers={layers}
        addLayer={addLayer}
        toggleLayerVisibility={toggleLayerVisibility}
        deleteLayer={deleteLayer}
      />
    </div>
  );
};

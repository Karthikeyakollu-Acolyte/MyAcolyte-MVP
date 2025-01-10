"use client"
import React, { useEffect } from 'react';
import { FabricCanvas } from './FabricCanvas';
import { Layer, useCanvas } from '@/context/CanvasContext';
import { useSettings } from '@/context/SettingsContext';

export const CanvasLayer: React.FC<{
    rect: any;
    layer: Layer;
    layerIndex: number;
    pageIndex: number;
    saveLayerContent: any;
}> = ({ rect, layer, layerIndex, pageIndex, saveLayerContent }) => {

    const { isInfinite } = useSettings()
    const { containerWidth } = useCanvas()
    useEffect(() => {
        // console.log(containerWidth)
    }, [containerWidth])


    return (
        <div
            className="canvas-wrapper absolute"
            id={`canvas-wrapper-${pageIndex}-${layerIndex}`}
            style={{
                top: rect.top -  200,
                width: rect.width - 5,
                height: rect.height,
                zIndex: 10 + layerIndex,
            }}
        >
            <FabricCanvas
                rect={rect}
                index={layerIndex}
                pageIndex={pageIndex}
                isDrawing={true}
                saveLayerContent={(content) => {
                    saveLayerContent(layerIndex, pageIndex, content)
                    //  console.log("Saving the content: ",content)

                }

                }
                initialContent={layer.content[pageIndex] || {}}
            />
        </div>
    )
};

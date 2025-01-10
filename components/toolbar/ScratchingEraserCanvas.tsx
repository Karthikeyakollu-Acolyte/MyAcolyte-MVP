"use client"
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { checkCustomRoutes } from 'next/dist/lib/load-custom-routes';

const ScratchingEraserCanvas = ({ fabricCanvas, singleStrokeErase }) => {
    useEffect(() => {
        const canvas = fabricCanvas;

        if (!canvas) return;

        const handlePathCreated = (event) => {
            const path = event.path; // The created path object
            const pathPoints = extractPathPoints(path);

            if (singleStrokeErase) {
                // Erase all objects touched by the path
                eraseTouchedObjectsWithFade(canvas, pathPoints);
            } else if (isScratch(pathPoints)) {
                // Erase only if it's a valid scratch
                eraseTouchedObjectsWithFade(canvas, pathPoints);
            }

            // Remove the path immediately after processing, if desired
            canvas.remove(path);
        };

        // Add event listener for path creation
        canvas.on('path:created', handlePathCreated);

        return () => {
            // Clean up event listener
            canvas.off('path:created', handlePathCreated);
        };
    }, [fabricCanvas, singleStrokeErase]);

    // Function to extract points from a Fabric.js path
    const extractPathPoints = (path) => {
        const points = [];
        const pathData = path.path; // Array of path commands (e.g., ['M', x, y], ['L', x, y])

        let currentX = 0;
        let currentY = 0;

        pathData.forEach((command) => {
            const [cmd, ...coords] = command;

            switch (cmd) {
                case 'M': // Move to
                case 'L': // Line to
                    currentX = coords[0];
                    currentY = coords[1];
                    points.push({ x: currentX, y: currentY });
                    break;
                case 'Q': // Quadratic curve to
                case 'C': // Cubic curve to
                    currentX = coords[coords.length - 2];
                    currentY = coords[coords.length - 1];
                    points.push({ x: currentX, y: currentY });
                    break;
                default:
                    break;
            }
        });

        return points;
    };

    // Function to check if the path forms a scratch
    const isScratch = (pathPoints) => {
        if (pathPoints.length < 10) return false; // Not enough points to form a scratch

        const boundingBox = {
            xMin: Math.min(...pathPoints.map(p => p.x)),
            xMax: Math.max(...pathPoints.map(p => p.x)),
            yMin: Math.min(...pathPoints.map(p => p.y)),
            yMax: Math.max(...pathPoints.map(p => p.y)),
        };

        const boxArea = (boundingBox.xMax - boundingBox.xMin) * (boundingBox.yMax - boundingBox.yMin);
        const pointDensity = pathPoints.length / boxArea;

        return pointDensity > 0.01; // Adjust this threshold as needed
    };

    // Function to erase objects intersected by the path
    const eraseTouchedObjectsWithFade = (canvas, pathPoints) => {
        console.log("Starting eraseTouchedObjectsWithFade");
        canvas.getObjects().forEach((obj, index) => {
            const objectBoundingRect = obj.getBoundingRect(true);

            const isTouched = pathPoints.some(point => (
                point.x >= objectBoundingRect.left &&
                point.x <= objectBoundingRect.left + objectBoundingRect.width &&
                point.y >= objectBoundingRect.top &&
                point.y <= objectBoundingRect.top + objectBoundingRect.height
            ));

            if (isTouched) {
                console.log(`Object at index ${index} is touched`, obj);

                const fadeOut = () => {
                    const duration = 500; // total fade-out duration
                    const interval = 30; // interval between opacity updates
                    const steps = duration / interval; // total number of steps
                    const opacityStep = obj.opacity / steps;
                    let currentStep = 0;

                    console.log(`Starting fade-out for object at index ${index}`);
                    console.log(`Duration: ${duration}, Interval: ${interval}, Steps: ${steps}, Opacity Step: ${opacityStep}`);

                    const fadeInterval = setInterval(() => {
                        if (currentStep >= steps) {
                            clearInterval(fadeInterval);
                            console.log(`Fade-out complete for object at index ${index}. Removing object.`, obj);
                            canvas.remove(obj); // Actually remove the object
                            canvas.requestRenderAll();
                        } else {
                            obj.opacity -= opacityStep;
                            console.log(`Fading object at index ${index}, step ${currentStep}, new opacity: ${obj.opacity}`);
                            canvas.requestRenderAll();
                            currentStep++;
                        }
                    }, interval);
                };

                fadeOut();
            }
        });
    };

    return <></>;
};

export default ScratchingEraserCanvas;

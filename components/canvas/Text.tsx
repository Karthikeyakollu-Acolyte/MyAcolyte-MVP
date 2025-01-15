"use client"
import { useSettings } from '@/context/SettingsContext';
import React, { useEffect, useRef } from 'react';

const Text = ({ fabricCanvas }) => {
  const selectionStart = useRef(null);
  const selectionEnd = useRef(null);
  const { currentPage, scale } = useSettings();

  useEffect(() => {
    if (!fabricCanvas?.current) return;

    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const pageElement = document.querySelector(
        `[data-page-number="${currentPage}"]`
      );

      if (!pageElement) return;

      // Get all selected client rects
      const rects = range.getClientRects();
      const pageRect = pageElement.getBoundingClientRect();

      // Convert selection coordinates to canvas coordinates, accounting for scale
      Array.from(rects).forEach((rect) => {
        // Calculate scaled positions
        const scaledLeft = (rect.left - pageRect.left) / scale;
        const scaledTop = ((rect.top - pageRect.top) / scale)-20;
        const scaledWidth = rect.width / scale;
        const scaledHeight = rect.height / scale;

        const highlight = new fabric.Rect({
          left: scaledLeft,
          top: scaledTop,
          width: scaledWidth,
          height: scaledHeight,
          fill: 'rgba(255, 255, 0, 0.3)',
          selectable: false,
          evented: false,
          // Add scaling factor to ensure highlight scales with the wrapper
          scaleX: scale,
          scaleY: scale,
        });

        fabricCanvas.current.add(highlight);
      });

      fabricCanvas.current.renderAll();
      selection.removeAllRanges();
    };

    const handleMouseDown = (e) => {
      const canvasWrapper = document.getElementById("canvas-wrapper");
      if (canvasWrapper) {
        canvasWrapper.style.pointerEvents = "none";
      }

      selectionStart.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const handleMouseUp = (e) => {
      selectionEnd.current = {
        x: e.clientX,
        y: e.clientY
      };

      if (
        selectionStart.current &&
        (selectionStart.current.x !== selectionEnd.current.x ||
          selectionStart.current.y !== selectionEnd.current.y)
      ) {
        handleTextSelection();
      }

      selectionStart.current = null;
      selectionEnd.current = null;

      const canvasWrapper = document.getElementById("canvas-wrapper");
      if (canvasWrapper) {
        // canvasWrapper.style.pointerEvents = "auto";
      }
    };

    const pageElement = document.querySelector(
      `[data-page-number="${currentPage}"]`
    );
    
    if (pageElement) {
      pageElement.addEventListener('mousedown', handleMouseDown);
      pageElement.addEventListener('mouseup', handleMouseUp);

      return () => {
        pageElement.removeEventListener('mousedown', handleMouseDown);
        pageElement.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [fabricCanvas, currentPage, scale]); // Added scale to dependencies

  // Initial setup of pointer-events
  useEffect(() => {
    const canvasWrapper = document.getElementById("canvas-wrapper");
    if (canvasWrapper) {
      canvasWrapper.style.pointerEvents = "none";
    }
  }, []);

  return null;
};

export default Text;
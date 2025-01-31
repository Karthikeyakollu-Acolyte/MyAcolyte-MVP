"use client";
import { useSettings } from "@/context/SettingsContext";
import React, { useState, useEffect, useRef, useCallback } from "react";

export const TouchGestureHandler = ({ onZoomChange }) => {
    const initialDistance = useRef(null);
    const currentScale = useRef(1);
    const lastScale = useRef(1);
    const {scale} = useSettings()
  
    useEffect(() => {
      const scrollPad = document.getElementById("scrollPad");
  
      const calculateDistance = (touch1, touch2) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.hypot(dx, dy);
      };
  
      // Handle touch pinch gestures
      const handleTouchStart = (event) => {
        if (event.touches.length === 2) {
          initialDistance.current = calculateDistance(
            event.touches[0],
            event.touches[1]
          );
          lastScale.current = currentScale.current;
          console.log("Pinch gesture started");
        }
      };
  
      const handleTouchMove = (event) => {
        if (event.touches.length === 2 && initialDistance.current !== null) {
          const currentDistance = calculateDistance(
            event.touches[0],
            event.touches[1]
          );
      
          const scale = currentDistance / initialDistance.current;
          let targetScale = lastScale.current * scale;
      
          // Step adjustment (rounded to nearest 0.1)
          targetScale = Math.round(targetScale * 10) / 10;
      
          // Apply the change if there's a meaningful difference
          if (Math.abs(currentScale.current - targetScale) >= 0.1) {
            currentScale.current = targetScale;
            onZoomChange(targetScale,event);
            console.log("Current scale (touch):", targetScale);
          }
      
          event.preventDefault();
        }
      };
      
  
      const handleTouchEnd = () => {
        initialDistance.current = null;
        lastScale.current = currentScale.current;
        console.log("Gesture ended");
      };
  
      // Handle trackpad pinch gesture (using wheel events)
      const handleWheel = (event) => {
        if (event.ctrlKey) {
          const delta = event.deltaY || event.deltaX; // Trackpad delta (vertical or horizontal)
          const scaleChange = delta > 0 ? -0.1 : 0.1; // Adjust zoom direction
          const targetScale = currentScale.current + scaleChange;
      
          // Step adjustment (rounded to nearest 0.1)
          const newScale = Math.round(targetScale * 10) / 10;
      
          // Apply the change
          currentScale.current = newScale;
          onZoomChange(newScale,event);
          console.log("Current scale (trackpad):", newScale);
      
          event.preventDefault();
        }
      };
      
  
      // Adding event listeners for touch events
      if (scrollPad) {
        scrollPad.addEventListener("touchstart", handleTouchStart);
        scrollPad.addEventListener("touchmove", handleTouchMove);
        scrollPad.addEventListener("touchend", handleTouchEnd);
        scrollPad.addEventListener("touchcancel", handleTouchEnd);
  
        // Adding event listener for trackpad gestures (wheel events)
        scrollPad.addEventListener("wheel", handleWheel);
      }
  
      // Clean up event listeners when component unmounts
      return () => {
        if (scrollPad) {
          scrollPad.removeEventListener("touchstart", handleTouchStart);
          scrollPad.removeEventListener("touchmove", handleTouchMove);
          scrollPad.removeEventListener("touchend", handleTouchEnd);
          scrollPad.removeEventListener("touchcancel", handleTouchEnd);
  
          // Remove trackpad wheel event listener
          scrollPad.removeEventListener("wheel", handleWheel);
        }
      };
    }, [onZoomChange]);
  
    return (
      <div
        className="absolute top-0 left-0 w-full h-full  bg-blue-900"
        id="scrollPad"
        style={{ zIndex: 100 }}
      />
    );
  };


  /// tools scre .....
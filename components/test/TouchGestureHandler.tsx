"use client";
import { useSettings } from "@/context/SettingsContext";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePinch } from "@use-gesture/react";


export const TouchGestureHandler = ({ onZoomChange }) => {
  const { scale } = useSettings();
  const currentScale = useRef(1);

  // Define the min and max zoom scale limits
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 5;

  // Using usePinch hook to handle pinch gesture
  const bind = usePinch(
    ({ offset: [zoom], memo = currentScale.current }) => {
      let targetScale = memo * zoom;

      // Step adjustment (rounded to nearest 0.1)
      let newScale = Math.round(targetScale * 10) / 10;

      // Enforce the min and max zoom limits
      if (newScale < MIN_ZOOM) {
        newScale = MIN_ZOOM;
      } else if (newScale > MAX_ZOOM) {
        newScale = MAX_ZOOM;
      }

      // Only update scale if there's a significant change
      if (Math.abs(currentScale.current - newScale) >= 0.1) {
        currentScale.current = newScale;
        onZoomChange(newScale);
        console.log("Current scale (pinch):", newScale);
      }

      return newScale; // Return the newScale instead of memo to reflect the current value
    },
    { target: document.getElementById('scrollPad') } // Specify the target element
  );

  // The component only returns null, since the scrollpad is handled by the parent.
  return <div id="scrollPad" className="w-full h-full" {...bind} />;
};




export const TwoFingerScroll = () => {
  let lastTouchY = 0;
  let lastTouchX = 0;
  let isTwoFingerTouch = false;
  const [data, setdata] = useState("");
  const { setScrollPdf } = useSettings();

  useEffect(() => {
    const scrollPad = document.getElementById("scrollPad");
    const scrollableElement = document.querySelector(".scrollableElement");

    if (!scrollPad || !scrollableElement) return;

    const handleTouchStart = (event) => {
      console.log("Touch start detected", event.touches.length);
      setdata(`Touch start detected, ${event.touches.length}`);

      if (event.touches.length === 2) {
        isTwoFingerTouch = true;
        lastTouchY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        lastTouchX = (event.touches[0].clientX + event.touches[1].clientX) / 2;

        console.log("Two-finger touch started at", lastTouchX, lastTouchY);

        setScrollPdf(true);
        setTimeout(() => setScrollPdf(false), 1000);
      } else {
        isTwoFingerTouch = false;
      }
    };

    const handleTouchMove = (event) => {
      if (isTwoFingerTouch && event.touches.length === 2) {
        event.preventDefault();

        let currentTouchY =
          (event.touches[0].clientY + event.touches[1].clientY) / 2;
        let currentTouchX =
          (event.touches[0].clientX + event.touches[1].clientX) / 2;

        let deltaY = currentTouchY - lastTouchY;
        let deltaX = currentTouchX - lastTouchX;

        console.log(
          "Touch move detected: deltaX =",
          deltaX,
          "deltaY =",
          deltaY
        );

        // Now scrolling `.scrollableElement` instead of `scrollPad`
        // scrollableElement.scrollBy(-deltaX, -deltaY);

        lastTouchY = currentTouchY;
        lastTouchX = currentTouchX;
      }
    };

    const handleTouchEnd = () => {
      console.log("Touch end detected");
      setdata("Touch end detected");
      isTwoFingerTouch = false;
    };

    scrollPad.addEventListener("touchstart", handleTouchStart);
    scrollPad.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    scrollPad.addEventListener("touchend", handleTouchEnd);

    return () => {
      scrollPad.removeEventListener("touchstart", handleTouchStart);
      scrollPad.removeEventListener("touchmove", handleTouchMove);
      scrollPad.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
  null
  );
};

import { useSettings } from '@/context/SettingsContext';
import { easeInOut } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

const ScrollableTransform = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const { isInfinite, setScale, setIsVisible} = useSettings();
  const lastPosition = useRef({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isOverflowing, setIsOverflowing] = useState(false);
  const lastTouchDistance = useRef(0);
  const [lastScrollY, setLastScrollY] = useState(0)
  const controlHeader = (e) => {
    const currentScrollY = e.target.scrollTop; // Get the scroll position of the container
    console.log(currentScrollY);
  
    if (currentScrollY > lastScrollY) {
      // Scrolling down
      setIsVisible(false);
      console.log("scroll down");
    } else {
      // Scrolling up
      setIsVisible(true);
      console.log("scroll up");
    }
  
    setLastScrollY(currentScrollY); // Update the last scroll position
  };
  const handleWheel = (event) => {
    if (event.ctrlKey) {
      event.preventDefault();
  let globalScale=0
      
      // Get cursor position relative to the container
      const rect = containerRef.current.getBoundingClientRect();
      const cursorX = event.clientX - rect.left;
      const cursorY = event.clientY - rect.top;

      // Calculate the position relative to the content's transformed state
      const contentX = (cursorX - transform.x) / transform.scale;
      const contentY = (cursorY - transform.y) / transform.scale;

      const zoomFactor = -event.deltaY * 0.001;
      // Prevent zooming out below scale 1.0
      const newScale = Math.max(1, Math.min(10, transform.scale * (1 + zoomFactor)));

      // If zooming back to scale 1, reset position
      if (newScale === 1) {
        setTransform({
          scale: 1,
          x: 0,
          y: 0
        });
        return;
      }

      // Only apply zoom if we're zooming in or we're above scale 1
      if (newScale > transform.scale || transform.scale > 1) {
        // Calculate new position to zoom towards cursor
        const newX = cursorX - (contentX * newScale);
        const newY = cursorY - (contentY * newScale);

        setTransform({
          scale: newScale,
          x: newX,
          y: newY
        });
      }
    } else if (transform.scale > 1) {
      // Only allow panning when zoomed in
      setTransform(prev => {
        // Calculate bounds
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const containerHeight = containerRef.current?.offsetHeight || 0;
        const contentWidth = 850 * prev.scale;
        const contentHeight = (contentRef.current?.offsetHeight || 0) * prev.scale;

        // Calculate new position
        const newX = prev.x - event.deltaX;
        const newY = prev.y - event.deltaY;

        // Apply bounds
        const minX = containerWidth - contentWidth;
        const minY = containerHeight - contentHeight;
        
        return {
          ...prev,
          x: Math.min(0, Math.max(minX, newX)),
          y: Math.min(0, Math.max(minY, newY))
        };
      });
    }
  };



  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];

      const distance = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );

      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      if (lastTouchDistance.current === 0) {
        lastTouchDistance.current = distance;
        return;
      }

      const scale = transform.scale * (distance / lastTouchDistance.current);
      // Prevent zooming out below scale 1.0
      const newScale = Math.max(1, Math.min(10, scale));

      // If zooming back to scale 1, reset position
      if (newScale === 1) {
        setTransform({
          scale: 1,
          x: 0,
          y: 0
        });
        return;
      }

      // Only apply zoom if we're zooming in or we're above scale 1
      if (newScale > transform.scale || transform.scale > 1) {
        // Calculate zoom center relative to container
        const rect = containerRef.current.getBoundingClientRect();
        const zoomCenterX = centerX - rect.left;
        const zoomCenterY = centerY - rect.top;

        // Apply transformation with bounds
        setTransform(prev => {
          const contentX = (zoomCenterX - prev.x) / prev.scale;
          const contentY = (zoomCenterY - prev.y) / prev.scale;

          const newX = zoomCenterX - (contentX * newScale);
          const newY = zoomCenterY - (contentY * newScale);

          const containerWidth = containerRef.current?.offsetWidth || 0;
          const containerHeight = containerRef.current?.offsetHeight || 0;
          const contentWidth = 850 * newScale;
          const contentHeight = (contentRef.current?.offsetHeight || 0) * newScale;

          const minX = containerWidth - contentWidth;
          const minY = containerHeight - contentHeight;

          return {
            scale: newScale,
            x: Math.min(0, Math.max(minX, newX)),
            y: Math.min(0, Math.max(minY, newY))
          };
        });
      }

      lastTouchDistance.current = distance;
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = 0;
  };

  useEffect(() => {
    setScale(transform.scale);
  }, [transform.scale, setScale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
   container.addEventListener('scroll', controlHeader);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('scroll', controlHeader);
    };
  }, [transform]);

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth;
  
    if (isInfinite && containerWidth) {
      const scale = containerWidth / 850;
      setTransform(prev => ({
        ...prev,
        scale: Math.max(scale, 1),
      }));
    } else {
      setTransform({
        scale: 1,
        x: 0,
        y: 0
      });
    }
  }, [isInfinite]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-auto relative"
    >
      <div
        ref={contentRef}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          width: '850px',
          transition: 'all 400ms ease-in-out'
        }}
        className="mx-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollableTransform;
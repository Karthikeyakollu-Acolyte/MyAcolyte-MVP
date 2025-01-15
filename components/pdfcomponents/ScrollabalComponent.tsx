import { useSettings } from '@/context/SettingsContext';
import React, { useEffect, useRef, useState } from 'react';

const ScrollableTransform = ({ children }) => {
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const isPanning = useRef(false);
  const { isInfinite, setScale, setIsVisible } = useSettings();
  const lastPosition = useRef({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isOverflowing, setIsOverflowing] = useState(false);
  const lastTouchDistance = useRef(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [maxScale, setMaxScale] = useState(1);
  const [minScale, setMinScale] = useState(0.1);

  const controlHeader = (e) => {
    const currentScrollY = e.target.scrollTop;
    if (currentScrollY > lastScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

  // Calculate max scale based on container width
  const calculateScaleLimits = () => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const contentWidth = 850; // Fixed content width
      
      // Calculate min scale based on minimum readable width (e.g., 320px)
      const minReadableWidth = 320;
      const newMinScale = minReadableWidth / contentWidth;
      
      // Calculate max scale based on container width
      const newMaxScale = containerWidth / contentWidth;
      
      setMaxScale(Math.max(newMaxScale, 1));
      setMinScale(newMinScale);
    }
  };

  const handleWheel = (event) => {
    if (event.ctrlKey) {
      const zoomFactor = event.deltaY * 0.01;
      setTransform((prevTransform) => {
        const newScale = Math.max(minScale, Math.min(maxScale, prevTransform.scale - zoomFactor));
        return {
          ...prevTransform,
          scale: newScale,
        };
      });
      event.preventDefault();
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];

      const distance = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );

      if (!containerRef.current.initialDistance) {
        containerRef.current.initialDistance = distance;
      }

      const scaleFactor = distance / containerRef.current.initialDistance;
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      setTransform((prevTransform) => {
        const newScale = Math.max(minScale, Math.min(maxScale, prevTransform.scale * scaleFactor));
        const offsetX = (centerX - prevTransform.x) * (1 - newScale / prevTransform.scale);
        const offsetY = (centerY - prevTransform.y) * (1 - newScale / prevTransform.scale);

        return {
          scale: newScale,
          x: prevTransform.x + offsetX,
          y: prevTransform.y + offsetY,
        };
      });

      event.preventDefault();
    }
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch' && containerRef.current) {
      const pointers = Array.from(containerRef.current.getPointerEvents())
        .filter((pointer) => pointer.pointerType === 'touch');

      if (pointers.length === 2) {
        const distance = Math.sqrt(
          Math.pow(pointers[0].clientX - pointers[1].clientX, 2) +
          Math.pow(pointers[0].clientY - pointers[1].clientY, 2)
        );

        if (!containerRef.current.initialDistance) {
          containerRef.current.initialDistance = distance;
        }

        const scaleFactor = distance / containerRef.current.initialDistance;
        const centerX = (pointers[0].clientX + pointers[1].clientX) / 2;
        const centerY = (pointers[0].clientY + pointers[1].clientY) / 2;

        setTransform((prevTransform) => {
          const newScale = Math.max(0.1, Math.min(maxScale, prevTransform.scale * scaleFactor));
          const offsetX = (centerX - prevTransform.x) * (1 - newScale / prevTransform.scale);
          const offsetY = (centerY - prevTransform.y) * (1 - newScale / prevTransform.scale);

          return {
            scale: newScale,
            x: prevTransform.x + offsetX,
            y: prevTransform.y + offsetY,
          };
        });

        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    setScale(transform.scale);
  }, [transform.scale, setScale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate initial max scale
    calculateScaleLimits();

    // Add resize observer to update max scale when container size changes
    const resizeObserver = new ResizeObserver(calculateScaleLimits);
    resizeObserver.observe(container);

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('pointermove', handlePointerMove, { passive: false });
    container.addEventListener('scroll', controlHeader);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('scroll', controlHeader);
      resizeObserver.disconnect();
    };
  }, [transform]);

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth;
  
    if (isInfinite && containerWidth) {
      const scale = containerWidth / 850;
      setTransform((prevTransform) => ({
        ...prevTransform,
        scale: Math.max(scale, 1),
      }));
    } else {
      setTransform((prevTransform) => ({
        ...prevTransform,
        scale: 1,
      }));
    }
  }, [isInfinite]);

  return (
    <div
      ref={containerRef}
      className="w-[100%] h-screen overflow-auto relative"
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
          transformOrigin: 'center center',
          width: '850px',
        }}
        className="mx-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollableTransform;
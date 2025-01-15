import { useSettings } from '@/context/SettingsContext';
import React, { useEffect, useRef, useState } from 'react';

const ScrollableTransform = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const {isInfinite,setScale,setIsVisible} = useSettings()
  const lastPosition = useRef({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isOverflowing, setIsOverflowing] = useState(false);
  const lastTouchDistance = useRef(0); // To track the distance for pinch zoom
  const [lastScrollY, setLastScrollY] = useState(0)
  let globalScale=0

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
      // Pinch-to-zoom detected via 'wheel' event (when Ctrl is pressed)
      console.log('Pinch zoom detected via wheel event');
  
      
      const zoomFactor = event.deltaY * 0.01;  // Adjust zoom sensitivity as needed
      setTransform((prevTransform) => ({
        ...prevTransform,
        scale: Math.max(0.1, prevTransform.scale - zoomFactor), // Limit scale to avoid negative values
      }));
      event.preventDefault();  // Prevent the default scroll behavior
    }
  };



  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      // Pinch gesture detected using touch
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];

      // Calculate the distance between the two touch points
      const distance = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );

      // If this is the first time, save the initial distance to calculate zoom changes
      if (!containerRef.current.initialDistance) {
        containerRef.current.initialDistance = distance;
      }

      // Calculate the zoom scale based on the initial distance
      const scaleFactor = distance / containerRef.current.initialDistance;

      // Find the center of the pinch gesture (average of both touch points)
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      // Calculate the zoom effect by translating content to the touch center
      setTransform((prevTransform) => {
        const scale = Math.max(0.1, prevTransform.scale * scaleFactor);

        const offsetX = (centerX - prevTransform.x) * (1 - scale / prevTransform.scale);
        const offsetY = (centerY - prevTransform.y) * (1 - scale / prevTransform.scale);

        return {
          scale,
          x: prevTransform.x + offsetX,
          y: prevTransform.y + offsetY,
        };
      });

      event.preventDefault();  // Prevent default behavior
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

        // Find the center of the pinch gesture (average of both pointers)
        const centerX = (pointers[0].clientX + pointers[1].clientX) / 2;
        const centerY = (pointers[0].clientY + pointers[1].clientY) / 2;

        setTransform((prevTransform) => {
          const scale = Math.max(0.1, prevTransform.scale * scaleFactor);

          const offsetX = (centerX - prevTransform.x) * (1 - scale / prevTransform.scale);
          const offsetY = (centerY - prevTransform.y) * (1 - scale / prevTransform.scale);

          return {
            scale,
            x: prevTransform.x + offsetX,
            y: prevTransform.y + offsetY,
          };
        });

        event.preventDefault();  // Prevent default behavior
      }
    }
  };

  useEffect(()=>{

    setScale(transform.scale)
  },[transform.scale])

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Adding event listeners for touch, pointer, and wheel events
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('pointermove', handlePointerMove, { passive: false });
   container.addEventListener('scroll', controlHeader);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('scroll', controlHeader);
    };
  }, [transform]);  // Dependency array, you can modify it as per your need

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth;
  
    if (isInfinite && containerWidth) {
      const scale = containerWidth / 850; // Assuming 850px is the original content width
      setTransform((prevTransform) => ({
        ...prevTransform,
        scale: Math.max(scale, 1), // Scale up to fit the container but not below 1
      }));
    } else {
      setTransform((prevTransform) => ({
        ...prevTransform,
        scale: 1, // Reset scale to 1 when not in infinite mode
      }));
    }
  }, [isInfinite]);
  


  return (
    <div
      ref={containerRef}
      className="w-[100%] h-screen  overflow-auto relative  "
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

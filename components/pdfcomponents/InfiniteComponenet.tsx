import React, { useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

const ScrollableTransform = ({ children, id }) => {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const contentRef = useRef(null);
  const timeoutRef = useRef(null);
  
  const checkBounds = () => {
    if (!transformRef.current || !contentRef.current) return;
    
    const { instance } = transformRef.current;
    const { offsetWidth: containerWidth } = instance.wrapperComponent;
    const { offsetWidth: contentWidth } = contentRef.current;
    console.log(instance.maxBounds)

    return
    
    // Get current position
    const { positionX } = instance;
    const maxAllowedX = (contentWidth - containerWidth) / 2;
    
    // Check if we're out of bounds
    if (Math.abs(positionX) > maxAllowedX) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a small delay before centering to avoid interrupting user interaction
      timeoutRef.current = setTimeout(() => {
        instance.centerView(1, 0); // Animate back to center
      }, 500);
    }
  };



  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={1}
      maxScale={5}
      minScale={0.5}
      centerOnInit
      velocityAnimation={{
        animationTime: 1,
        animationType: "linear",
        sensitivity: 1
      }}
      wheel={{
        step: 3,
        wheelDisabled: true,
        touchPadDisabled: false,
        smoothStep: 0.03,
      }}
      panning={{
        allowMiddleClickPan: false,
        wheelPanning: true,
        allowLeftClickPan: false,
        allowRightClickPan: false,
      }}
      disablePadding
      limitToBounds={false}
    //   onPanning={checkBounds}
      onZoom={checkBounds}
    //   onTransformed={checkBounds}
    >
      {({ }) => (
        <div className="w-[80vw] h-screen bg-blue-100">
          <TransformComponent 
            wrapperStyle={{ 
              width: "100%", 
              overflow: "auto", 
              height: "calc(100% - 60px)" 
            }}
          >
            <div className="w-[80vw] h-screen">
              <div
                ref={contentRef}
                style={{
                  width: "850px",
                }}
                className="mx-auto"
              >
                {children}
              </div>
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

export default ScrollableTransform;
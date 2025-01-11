import { useSettings } from '@/context/SettingsContext';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

const ScrollableTransform = ({ children}) => {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { isInfinite } = useSettings();
  const isAdjusting = useRef(false);

  const detectOverflow = useCallback(() => {
    if (!contentRef.current || !transformRef.current) return;
    const content = contentRef.current;
    const { instance } = transformRef.current;

    const containerWidth = content.parentElement?.offsetWidth || 0;
    const contentWidth = content.scrollWidth * instance.transformState.scale; // Adjust for scale

    // Set overflow state
    setIsOverflowing(contentWidth > containerWidth);
  }, []);

  const scaleToWidth = (scale: number) => {
    if (!transformRef.current || !contentRef.current) return;

    const { zoomToElement } = transformRef.current;
    const pageIndex = 1; // Example page index
    zoomToPage(scale, pageIndex);
  };

  const zoomToPage = (scale: number, pageIndex: number) => {
    if (!transformRef.current) return;

    const { zoomToElement } = transformRef.current;
    const element = document.querySelector(`[data-page-number="${pageIndex}"]`);
    if (element) {
      zoomToElement(element as HTMLElement, scale, 500, 'easeOutQuint');
    } else {
      console.warn(`Element with data-page-index="${pageIndex}" not found`);
    }
  };

  useEffect(() => {
    console.log(isOverflowing)

  }, [isOverflowing])

  useEffect(() => {
    if (isInfinite) {
      scaleToWidth(2);
    } else {
      scaleToWidth(1);
    }
  }, [isInfinite]);

  useEffect(() => {
    detectOverflow();
    window.addEventListener('resize', detectOverflow);

    return () => {
      window.removeEventListener('resize', detectOverflow);

    };
  }, [detectOverflow]);

  const handleZoomStop = (e:ReactZoomPanPinchRef) => {
    if (!transformRef.current || !contentRef.current) return;
    const { instance, centerView, state } = e
    if(state.scale < 1){
      centerView(state.scale,100)
      console.log("executing this shit")
    }

  }


  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={1}
      maxScale={5}
      minScale={0.5}
      centerOnInit
      centerZoomedOut
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
        lockAxisX: !isOverflowing,
        // disabled:true,
      }}
      disablePadding
      limitToBounds={false}
      onTransformed={detectOverflow}
      onZoomStop={handleZoomStop}

    >
      {() => (
        <div className="w-[80vw] h-screen scrollbar-hidden">
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              overflow: 'auto',
              height: 'calc(100% - 60px)',
            }}
            contentClass='selectable-text'


          >
            <div className="w-[80vw] h-screen">
              <div
                ref={contentRef}
                style={{
                  width: '850px',
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

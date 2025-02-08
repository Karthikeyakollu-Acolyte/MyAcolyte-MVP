'use client';
import { useRef, useEffect } from "react";

export const TwoFingerScroll = ({ children }) => {
  const containerRef = useRef(null);
  const lastTouchesRef = useRef(null);

  const handleTouchMove = (event) => {
    if (event.touches.length === 2) {
      event.preventDefault(); // Prevent native scrolling

      const container = containerRef.current;
      if (!container) return;

      const newTouches = event.touches;
      if (lastTouchesRef.current) {
        const prevTouches = lastTouchesRef.current;
        const deltaY =
          (newTouches[0].clientY + newTouches[1].clientY) / 2 -
          (prevTouches[0].clientY + prevTouches[1].clientY) / 2;
        container.scrollTop -= deltaY;
      }

      lastTouchesRef.current = [newTouches[0], newTouches[1]];
    }
  };

  const handleTouchEnd = (event) => {
    if (event.touches.length < 2) {
      lastTouchesRef.current = null;
    }
  };

  const handleWheel = (event) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop += event.deltaY;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: true });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="scrollbar-hidden"
      style={{
        overflow: "auto",
        height: "100%",
        touchAction: "pan-y", // Allow vertical scrolling but prevent zoom
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};

const DummyPage = () => {
  const items = Array.from({ length: 30 }, (_, index) => ({
    id: index,
    height: 100 + (index % 3) * 100, // Heights: 100px, 200px, 300px
  }));

  return (
    <TwoFingerScroll>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            height: `${item.height}px`,
            backgroundColor: '#f0f0f0',
            margin: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Item {item.id + 1} - Height: {item.height}px
        </div>
      ))}
    </TwoFingerScroll>
  );
};

export default DummyPage;

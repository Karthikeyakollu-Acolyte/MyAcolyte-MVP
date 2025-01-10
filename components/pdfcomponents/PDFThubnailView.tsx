"use client"
import React, { useEffect, useRef, useState } from 'react';

const RenderingStates = {
  INITIAL: 0,
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3,
};

const PDFThumbnailView = ({ pdfPage, id, linkService, eventBus }) => {
  const thumbnailRef = useRef(null);  // Reference to the img element
  const [renderingState, setRenderingState] = useState(RenderingStates.INITIAL);

  const draw = async () => {
    if (renderingState !== RenderingStates.INITIAL || !pdfPage) {
      console.error("Must be in new state before drawing");
      return;
    }

    setRenderingState(RenderingStates.RUNNING);

    // Create a temporary canvas to render the page
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');

    // Set the scale for the thumbnail (adjust this value to change the size)
    const viewport = pdfPage.getViewport({ scale: 0.2 });  // Use scale to control thumbnail size
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render the page onto the canvas
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    const renderTask = pdfPage.render(renderContext);

    // Wait for the render task to complete
    await renderTask.promise;

    // Once rendering is complete, convert the canvas to a data URL and set it as the image source
    thumbnailRef.current.src = canvas.toDataURL();

    setRenderingState(RenderingStates.FINISHED);
    // eventBus.dispatch("thumbnailrendered", { id });
  };

  useEffect(() => {
    if (pdfPage) {
      draw(); // Call the draw function when the pdfPage is available
    }

    return () => {
      setRenderingState(RenderingStates.INITIAL);
    };
  }, [pdfPage]);

  return (
    <div className="thumbnail" data-page-number={id} >
      <img ref={thumbnailRef} className="thumbnailImage p-2 border border-1 hover:border-blue-400 rounded-md mb-2" alt={`Page ${id}`} />
    </div>
  );
};

const PDFThumbnailViewer = ({ pdfDocument, linkService, eventBus }) => {
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    const initializeThumbnails = async () => {
      const pagesCount = 10//pdfDocument.numPages;
      const newThumbnails = [];
      console.log(pagesCount);
      for (let pageNum = 1; pageNum <= pagesCount; pageNum++) {
        const pdfPage = await pdfDocument.getPage(pageNum);
        console.log(pdfPage)
        newThumbnails.push(
          <PDFThumbnailView
            key={pageNum}
            id={pageNum}
            pdfPage={pdfPage}
            linkService={linkService}
            eventBus={eventBus}
          />
        );
      }

      setThumbnails(newThumbnails);
    };

    initializeThumbnails();

    return () => {
      setThumbnails([]);
    };
  }, [pdfDocument, linkService, eventBus]);

  return <div className="thumbnail-container">{thumbnails}</div>;
};

export { PDFThumbnailView, PDFThumbnailViewer };

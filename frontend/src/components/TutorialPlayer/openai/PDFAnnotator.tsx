/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {  useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";

// import "@react-pdf/renderer/dist/Page.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";


import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const PDFAnnotator: React.FC<{ pdfFile: string }> = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      contextRef.current = canvas.getContext("2d");
    }
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  // Function to get the position from a touch or mouse event
  const getPosition = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in event) {
      // Touch event
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    } else {
      // Mouse event
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    drawingRef.current = true;
    const context = contextRef.current;
    if (context) {
      const { x, y } = getPosition(event);
      context.beginPath();
      context.moveTo(x, y);
    }
  };

  const draw = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!drawingRef.current) return;
    const context = contextRef.current;
    if (context) {
      const { x, y } = getPosition(event);
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const finishDrawing = () => {
    drawingRef.current = false;
    const context = contextRef.current;
    if (context) {
      context.closePath();
    }
  };

  return (
    <div>
      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none", // Prevent pointer events on canvas
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={finishDrawing}
      />
      {/* Add controls for navigation */}
      <div>
        <button onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}>
          Previous
        </button>
        <button
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages!))}
        >
          Next
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
      </div>
    </div>
  );
};

export default PDFAnnotator;

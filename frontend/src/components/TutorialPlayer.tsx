import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { Paper, Box, Typography, Button, Stack } from "@mui/material";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

interface PDFDocumentProxy {
  numPages: number;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface TutorialPlayerProps {
  videoUrl: string;
  subtitleUrl?: string;
  tablatureUrl?: string;
}

const TutorialPlayer: React.FC<TutorialPlayerProps> = ({
  videoUrl,
  subtitleUrl,
  tablatureUrl,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);
  const goToNextPage = () =>
    setPageNumber(
      pageNumber + 1 >= (numPages || 1) ? numPages || 1 : pageNumber + 1
    );

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setIsDrawing(true);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setLastPoint({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Draw on the canvas
        ctx.strokeStyle = "red"; // Set your desired color
        ctx.lineWidth = 2; // Set your desired line width
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        // Update the last point
        setLastPoint({ x, y });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      // Set canvas dimensions to match the PDF page
      const rect = pdfRef.current?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width; // Set width based on PDF container
        canvas.height = rect.height; // Set height based on PDF container
      }
      context?.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    }
  }, [pageNumber]); // Clear the canvas when the page changes

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Video Tutorial
      </Typography>

      <Box mb={2}>
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="auto"
          config={{
            file: {
              tracks: subtitleUrl
                ? [
                    {
                      kind: "subtitles",
                      src: subtitleUrl,
                      srcLang: "en",
                      label: "English",
                      default: true,
                    },
                  ]
                : [],
            },
          }}
        />
      </Box>

      {tablatureUrl && (
        <Box mb={2}>
          <Typography variant="h6">Tablature (PDF)</Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
              >
                Prev
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={goToNextPage}
                disabled={numPages !== null && pageNumber >= numPages}
              >
                Next
              </Button>
            </Stack>
            <Typography variant="body1" align="center">
              Page {pageNumber} of {numPages || "..."}
            </Typography>
            <div
              ref={pdfRef}
              style={{ position: "relative", width: "100%", height: "600px" }} // Adjust height as needed
            >
              <Document
                file={tablatureUrl}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} renderAnnotationLayer={true} />
              </Document>
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  pointerEvents: "auto", // Enable mouse events
                  zIndex: 1, // Ensure the canvas is on top of the PDF
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
            </div>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default TutorialPlayer;

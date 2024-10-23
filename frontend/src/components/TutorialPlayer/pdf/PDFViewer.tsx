import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,

  Content,
  IHighlight,
  NewHighlight,
  ScaledPosition,
} from "react-pdf-highlighter";

import "react-pdf-highlighter/dist/style.css";
import { Spinner } from "./Spinner";
import { Sidebar } from "./SideBar";
import { testHighlights as _testHighlights } from "./test-highlights";
import { pdfjs } from "react-pdf";
import { Box } from "@mui/material";

import { postAnnotation } from "../../../api/api"; // Import the API function


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
  tablatureUrl: string;
}

const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; emoji: string };
}) =>
  comment.text ? (
    <Box className="Highlight__popup">
      {comment.emoji} {comment.text}
    </Box>
  ) : null;

const PDFViewer: React.FC<PDFViewerProps> = ({ tablatureUrl }) => {
  const [highlights, setHighlights] = useState<Array<IHighlight>>(
    testHighlights[tablatureUrl] ? [...testHighlights[tablatureUrl]] : []
  );

  const scrollViewerTo = useRef((_highlight: IHighlight) => {
    // Implement scrolling logic here
  });

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
      scrollViewerTo.current(highlight);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        "hashchange",
        scrollToHighlightFromHash,
        false
      );
    };
  }, [scrollToHighlightFromHash]);

  const getHighlightById = (id: string) =>
    highlights?.find((highlight) => highlight.id === id);


const addHighlight = async (highlight: NewHighlight) => {
  const newHighlight = { ...highlight, id: getNextId() };
  console.log("Saving highlight", newHighlight);

  setHighlights((prevHighlights) => [newHighlight, ...prevHighlights]);

  try {
    await postAnnotation(
      tablatureUrl, // tutorial ID (assuming tablatureUrl is the ID)
      highlight.content,
      highlight.position,
      highlight.comment
    );
    console.log("Highlight saved successfully");
  } catch (error) {
    console.error("Error saving highlight", error);
  }
};

  const updateHighlight = async (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>
  ) => {
    console.log("Updating highlight", highlightId, position, content);

    setHighlights((prevHighlights) =>
      prevHighlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      })
    );

    try {
      const response = await fetch(`/api/annotations/${highlightId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update highlight");
      }

      const updatedHighlight = await response.json();
      console.log("Highlight updated", updatedHighlight);
    } catch (error) {
      console.error("Error updating highlight", error);
    }
  };

  // const removeHighlight = async (highlightId: string) => {
  //   try {
  //     await deleteAnnotation(highlightId);
  //     setHighlights((prevHighlights) =>
  //       prevHighlights.filter((h) => h.id !== highlightId)
  //     );
  //     console.log("Highlight deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting highlight", error);
  //   }
  // };

  return (
    <Box sx={{ display: "flex", height: "100vh", zIndex: 1 }}>
      {/* Sidebar */}
      <Sidebar
        highlights={highlights}
        resetHighlights={() => setHighlights([])}
      />

      {/* Main Viewer */}
      <Box
        sx={{
          height: "100vh",
          width: "75vw",
          position: "relative",
        }}
      >
        <PdfLoader url={tablatureUrl} beforeLoad={<Spinner />}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={resetHash}
              scrollRef={(scrollTo) => {
                scrollViewerTo.current = scrollTo;
                scrollToHighlightFromHash();
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment) => {
                    addHighlight({ content, position, comment });
                    hideTipAndSelection();
                  }}
                />
              )}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isTextHighlight = !highlight.content?.image;

                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) }
                      );
                    }}
                  />
                );

                return (
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) =>
                      setTip(highlight, (_highlight) => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                  >
                    {component}
                  </Popup>
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </Box>
    </Box>
  );
};

export default PDFViewer;

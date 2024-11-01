/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { getVideoUrl, getSubtitleUrl, getTablatureUrl } from "../../api/api";
import VideoPlayer from "./VideoPlayer";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import "react-resizable/css/styles.css"; // Ensure styles are imported for resizing
import PDFAnnotator from "./openai/PDFAnnotator";

interface TutorialPlayerProps {
  fileName: string;
}

const TutorialPlayer: React.FC<TutorialPlayerProps> = ({ fileName }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [subtitleUrl, setSubtitleUrl] = useState<string | null>(null);
  const [tablatureUrl, setTablatureUrl] = useState<string | null>(null);
  const [isVideoVisible, setIsVideoVisible] = useState<boolean>(true); // Control video visibility
  const videoPlayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const video = await getVideoUrl(fileName);
      const subtitle = await getSubtitleUrl(fileName);
      const tablature = await getTablatureUrl(fileName);

      console.log(video, subtitle, tablature);

      setVideoUrl(video);
      setSubtitleUrl(subtitle);
      setTablatureUrl(tablature);
    };

    fetchFiles();
  }, [fileName]);

  const handleFullScreen = () => {
    if (videoPlayerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoPlayerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <Box sx={{ position: "relative", height: "100vh" }}>
      {/* Tablature Viewer */}
      {tablatureUrl && (
        <Box
          sx={{
            height: "100vh",
            width: "75vw",
            position: "absolute", // Ensure that it’s absolutely positioned
            zIndex: 0, // Keep tablature behind video player
            overflow: "auto", // Handle scrolling of PDF
            top: 0,
            left: 0, // Anchor to the top-left corner
          }}
        >
          <PDFAnnotator pdfFile={tablatureUrl} />
        </Box>
      )}

      {/* Draggable and resizable video player */}
      {isVideoVisible && (
        <Draggable>
          <ResizableBox
            width={400}
            height={300}
            minConstraints={[200, 150]}
            maxConstraints={[800, 600]}
            // Important: adjust layout according to where you want to place the video container
            className="draggable-video"
          >
            <Box
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "400px",
                height: "300px",
                backgroundColor: "white",
                border: "1px solid #ccc",
                zIndex: 100, // Ensure video is on top
                boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
              }}
              ref={videoPlayerRef}
            >
              <VideoPlayer videoUrl={videoUrl} subtitleUrl={subtitleUrl} />
              {/* Video Control Buttons */}
              <IconButton
                onClick={handleFullScreen}
                style={{ position: "absolute", top: 8, right: 40 }}
              >
                <FullscreenIcon />
              </IconButton>
              <IconButton
                onClick={() => setIsVideoVisible(false)}
                style={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </ResizableBox>
        </Draggable>
      )}

      {/* Rest of the component code remains as is */}

      {/* Show video button if hidden */}
      {!isVideoVisible && (
        <IconButton
          onClick={() => setIsVideoVisible(true)}
          style={{ marginTop: "10px", zIndex: 1000 }} // Ensure button is on top
        >
          Show Video
        </IconButton>
      )}
    </Box>
  );
};

export default TutorialPlayer;

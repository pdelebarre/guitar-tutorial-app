/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { getVideoUrl, getSubtitleUrl, getTablatureUrl } from "../../api/api";
import VideoPlayer from "./VideoPlayer";
import PDFViewer from "./pdf/PDFViewer";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import "react-resizable/css/styles.css"; // Ensure styles are imported for resizing

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
      <Typography variant="h5" gutterBottom>
        Video Tutorial for {fileName}
      </Typography>

      {/* Draggable and resizable video player */}
      {isVideoVisible && (
        <Draggable>
          <ResizableBox
            width={400}
            height={300}
            minConstraints={[200, 150]}
            maxConstraints={[800, 600]}
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
                zIndex: 1000, // Ensure video is on top
                boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
              }}
              ref={videoPlayerRef}
            >
              <VideoPlayer videoUrl={videoUrl} subtitleUrl={subtitleUrl} />

              {/* Control buttons */}
              <IconButton
                onClick={handleFullScreen}
                style={{ position: "absolute", top: 8, right: 40, zIndex: 10 }}
              >
                <FullscreenIcon />
              </IconButton>
              <IconButton
                onClick={() => setIsVideoVisible(false)}
                style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </ResizableBox>
        </Draggable>
      )}

      {/* Tablature Viewer */}
      {tablatureUrl && (
        <Box
          sx={{
            height: "100vh",
            width: "75vw",
            position: "absolute", // Position relative to parent
            zIndex: 1, // Keep tablature behind video player
            overflow: "auto", // To handle scrolling of PDF
          }}
        >
          <PDFViewer tablatureUrl={tablatureUrl} />
        </Box>
      )}

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

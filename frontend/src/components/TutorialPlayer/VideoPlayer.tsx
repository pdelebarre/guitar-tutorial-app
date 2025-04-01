// VideoPlayer.tsx

import React, { useCallback } from "react";
import { Box } from "@mui/material";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string | null;
  subtitleUrl: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, subtitleUrl }) => {
  const handleError = useCallback((error: Error) => {
    console.error("ReactPlayer error:", error);
  }, []);

  const handleReady = useCallback((player: ReactPlayer) => {
    console.log("ReactPlayer is ready:", player);
  }, []);

  console.log('videoUrl :>> ', videoUrl);

  return (
    <Box mb={2}>
      {videoUrl && (
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="auto"
          onError={handleError}
          onReady={handleReady}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous"
              },
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
      )}
    </Box>
  );
};

export default VideoPlayer;

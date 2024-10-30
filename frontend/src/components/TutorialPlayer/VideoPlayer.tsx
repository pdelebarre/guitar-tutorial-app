// VideoPlayer.tsx

import React from "react";
import { Box } from "@mui/material";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string | null;
  subtitleUrl: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, subtitleUrl }) => {
  return (
    <Box mb={2}>
      <ReactPlayer
        url=  {videoUrl ?? ""}
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
  );
};

export default VideoPlayer;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTutorials, TutorialDTO } from "../api/api";
import { Box, Typography, Button, CircularProgress, Alert, Stack } from "@mui/material";
import VideoPlayer from "../components/TutorialPlayer/VideoPlayer";

const TutorialPage: React.FC = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const [tutorial, setTutorial] = useState<TutorialDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!fileName) {
      setError("No tutorial name provided");
      setLoading(false);
      return;
    }

    getTutorials()
      .then((tutorials) => {
        const decodedFileName = decodeURIComponent(fileName);
        const foundTutorial = tutorials.find(
          (t) => t.name === decodedFileName || t.name.replace(/[|｜[\]]/g, '').trim() === decodedFileName
        );
        
        if (foundTutorial) {
          setTutorial(foundTutorial);
          setError(null);
        } else {
          setError(`Tutorial "${decodedFileName}" not found`);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch tutorial:", err);
        setError("Failed to load tutorial");
      })
      .finally(() => setLoading(false));
  }, [fileName]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!tutorial) {
    return <Typography>Tutorial not found</Typography>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h4">{tutorial.name.replace(/_/g, " ")}</Typography>
        
        {tutorial.videoUrl && (
          <>
            <Button 
              variant="contained" 
              onClick={() => setShowVideo(!showVideo)}
            >
              {showVideo ? "Hide Video" : "Watch Video"}
            </Button>
            
            {showVideo && (
              <Box sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <VideoPlayer 
                  videoUrl={tutorial.videoUrl} 
                  subtitleUrl={tutorial.subtitleUrl} 
                />
              </Box>
            )}
          </>
        )}

        <Stack direction="row" spacing={2}>
          {tutorial.subtitleUrl && (
            <Button href={tutorial.subtitleUrl} variant="contained" color="secondary">
              Download Subtitles
            </Button>
          )}
          {tutorial.tablatureUrl && (
            <Button href={tutorial.tablatureUrl} variant="contained">
              View Tablature
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default TutorialPage;

import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import TutorialPlayer from "../components/TutorialPlayer";

const TutorialPage: React.FC = () => {
  const { fileName } = useParams<{ fileName: string }>();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {fileName}
      </Typography>

      <Box mb={2}>
        <TutorialPlayer
          videoUrl={`/api/tutorials/${fileName}/mp4`} // Video URL
          subtitleUrl={`/api/tutorials/${fileName}/srt`} // Subtitle URL
          tablatureUrl={`/api/tutorials/${fileName}/pdf`} // Tablature URL
        />
      </Box>
    </Container>
  );
};

export default TutorialPage;

import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import TutorialPlayer from "../components/TutorialPlayer/TutorialPlayer";
// import { apiBaseUrl } from "../api/api";
const TutorialPage: React.FC = () => {
  const { fileName } = useParams<{ fileName: string }>();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {fileName}
      </Typography>

      <Box mb={2}>
        <TutorialPlayer
          fileName={`${fileName}`}
       />
      </Box>
    </Container>
  );
};

export default TutorialPage;

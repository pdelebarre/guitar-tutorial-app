import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import TutorialPlayer from "../components/TutorialPlayer/TutorialPlayer";
// import { apiBaseUrl } from "../api/api";
const TutorialPage: React.FC = () => {
  const { fileName } = useParams<{ fileName: string }>();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {fileName}
      </Typography>

        <TutorialPlayer
          fileName={`${fileName}`}
       />
  
    </Container>
  );
};

export default TutorialPage;

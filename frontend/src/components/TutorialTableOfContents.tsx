import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { getTutorials } from "../api/api"; // API call to fetch file names

const TutorialTableOfContents: React.FC = () => {
  const [tutorials, setTutorials] = useState<string[]>([]);

  // Fetch tutorials (file names) on component mount
  useEffect(() => {
    getTutorials().then((data) => setTutorials(data));
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Guitar Tutorials
      </Typography>

      <List>
        {tutorials.length > 0 ? (
          tutorials.map((tutorialName) => (
            <ListItemButton
              component={RouterLink}
              to={`/tutorial/${tutorialName}`} // Link to the tutorial page by file name
              key={tutorialName}
            >
              <ListItemText primary={tutorialName} />
            </ListItemButton>
          ))
        ) : (
          <Typography>No tutorials available</Typography>
        )}
      </List>
    </Box>
  );
};

export default TutorialTableOfContents;

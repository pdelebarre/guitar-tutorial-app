/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getTutorials } from "../api/api";
// import { Tutorial } from "../types/types";

const HomePage: React.FC = () => {
  const [tutorials, setTutorials] = useState<string[]>([]);

  useEffect(() => {
    getTutorials().then((data) =>
      setTutorials(data));
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Guitar Tutorials
      </Typography>
      <List>
        {tutorials.map((tutorial) => (
            <ListItem
                
            component={Link}
            to={`/tutorial/${tutorial}`}
            key={tutorial}
          >
            <ListItemText
              primary={tutorial.replace(".mp4", "")}
            />
            </ListItem>
            
        ))}
      </List>
    </Container>
  );
};

export default HomePage;

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link } from "react-router-dom";
import { getTutorials } from "../api/api";
import { useDarkMode } from "../context/DarkModeContext";

interface TutorialDTO {
  name: string;
  type: string;
  size: number;
  duration: number;
}

const Navigation: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [tutorials, setTutorials] = useState<TutorialDTO[]>([]);
  const { nightMode, toggleNightMode } = useDarkMode(); // Access dark mode state

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);

    if (open && tutorials.length === 0) {
      getTutorials()
        .then((data) => {
          setTutorials(data);
        })
        .catch((err) => {
          console.error("Failed to fetch tutorials:", err.message);
        });
    }
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: nightMode ? "#333" : "#1976d2",
          color: nightMode ? "#fff" : "#000",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Guitar Tutorials
          </Typography>
          <IconButton
            color="inherit"
            onClick={toggleNightMode}
            aria-label="toggle dark mode"
          >
            {nightMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            padding: 2,
            backgroundColor: nightMode ? "#121212" : "#fff",
            color: nightMode ? "#fff" : "#000",
            minHeight: "100vh",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Tutorials
          </Typography>
          <List>
            {tutorials.map((tutorial) => (
              <ListItem key={tutorial.name}>
                <ListItemText
                  primary={
                    <Link
                      to={`/tutorial/${encodeURIComponent(tutorial.name)}`}
                      style={{
                        textDecoration: "none",
                        color: nightMode ? "#90caf9" : "blue",
                      }}
                    >
                      {tutorial.name.replace(/_/g, " ")}
                    </Link>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation;

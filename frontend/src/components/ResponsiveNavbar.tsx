import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface ResponsiveNavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  darkMode,
  setDarkMode,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Guitar Tutorial App
          </Typography>
          <Switch
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            inputProps={{ "aria-label": "toggle dark mode" }}
          />
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          <ListItem
            component={Link}
            to="/"
            onClick={toggleDrawer}
            style={{ textDecoration: "none" }}
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            component={Link}
            to="/tutorial/someFile"
            onClick={toggleDrawer}
            style={{ textDecoration: "none" }}
          >
            <ListItemText primary="Tutorial" />
          </ListItem>
          <ListItem
            component={Link}
            to="/playlists"
            onClick={toggleDrawer}
            style={{ textDecoration: "none" }}
          >
            <ListItemText primary="Playlists" />
          </ListItem>
          <ListItem
            component={Link}
            to="/preferences"
            onClick={toggleDrawer}
            style={{ textDecoration: "none" }}
          >
            <ListItemText primary="Preferences" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default ResponsiveNavbar;

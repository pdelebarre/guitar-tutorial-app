import React, { useEffect, useState } from "react";
import { getPlaylists, createPlaylist } from "../api/api";
import { Playlist } from "../types/types";
import {
  Typography,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const PlaylistPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylist, setNewPlaylist] = useState<string>("");

  useEffect(() => {
    getPlaylists().then((data: React.SetStateAction<Playlist[]>) => setPlaylists(data));
  }, []);

  const handleCreatePlaylist = async () => {
    if (newPlaylist.trim()) {
      await createPlaylist(newPlaylist);
      setNewPlaylist("");
      getPlaylists().then((data: React.SetStateAction<Playlist[]>) => setPlaylists(data));
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Playlists
      </Typography>
      <TextField
        fullWidth
        value={newPlaylist}
        onChange={(e) => setNewPlaylist(e.target.value)}
        placeholder="New playlist name"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePlaylist}
      >
        Create Playlist
      </Button>
      <List>
        {playlists.map((playlist) => (
          <ListItem key={playlist.id}>
            <ListItemText
              primary={playlist.name}
              secondary={playlist.username}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PlaylistPage;

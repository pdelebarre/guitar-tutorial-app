package com.guitar.tutorial.controller;

import com.guitar.tutorial.model.Playlist;
import com.guitar.tutorial.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    @GetMapping("/user/{username}")
    public List<Playlist> getPlaylistsByUser(@PathVariable String username) {
        return playlistService.getPlaylistsByUser(username);
    }

    @PostMapping("/")
    public Playlist createPlaylist(@RequestBody Playlist playlist) {
        return playlistService.savePlaylist(playlist);
    }

    @PutMapping("/{id}")
    public Playlist updatePlaylist(@PathVariable Long id, @RequestBody Playlist playlist) {
        return playlistService.updatePlaylist(id, playlist);
    }

    @DeleteMapping("/{id}")
    public void deletePlaylist(@PathVariable Long id) {
        playlistService.deletePlaylist(id);
    }
}

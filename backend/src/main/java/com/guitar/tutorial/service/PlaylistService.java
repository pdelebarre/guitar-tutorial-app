package com.guitar.tutorial.service;

import com.guitar.tutorial.model.Playlist;
import com.guitar.tutorial.repository.PlaylistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepository;

    public List<Playlist> getPlaylistsByUser(String username) {
        return playlistRepository.findByUsername(username);
    }

    public Playlist savePlaylist(Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    public Playlist updatePlaylist(Long id, Playlist playlist) {
        Playlist existingPlaylist = playlistRepository.findById(id).orElse(null);
        if (existingPlaylist != null) {
            existingPlaylist.setName(playlist.getName());
            existingPlaylist.setTutorialIds(playlist.getTutorialIds());
            return playlistRepository.save(existingPlaylist);
        }
        return null;
    }

    public void deletePlaylist(Long id) {
        playlistRepository.deleteById(id);
    }
}

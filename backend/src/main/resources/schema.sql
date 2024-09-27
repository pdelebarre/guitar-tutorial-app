-- Create the tutorials table first
CREATE TABLE IF NOT EXISTS tutorials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    video_file_name VARCHAR(255) NOT NULL,
    subtitle_file_name VARCHAR(255),
    tablature_file_name VARCHAR(255)
);

-- Create the comments table
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tutorial_id BIGINT NOT NULL,
    username VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (tutorial_id) REFERENCES tutorials(id)  -- Ensure this points to the tutorials table
);

-- Create the playlist table
CREATE TABLE IF NOT EXISTS playlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL
);

-- Create the playlist-tutorials mapping table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS playlist_tutorials (
    playlist_id BIGINT NOT NULL,
    tutorial_id BIGINT NOT NULL,
    PRIMARY KEY (playlist_id, tutorial_id),
    FOREIGN KEY (playlist_id) REFERENCES playlist(id),
    FOREIGN KEY (tutorial_id) REFERENCES tutorials(id)
);

-- Create the annotations table
CREATE TABLE IF NOT EXISTS annotations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tutorial_id BIGINT NOT NULL,
    username VARCHAR(255) NOT NULL,
    annotation_text TEXT NOT NULL,
    FOREIGN KEY (tutorial_id) REFERENCES tutorials(id)  -- Ensure this points to the tutorials table
);


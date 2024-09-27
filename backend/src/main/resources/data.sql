-- Insert test data into tutorials table
INSERT INTO tutorials (id, video_file_name, subtitle_file_name, tablature_file_name) VALUES
    (1, 'beginner_guitar_lesson.mp4', 'beginner_guitar_lesson.srt', 'beginner_guitar_lesson.pdf'),
    (2, 'fingerstyle_intro.mp4', NULL, 'fingerstyle_intro.pdf'),
    (3, 'advanced_strumming.mp4', 'advanced_strumming.srt', NULL);

-- Insert test data into comments table
INSERT INTO comments (tutorial_id, username, text, timestamp) VALUES
    (1, 'user1', 'Great tutorial, helped me a lot!', CURRENT_TIMESTAMP),
    (1, 'user2', 'This was confusing at first, but after a while it clicked!', CURRENT_TIMESTAMP),
    (2, 'user3', 'Can you explain the strumming pattern in more detail?', CURRENT_TIMESTAMP),
    (3, 'user4', 'Awesome lesson! Can you make more like this?', CURRENT_TIMESTAMP);

-- Insert test data into playlist table
INSERT INTO playlist (id, name, username) VALUES
    (1, 'Beginner Songs', 'user1'),
    (2, 'Fingerstyle Favorites', 'user2'),
    (3, 'Advanced Techniques', 'user3');

-- Insert test data into playlist_tutorials table
INSERT INTO playlist_tutorials (playlist_id, tutorial_id) VALUES
    (1, 1),  -- Beginner Songs contains tutorial 1
    (2, 2),  -- Fingerstyle Favorites contains tutorial 2
    (3, 3),  -- Advanced Techniques contains tutorial 3
    (1, 3);  -- Beginner Songs also contains tutorial 3

-- Insert test data into annotations table
INSERT INTO annotations (tutorial_id, username, annotation_text) VALUES
    (1, 'user1', 'The chord changes in the chorus are tricky.'),
    (1, 'user2', 'I recommend using alternate picking here.'),
    (2, 'user3', 'Pay attention to the finger placement during the intro.'),
    (3, 'user4', 'Great strumming technique explained! Need more practice on this.');

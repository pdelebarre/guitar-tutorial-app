import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getComments, postComment } from "../api/api";
import { Comment } from "../types/types";

interface CommentSectionProps {
  tutorialId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ tutorialId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    getComments(tutorialId).then((data: React.SetStateAction<Comment[]>) => setComments(data));
  }, [tutorialId]);

  const handlePostComment = async () => {
    if (newComment.trim()) {
      await postComment(tutorialId, newComment);
      setNewComment("");
      getComments(tutorialId).then((data: React.SetStateAction<Comment[]>) => setComments(data));
    }
  };

  return (
    <Box mt={3}>
      <Typography variant="h6">Comments</Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText primary={comment.text} secondary={comment.username} />
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        multiline
        rows={2}
      />
      <Button variant="contained" color="primary" onClick={handlePostComment}>
        Post Comment
      </Button>
    </Box>
  );
};

export default CommentSection;

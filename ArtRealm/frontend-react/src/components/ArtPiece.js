import React, { useState } from 'react';
import axios from 'axios';

const ArtPiece = ({ art , temp}) => {
  const [likes, setLikes] = useState(art.likes || 0);
  const [comments, setComments] = useState(art.comments || []);
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    setLikes(likes + 1);
    try {
      // Update likes in the backend (optional)
      const response = await axios.post(`/api/like_artwork/${art._id}/`);
      console.log(response.data); // Log or handle response if needed
    } catch (error) {
      console.error('Error liking artwork:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      try {
        // Submit new comment to the backend
        const response = await axios.post('/api/add_comment/', {
          artwork_id: art._id,
          comment: newComment
        });
        setComments([...comments, newComment]);
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  return (
    <div className="art-piece">
      {art.image_data ? (
        <img
          className="art-image"
          src={`data:${art.image_content_type};base64,${art.image_data}`}
          alt={art.title}
        />
      ) : (
        <div className="no-image">No Image Available</div>
      )}
      <h2>{art.title}</h2>
      <p>By {art.username}</p>
      <p>{art.description}</p>
      <div className="likes">
        <button onClick={handleLike}>Like</button> {likes} likes
      </div>
      <div className="comments">
        <h3>Comments</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ArtPiece;

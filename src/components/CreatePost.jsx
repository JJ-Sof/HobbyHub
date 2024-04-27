import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase';
import './CreatePost.css';

const CreatePost = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageurl, setimageurl] = useState('');
  const navigate = useNavigate();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('posts').insert([
        {
          title,
          content,
          imageurl,
          user_id: userId,
        },
      ]);
      if (error) {
        throw error;
      }
      console.log('Post created:', data);
      navigate('/');
    } catch (error) {
      console.error('Post creation error:', error.message);
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="create-post-title">Create Post</h2>
      <form onSubmit={handleCreatePost}>
        <div>
          <label className="form-label">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="form-label">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea-field"
            required
          ></textarea>
        </div>
        <div>
          <label className="form-label">imageurl:</label>
          <textarea
            value={imageurl}
            onChange={(e) => setimageurl(e.target.value)}
            className="textarea-field"
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-button">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;

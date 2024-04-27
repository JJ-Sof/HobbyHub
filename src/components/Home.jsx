import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabase';
import './Home.css';

const Home = ({ user, navigateToCreatePost }) => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [searchTerm, setSearchTerm] = useState('');
  const [commentTexts, setCommentTexts] = useState({});

  const fetchPosts = async () => {
    try {
      let query = supabase.from('posts').select();

      query = query.order(sortBy, { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) {
        throw error;
      }
      setPosts(data);
      setCommentTexts(data.reduce((acc, post) => {
        acc[post.id] = '';
        return acc;
      }, {}));
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, searchTerm]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCommentChange = (postId, text) => {
    setCommentTexts({
      ...commentTexts,
      [postId]: text
    });
  };

  const handleUpvote = async (postId) => {
    try {
        const { data: postData, error: postError } = await supabase
            .from('posts')
            .select('upvotes')
            .eq('id', postId)
            .single();
        
        if (postError) {
            throw postError;
        }
    
        const userId = localStorage.getItem('user');
        const upvoteKey = `upvote_${userId}_${postId}`;
        const incrementValue = parseInt(localStorage.getItem(upvoteKey), 10) || 1;
        const updatedUpvotes = (postData.upvotes || 0) + incrementValue;
    
        const { data: updatedPostData, error: updateError } = await supabase
            .from('posts')
            .update({ upvotes: updatedUpvotes })
            .eq('id', postId);
        
        if (updateError) {
            throw updateError;
        }
    
        const nextValue = incrementValue === 1 ? -1 : 1;
        localStorage.setItem(upvoteKey, nextValue.toString());
    
        fetchPosts();
    } catch (error) {
        console.error('Error toggling upvote:', error.message);
    }
  };

const handleLogout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
        
        const userId = localStorage.getItem('user');

        const keys = Object.keys(localStorage);
        
        keys.forEach((key) => {
            if (key.startsWith(`upvote_${userId}_`)) {
                localStorage.removeItem(key);
            }
        });

        localStorage.removeItem('user');
        window.location.href = '/login';
    } catch (error) {
        console.error('Error logging out:', error.message);
    }
  };


  const handleAddComment = async (postId) => {
    const commentText = commentTexts[postId];
    if (!commentText.trim()) return; 
    try {
      const { data, error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user, 
        content: commentText
      });
      if (error) {
        throw error;
      }
      setCommentTexts({
        ...commentTexts,
        [postId]: ''
      });
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  };

  const handleCreatePost = () => {
    navigateToCreatePost();
  };


  return (
    <div className="home-container">
      <h2 className="home-title">Home</h2>
      <div className="sort-filter-container">
        <label className="sort-label">
          Sort by:
          <select className="sort-select" value={sortBy} onChange={handleSortChange}>
            <option value="created_time">Created Time</option>
            <option value="upvotes">Upvotes</option>
          </select>
        </label>
        <input className="search-input" type="text" placeholder="Search by title" value={searchTerm} onChange={handleSearchChange} />
      </div>
      <button className="create-post-button" onClick={handleCreatePost}>Create Post</button>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <ul className="post-list">
        {posts.map((post) => (
          <li className="post-item" key={post.id}>
            <Link className="post-link" to={`/post/${post.id}`}>{post.title}</Link>
            <p className="post-details">Created at: {post.created_at}</p>
            <p className="post-details">Upvotes: {post.upvotes}</p>
            <button className="upvote-button" onClick={() => handleUpvote(post.id)}>Upvote</button>
            <div className="comment-container">
              <textarea
                className="comment-textarea"
                rows="3"
                placeholder="Add a comment"
                value={commentTexts[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <button className="submit-comment-button" onClick={() => handleAddComment(post.id)}>Submit Comment</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

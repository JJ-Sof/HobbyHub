import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabase';
import './PostDetails.css';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [editText, setEditText] = useState('');
  const userId = localStorage.getItem('user');

  const fetchPostDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select()
        .eq('id', postId)
        .single();
      if (error) {
        throw error;
      }
      setPost(data);
      setEditText(data.content); 
    } catch (error) {
      console.error('Error fetching post details:', error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase.from('comments').select().eq('post_id', postId);
      if (error) {
        throw error;
      }
      const formattedComments = data.map(comment => ({ ...comment, content: `Anonymous: ${comment.content}` }));
      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  };

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, [postId]);

  const handleUpvote = async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('upvotes')
        .eq('id', postId)
        .single();
      
      if (postError) {
        throw postError;
      }
  
      const incrementValue = parseInt(localStorage.getItem(`upvote_${postId}`), 10) || 1;
      const updatedUpvotes = (postData.upvotes || 0) + incrementValue;
  
      const { error: updateError } = await supabase
        .from('posts')
        .update({ upvotes: updatedUpvotes })
        .eq('id', postId);
      
      if (updateError) {
        throw updateError;
      }
  
      localStorage.setItem(`upvote_${postId}`, (incrementValue === 1 ? -1 : 1).toString());
      fetchPostDetails();
    } catch (error) {
      console.error('Error toggling upvote:', error.message);
    }
  };

  const handleAddComment = async () => {
    try {
      const { error } = await supabase.from('comments').insert({ post_id: postId, content: commentText });
      if (error) {
        throw error;
      }
      fetchComments();
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        throw error;
      }
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  const handleEditPost = async () => {
    try {
      if (post.user_id === userId) {
        const { error } = await supabase.from('posts').update({ content: editText }).eq('id', postId);
        if (error) {
          throw error;
        }
        fetchPostDetails();
      }
    } catch (error) {
      console.error('Error editing post:', error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const comment = comments.find((comment) => comment.id === commentId);
      if (comment && comment.user_id === userId) {
        const { error } = await supabase.from('comments').delete().eq('id', commentId);
        if (error) {
          throw error;
        }
        fetchComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };

  const handleEditComment = async (commentId, updatedContent) => {
    try {
      const comment = comments.find((comment) => comment.id === commentId);
      if (comment && comment.user_id === userId) {
        const { error } = await supabase.from('comments').update({ content: updatedContent }).eq('id', commentId);
        if (error) {
          throw error;
        }
        fetchComments();
      }
    } catch (error) {
      console.error('Error editing comment:', error.message);
    }
  };

  return (
    <div className="post-details-container">
      {post ? (
        <div>
          <h2 className="post-title">{post.title}</h2>
          {post.imageUrl && <img className="post-image" src={post.imageUrl} alt="Post" />}
          <p className="post-content">{post.content}</p>
          <img className="post-image" src={post.imageUrl} alt="Post" />
          <p className="post-upvotes">Upvotes: {post.upvotes}</p>
          <button className="upvote-button" onClick={handleUpvote}>Upvote</button>
          {post.user_id === userId && (
            <>
              <button className="delete-post-button" onClick={handleDeletePost}>Delete Post</button>
              <button className="edit-post-button" onClick={handleEditPost}>Edit Post</button>
            </>
          )}
          <div className="comments-section">
            <h3 className="comments-title">Comments</h3>
            <ul className="comments-list">
              {comments && comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  {comment.user_id === userId && (
                    <div className="comment-buttons">
                      <button className="delete-comment-button" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                      <button className="edit-comment-button" onClick={() => handleEditComment(comment.id, comment.content)}>Edit</button>
                    </div>
                  )}
                  <p className="comment-content">{comment.content}</p>
                </li>
              ))}
            </ul>
            <textarea
              className="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment"
            />
            <button className="add-comment-button" onClick={handleAddComment}>Add Comment</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PostDetails;

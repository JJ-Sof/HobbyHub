import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../supabase';
import './AuthForm.css'; // Import the CSS file

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          })
        if (error) setMessage(error.message);
        else { 
            setMessage('Login successful!');
            onLogin(data);
            navigate('/'); // Redirect to home page after login
        }
    };

    return (
        <div className="auth-form">
            <h2 className="auth-heading">Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="auth-input" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="auth-input" />
                <button type="submit" className="auth-button">Login</button>
            </form>
            <p className="auth-message">Don't have an account? <Link to="/register">Register here</Link></p>
            {message && <p className="auth-message">{message}</p>}
        </div>
    );
}

export default Login;

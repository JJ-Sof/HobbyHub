import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../supabase';
import './AuthForm.css'; // Import the CSS file

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const { user, error } = await supabase.auth.signUp({ email, password });

        if (error) setMessage(error.message);
        else setMessage('Registration successful! Check your email to confirm.');

        setEmail('');
        setPassword('');
    };

    return (
        <div className="auth-form">
            <h2 className="auth-heading">Register</h2>
            <form onSubmit={handleRegister}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="auth-input" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="auth-input" />
                <button type="submit" className="auth-button">Register</button>
            </form>
            <p className="auth-message">Already have an account? <Link to="/login">Login here</Link></p>
            {message && <p className="auth-message">{message}</p>}
        </div>
    );
}

export default Register;

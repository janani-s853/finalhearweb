import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
// --- CHANGE HERE: Import the font file directly ---
import './assets/fonts/PacificaCondensed-Regular.ttf';

const LoginPage = () => {
  const navigate = useNavigate();
  const { continueAsGuest, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [signUpData, setSignUpData] = useState({
    fullName: '', 
    dob: '', 
    email: '', 
    password: '', 
    sendNews: false, 
    shareData: false, 
    agreeToTerms: false,
  });


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // NOTE: The icon variables are no longer needed as the SVGs are now inline.

  const handleSignUpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignUpData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const nextStep = () => {
    if (!signUpData.fullName || !signUpData.dob || !signUpData.email || !signUpData.password) {
      setMessage('Please fill in all required fields.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email)) {
      setMessage('Please enter a valid email address.');
      return;
    }
    
    // Basic password validation
    if (signUpData.password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }
    
    setMessage('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setMessage('');
    setStep(step - 1);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      // eslint-disable-next-line no-unused-vars
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        throw error;
      }
      
      // Successful login
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!signUpData.agreeToTerms) {
      setMessage('You must agree to the Terms & Privacy Policy.');
      return;
    }
    
    try {
      const { fullName } = signUpData;
      const [first_name, ...last_name_parts] = fullName.split(' ');
      const last_name = last_name_parts.join(' ');
      
      // Sign up with Supabase Auth
      const { error: authError } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            first_name, 
            last_name, 
            full_name: fullName, 
            dob: signUpData.dob, 
            send_news: signUpData.sendNews, 
            share_data: signUpData.shareData,
          },
        },
      });
      
      if (authError) {
        throw authError;
      }
      
      // User data is automatically stored in Supabase auth.users table with metadata
      
      setMessage('Signup successful. Check your email to confirm.');
      setIsSignUp(false);
      
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleOAuthLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email address first.');
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleContinueAsGuest = async () => {
    try {
      console.log('Starting guest mode...');
      // First sign out any existing user
      await signOut();
      console.log('Signed out, now enabling guest mode...');
      // Then enable guest mode
      continueAsGuest();
      console.log('Guest mode enabled, navigating to home...');
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if sign out fails, still enable guest mode
      continueAsGuest();
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const toggleForm = (isSigningUp) => {
    setIsSignUp(isSigningUp);
    setMessage('');
    setStep(1);
    setEmail('');
    setPassword('');
    setSignUpData({
      fullName: '', 
      dob: '', 
      email: '', 
      password: '',
      sendNews: false, 
      shareData: false, 
      agreeToTerms: false,
    });
  };

  const renderSignUpForm = () => {
    // This function remains unchanged from your original code.
    if (step === 1) {
      return (
        <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
          <div className="form-header">
            <button 
              type="button" 
              className="back-btn"
              onClick={handleBackToHome}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                marginBottom: '10px',
                padding: '5px'
              }}
            >
              ← Back to Home
            </button>
            <p className="step-indicator">Step 1 of 2</p>
          </div>
          {/* --- CHANGE HERE: Applied the new CSS class --- */}
          <h3 className="hear-title">H.E.A.R</h3>

          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              value={signUpData.fullName} 
              onChange={handleSignUpChange} 
              required 
            />
          </div>
          
          <div className="input-group dob-input">
            <label htmlFor="dob">Date of Birth</label>
            <input 
              type="date" 
              id="dob" 
              name="dob" 
              value={signUpData.dob} 
              onChange={handleSignUpChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={signUpData.email} 
              onChange={handleSignUpChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={signUpData.password} 
              onChange={handleSignUpChange} 
              required 
            />
          </div>
          {message && <p className="error-message">{message}</p>}
          <button type="submit" className="btn btn-primary">Next</button>
          <p className="toggle-link" onClick={() => toggleForm(false)}>Already have an account? Log in</p>
        </form>
      );
    } else { // Step 2
      return (
        <form onSubmit={handleSignUpSubmit}>
          <p className="step-indicator">Step 2 of 2</p>
          <h2>Want us to send you personalized content?</h2>
          <div className="checkbox-group">
            <label><input type="checkbox" name="sendNews" checked={signUpData.sendNews} onChange={handleSignUpChange} /> Send me news and offers</label>
            <label><input type="checkbox" name="shareData" checked={signUpData.shareData} onChange={handleSignUpChange} /> Share my registration data</label>
            <label><input type="checkbox" name="agreeToTerms" checked={signUpData.agreeToTerms} onChange={handleSignUpChange} /> I agree to Terms & Privacy Policy</label>
          </div>
          {message && <p className="error-message">{message}</p>}
          <div className="button-group">
            <button type="button" className="btn btn-secondary" onClick={prevStep}>Back</button>
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
          <p className="toggle-link" onClick={() => toggleForm(false)}>Already have an account? Log in</p>
        </form>
      );
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit}>
      <div className="form-header">


        <h2>Welcome Back</h2>
      </div>

      {/* --- THIS IS THE UPDATED BUTTON CODE --- */}
      <button type="button" className="btn-google" onClick={() => handleOAuthLogin('google')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="oauth-icon">
          <path fill="#4285F4" d="M24 9.5c3.54 0 6.68 1.22 9.18 3.61l6.83-6.83C35.45 2.3 29.91 0 24 0 14.6 0 6.61 5.38 2.7 13.22l7.98 6.19C12.24 13.16 17.66 9.5 24 9.5z" />
          <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.21-.43-4.71H24v9.06h12.43c-.54 2.9-2.16 5.36-4.59 7.03l7.1 5.5C43.79 37.43 46.1 31.36 46.1 24.5z" />
          <path fill="#FBBC05" d="M10.68 28.41c-.48-1.41-.75-2.91-.75-4.41s.27-3 .75-4.41l-7.98-6.19C1.24 16.71 0 20.21 0 24s1.24 7.29 3.32 10.6l7.36-6.19z" />
          <path fill="#EA4335" d="M24 48c6.48 0 11.91-2.13 15.88-5.8l-7.1-5.5c-2.01 1.35-4.58 2.13-8.78 2.13-6.34 0-11.76-3.66-13.33-8.72l-7.98 6.19C6.61 42.62 14.6 48 24 48z" />
        </svg>
        Continue with Google
      </button>

      <button type="button" className="btn-microsoft" onClick={() => handleOAuthLogin('azure')}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" className="oauth-icon">
          <rect width="10" height="10" x="1" y="1" fill="#f25022" />
          <rect width="10" height="10" x="12" y="1" fill="#7fba00" />
          <rect width="10" height="10" x="1" y="12" fill="#00a4ef" />
          <rect width="10" height="10" x="12" y="12" fill="#ffb900" />
        </svg>
        Continue with Microsoft
      </button>

      <div className="divider">OR</div>
<div style={{ marginTop: '-30px' }}> {/* <-- moves the whole block up */}
  <div className="input-group">
    <input
      id="login-email"
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      style={{
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
      }}
    />
  </div>

  <div className="input-group">
    <input
      id="login-password"
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      style={{
        padding: '12px 15px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
        marginTop: '15px', // <-- moves it down; use negative value to move up

      }}
    />
  </div>
</div>


      {message && <p className="error-message">{message}</p>}
      <button type="submit" className="btn btn-primary">Log In</button>
      
      <button 
        type="button" 
        className="btn btn-secondary"
        onClick={handleContinueAsGuest}
        style={{
          marginTop: '10px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Continue as Guest
      </button>
      
      <div className="links-container">
        <p className="toggle-link" onClick={() => toggleForm(true)}>
          Don't have an account? Sign up
        </p>
<div style={{ marginTop: '-15px' }}>
  <button 
    type="button" 
    onClick={handleForgotPassword} 
    className="forgot-password-link"
  >
    Forgot your password?
  </button>
</div>


      </div>
    </form>
  );

  return (
    // --- CHANGE HERE: Added a wrapper div with a unique class ---
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="animation-container"></div>
        <div className="form-container">
          <div className="form-wrapper">
            {isSignUp ? renderSignUpForm() : renderLoginForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
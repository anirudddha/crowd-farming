// SignInPage.js
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase'; // Adjust the import path as needed
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  // const token = useState(null);
    const endpoint = useSelector(state=> state.endpoint.endpoint);
      const navigate = useNavigate();
    

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Optionally, retrieve the Firebase ID token:
      const idToken = await user.getIdToken();
      
      const response = await axios.post(`${endpoint}/auth/google-signin`, {
        idToken:idToken
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
      // console.log("User Info:", user);
      // console.log("ID Token:", idToken);
      // You can now use the token to authenticate with your backend, etc.
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign In with Google</h2>
      <button className='bg-red-500 hover:cursor-pointer' onClick={handleGoogleSignIn}>
        Sign in with Google button
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default SignInPage;

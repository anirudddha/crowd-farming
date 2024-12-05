import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen } from 'react-icons/fa';
import '../styles/Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: '',
  });
  const [preview, setPreview] = useState('');
  const [base64Image, setBase64Image] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfileData(response.data);
        console.log(response.data); 
        setPreview(response.data.profilePicture); // Assume this is a base64 string
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result); // Show preview
      setBase64Image(reader.result); // Save base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/upload-profile-picture',
        { profilePicture: base64Image },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setProfileData({ ...profileData, profilePicture: response.data.profilePicture });
      setBase64Image(''); // Reset after upload
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-image">
        <img src={preview || '/default-profile.png'} alt="Profile" />
        <label htmlFor="file-input" className="upload-icon">
          <FaPen />
        </label>
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      <h2 className="profile-name">{profileData.name}</h2>
      <p className="profile-email">{profileData.email}</p>
      {base64Image && (
        <button className="upload-button" onClick={handleUpload}>
          Upload Profile Picture
        </button>
      )}
    </div>
  );
};

export default Profile;

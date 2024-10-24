import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen } from 'react-icons/fa'; // Import pencil icon
import '../styles/Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
    profilePicture: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfileData(response.data);
        setPreview(`http://localhost:5000/api/profile-picture/${response.data.profilePicture}`);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0])); // Preview the selected image
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-profile-picture', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfileData({ ...profileData, profilePicture: response.data.profilePicture });
      setSelectedFile(null); // Reset selected file after upload
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-image">
        <img src={preview || '/default-profile.png'} alt="Profile" /> {/* Use default image if no preview */}
        <label htmlFor="file-input" className="upload-icon">
          <FaPen />
        </label>
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }} // Hide the input
        />
      </div>
      <h2 className="profile-name">{profileData.name}</h2>
      <p className="profile-email">{profileData.email}</p>
      {/* <p className="profile-username">@{profileData.username}</p> */}

      {/* Show upload button only when a new file is selected */}
      {selectedFile && <button className="upload-button" onClick={handleUpload}>Upload Profile Picture</button>}
    </div>
  );
};

export default Profile;

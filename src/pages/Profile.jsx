import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
  });

  useEffect(() => {
    // Fetch profile data from the API
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      {/* Circular Profile Picture */}
      <div className="profile-image">
        <img
          src="/path-to-profile-picture.jpg" // Replace with the actual image path or URL
          alt="Profile"
        />
      </div>
      <h2 className="profile-name">{profileData.name}</h2>
      <p className="profile-email">{profileData.email}</p>
      <p className="profile-username">@{profileData.username}</p>
    </div>
  );
};

export default Profile;

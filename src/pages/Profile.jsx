import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen } from 'react-icons/fa';
import '../styles/Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    address: '', // Add address to the state
  });
  const [preview, setPreview] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');

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
        setNewName(response.data.name);
        setNewAddress(response.data.address || ''); // Set the address if available
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

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleAddressEdit = () => {
    setIsEditingAddress(true);
  };

  const handleNameSave = async () => {
    try {
      const response = await axios.put(
        'http://localhost:5000/api/editName',
        { name: newName, _id: profileData._id },
      );
      setProfileData({ ...profileData, name: newName });
      setIsEditingName(false);
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  const handleAddressSave = async () => {
    try {
      const response = await axios.put(
        'http://localhost:5000/api/editAddress',
        { address: newAddress ,_id:profileData._id},
      );
      setProfileData({ ...profileData, address: newAddress });
      setIsEditingAddress(false);
    } catch (error) {
      console.error('Error saving address:', error);
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
      <h2 className="profile-name">
        {isEditingName ? (
          <div>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button className="update-button" onClick={handleNameSave}>Save</button>
          </div>
        ) : (
          <span>
            {profileData.name}
            <FaPen className="edit-icon" onClick={handleNameEdit} />
          </span>
        )}
      </h2>
      <p className="profile-email">{profileData.email}</p>

      {/* Address Section */}
      <div className="profile-update-section">
        {isEditingAddress ? (
          <div>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <button className="update-button" onClick={handleAddressSave}>Save Address</button>
          </div>
        ) : profileData.address ? (
          <div>
            <p>{profileData.address}</p>
            <FaPen className="edit-icon" onClick={handleAddressEdit} />
          </div>
        ) : (
          <button className="update-button" onClick={handleAddressEdit}>Add Address</button>
        )}
      </div>

      {base64Image && (
        <button className="upload-button" onClick={handleUpload}>
          Upload Profile Picture
        </button>
      )}
    </div>
  );
};

export default Profile;

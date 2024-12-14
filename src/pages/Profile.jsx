import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen } from 'react-icons/fa';
import '../styles/Profile.css';
import Loader from '../components/Loader';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    address: '',
  });
  const [preview, setPreview] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfileData(response.data);
        setPreview(response.data.profilePicture);
        setNewName(response.data.name);
        setNewAddress(response.data.address || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    setIsLoading(true);// loader
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
      setBase64Image('');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleNameSave = async () => {
    setIsLoading(true);// loader
    try {
      await axios.put('http://localhost:5000/api/editName', { name: newName, _id: profileData._id });
      setProfileData({ ...profileData, name: newName });
      setIsEditingName(false);
    } catch (error) {
      console.error('Error saving name:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleAddressSave = async () => {
    setIsLoading(true);// loader
    try {
      await axios.put('http://localhost:5000/api/editAddress', { address: newAddress, _id: profileData._id });
      setProfileData({ ...profileData, address: newAddress });
      setIsEditingAddress(false);
    } catch (error) {
      console.error('Error saving address:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {
        isLoading ?
          <div className="loaderdev">
            <Loader />
          </div>
          :
          <>
            <div className="profile-image">
              <img src={preview || '/default-profile.png'} alt="Profile" />
              <div className="upload-icon">
                <FaPen />
              </div>
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
                <div className="editable">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <button className="save-button" onClick={handleNameSave}>Save</button>
                </div>
              ) : (
                <span>
                  {profileData.name}
                  <FaPen className="edit-icon" onClick={() => setIsEditingName(true)} />
                </span>
              )}
            </h2>

            <p className="profile-email"><span>Username : </span>{profileData.email}</p>
            <div className="profile-update-section">
              <h3>Address : </h3>
              {isEditingAddress ? (
                <div className="editable">
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter your address"
                  />
                  <button className="save-button" onClick={handleAddressSave}>Save</button>
                </div>
              ) : (
                <p>
                  {profileData.address || 'No address added'}
                  <FaPen className="edit-icon" onClick={() => setIsEditingAddress(true)} />
                </p>
              )}
            </div>
            {base64Image && (
              <button className="upload-button" onClick={handleUpload}>
                Upload Profile Picture
              </button>
            )}
          </>
      }
    </div>
  );
};

export default Profile;

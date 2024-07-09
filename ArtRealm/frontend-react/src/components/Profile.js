import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [artTitle, setArtTitle] = useState('');
  const [artDescription, setArtDescription] = useState('');
  const [artImage, setArtImage] = useState(null);
  const query = new URLSearchParams(useLocation().search);
  const userId = query.get('userId');

  useEffect(() => {
    if (userId) {
      axios.post('http://localhost:8000/api/profile/', { user_id: userId })
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the user data!", error);
        });
    }
  }, [userId]);

  const handleFileChange = (e) => {
    setArtImage(e.target.files[0]);
  };

  const handleAddArtwork = () => {
    if (!artTitle || !artDescription || !artImage) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append('title', artTitle);
    formData.append('description', artDescription);
    formData.append('image', artImage);
    formData.append('user_id', userId);

    axios.post('http://localhost:8000/api/add_artwork/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert("Artwork added successfully!");
      setShowPopup(false);
      setArtTitle('');
      setArtDescription('');
      setArtImage(null);
    })
    .catch(error => {
      console.error("There was an error adding the artwork!", error);
    });
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar />
    <div className='profile'>
      <div className='pcont'>
        <div className='pic'>
          <img src={userData.profilePicture || ""} alt="Profile" />
        </div>
        <h2>{userData.username}</h2>
        <h2>{userData.first_name}</h2>
        <h2>{userData.last_name}</h2>
        <h2>{userData.bio}</h2>
        <h2>{userData.created_at}</h2>
        <h2>{userData.updated_at}</h2>
        <h2>{userData.email}</h2>
        <button onClick={() => setShowPopup(true)}>Add Artwork</button>
      </div>
      <div className='profileimg'>
        <img src="https://i.pinimg.com/originals/54/6b/e5/546be54722dc5d998209d23751b8ee24.gif" alt="" />
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add New Artwork</h2>
            <input
              type="text"
              placeholder="Title"
              value={artTitle}
              onChange={(e) => setArtTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={artDescription}
              onChange={(e) => setArtDescription(e.target.value)}
            ></textarea>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleAddArtwork}>Submit</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Profile;

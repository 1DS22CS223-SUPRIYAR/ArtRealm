import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArtPiece from './ArtPiece';
import Navbar from './Navbar';
import Caraousel from './Caraousel';
import { useLocation } from 'react-router-dom';
import './ArtGallery.css';

const ArtGallery = () => {
  const [artPieces, setArtPieces] = useState([]);
  const [userId, setUserId] = useState('');

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();

  useEffect(() => {
    const userIdFromQuery = query.get('userId');
    if (userIdFromQuery) {
      setUserId(userIdFromQuery);
    }

    // Fetch the art pieces from an API or a local JSON file
    axios.get('http://localhost:8000/api/artworks/')  // Adjust the API endpoint as per your Django setup
      .then(response => {
        setArtPieces(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the art pieces!", error);
      });
  }, [query]);

  return (
    <div className="art-gallery">
      <Navbar />
      <Caraousel />
      {artPieces.map((art, index) => (
        <ArtPiece key={index} art={art} />
      ))}
    </div>
  );
}

export default ArtGallery;

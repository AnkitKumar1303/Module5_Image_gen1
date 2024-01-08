import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchResults, setSearchResults] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");

  const fetchImageData = async (input) => {
    try {
      if (input.trim() !== "") {
        setLoading(true);

        const response = await axios.post(
          'https://api-inference.huggingface.co/models/prompthero/openjourney-v4',
          { inputs: input },
          {
            headers: {
              Authorization: 'Bearer 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',
              'Content-Type': 'application/json',
            },
            responseType: 'blob',
          }
        );

        const blob = response.data;
        const imageUrl = URL.createObjectURL(blob);

        setSearchResults([imageUrl]);
        setError("");
      } else {
        setError("Please enter a valid input.");
      }
    } catch (err) {
      console.error('Error:', err);
      setError("Failed to fetch image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchResults([]); // Clear previous search results
    fetchImageData(searchTerm);
  };

  const handleClear = () => {
    setSearchResults([]);
    setSearchTerm("");
  };

  return (
    <div className="app-container">
      <h1>Image Search</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={handleClear} disabled={loading}>
          Clear
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="image-container">
        {searchResults.map((imageUrl, index) => (
          <div key={index} className="image-item">
            <img src={imageUrl} alt={`Result ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;


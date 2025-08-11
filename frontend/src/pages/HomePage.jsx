import { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const HomePage = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/shorten`, { originalUrl: url });
      setShortUrl(`${window.location.origin}/${response.data.shortCode}`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          URL Shortener
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Enter URL to shorten"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Shorten
          </Button>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {shortUrl && (
          <Box sx={{ mt: 3 }}>
            <Typography>Short URL:</Typography>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
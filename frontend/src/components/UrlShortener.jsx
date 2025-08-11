import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/shorten', { originalUrl: url });
      setShortUrl(`${window.location.origin}/${res.data.shortCode}`);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleViewStats = (shortCode) => {
    navigate(`/stats/${shortCode}`);
  };

  return (
    <div className="url-shortener">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to shorten"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {shortUrl && (
        <div className="result">
          <p>Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
          <button 
            onClick={() => handleViewStats(shortUrl.split('/').pop())}
            className="stats-btn"
          >
            View Stats
          </button>
          <button 
            onClick={() => navigator.clipboard.writeText(shortUrl)}
            className="copy-btn"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
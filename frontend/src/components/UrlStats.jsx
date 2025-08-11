import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UrlStats = () => {
  const { shortCode } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/${shortCode}/stats`);
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch stats');
        setLoading(false);
      }
    };

    fetchStats();
  }, [shortCode]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="stats-container">
      <h2>Statistics for {shortCode}</h2>
      <div className="stats-summary">
        <p>Total Clicks: <strong>{stats.clicks}</strong></p>
        <p>Created: <strong>{new Date(stats.createdAt).toLocaleString()}</strong></p>
      </div>

      <h3>Recent Activity</h3>
      <div className="analytics-table">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Referrer</th>
              <th>Device</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {stats.analytics.slice(0, 10).map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>{entry.referrer || 'Direct'}</td>
                <td>{entry.userAgent}</td>
                <td>{entry.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UrlStats;
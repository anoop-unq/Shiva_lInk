import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const StatsPage = () => {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/${code}/stats`);
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch stats');
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Summary</Typography>
        <Typography>Short Code: {code}</Typography>
        <Typography>Total Clicks: {stats.clicks}</Typography>
        <Typography>Created: {new Date(stats.createdAt).toLocaleString()}</Typography>
      </Paper>

      <Typography variant="h6" gutterBottom>Recent Activity</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Referrer</TableCell>
              <TableCell>User Agent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.analytics.slice(0, 10).map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                <TableCell>{entry.referrer || 'Direct'}</TableCell>
                <TableCell>{entry.userAgent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StatsPage;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import { Delete, Edit, Refresh } from '@mui/icons-material';

const AdminPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditUrl, setCurrentEditUrl] = useState(null);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/urls`);
      setUrls(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch URLs');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleDeleteClick = (url) => {
    setUrlToDelete(url);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/urls/${urlToDelete._id}`);
      setOpenDeleteDialog(false);
      fetchUrls();
    } catch (err) {
      setError('Failed to delete URL');
    }
  };

  const handleEditClick = (url) => {
    setCurrentEditUrl(url);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/urls/${currentEditUrl._id}`,
        { originalUrl: currentEditUrl.originalUrl }
      );
      setEditDialogOpen(false);
      fetchUrls();
    } catch (err) {
      setError('Failed to update URL');
    }
  };

  const filteredUrls = urls.filter(url =>
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          label="Search URLs"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={fetchUrls}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short Code</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredUrls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No URLs found
                </TableCell>
              </TableRow>
            ) : (
              filteredUrls.map((url) => (
                <TableRow key={url._id}>
                  <TableCell>{url.shortCode}</TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {url.originalUrl}
                  </TableCell>
                  <TableCell>{url.clicks}</TableCell>
                  <TableCell>{new Date(url.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(url)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(url)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this URL?
          <Box sx={{ mt: 2 }}>
            <Typography><strong>Short Code:</strong> {urlToDelete?.shortCode}</Typography>
            <Typography><strong>Original URL:</strong> {urlToDelete?.originalUrl}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit URL</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Original URL"
              variant="outlined"
              value={currentEditUrl?.originalUrl || ''}
              onChange={(e) => setCurrentEditUrl({
                ...currentEditUrl,
                originalUrl: e.target.value
              })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" color="primary">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
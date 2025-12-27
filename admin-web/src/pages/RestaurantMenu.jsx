import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Restaurant,
} from '@mui/icons-material';
import api from '../services/api';

const defaultItem = {
  name: '',
  description: '',
  price: '',
  category: '',
  isAvailable: true,
  isVegetarian: false,
  preparationTime: 15,
};

const RestaurantMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editDialog, setEditDialog] = useState({ open: false, item: null });
  const [formData, setFormData] = useState(defaultItem);
  const [saving, setSaving] = useState(false);

  const restaurantId = localStorage.getItem('restaurantId') || 'rest_001';

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/restaurants/${restaurantId}/menu`);
      if (res.data.success) {
        setMenuItems(res.data.menuItems || []);
        setCategories(res.data.categories || []);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        category: item.category,
        isAvailable: item.isAvailable,
        isVegetarian: item.isVegetarian,
        preparationTime: item.preparationTime || 15,
      });
      setEditDialog({ open: true, item });
    } else {
      setFormData(defaultItem);
      setEditDialog({ open: true, item: null });
    }
  };

  const handleCloseDialog = () => {
    setEditDialog({ open: false, item: null });
    setFormData(defaultItem);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editDialog.item) {
        await api.patch(`/restaurants/${restaurantId}/menu/item/${editDialog.item._id}`, data);
      } else {
        await api.post(`/restaurants/${restaurantId}/menu/item`, data);
      }

      fetchMenu();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save item:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      await api.patch(`/restaurants/${restaurantId}/menu/item/${itemId}`, {
        isAvailable: !currentStatus,
      });
      fetchMenu();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/restaurants/${restaurantId}/menu/item/${itemId}`);
      fetchMenu();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Menu Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Item
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={selectedCategory}
        onChange={(e, v) => setSelectedCategory(v)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab value="all" label="All Items" />
        {categories.map(cat => (
          <Tab key={cat} value={cat} label={cat} />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        {filteredItems.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <Restaurant sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    No menu items found
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ mt: 2 }}
                  >
                    Add First Item
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ height: '100%', opacity: item.isAvailable ? 1 : 0.6 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="h6" fontWeight="bold">
                          {item.name}
                        </Typography>
                        {item.isVegetarian && (
                          <Chip label="V" size="small" color="success" />
                        )}
                      </Box>
                      <Chip label={item.category} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Box>

                  {item.description && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {item.description}
                    </Typography>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={item.isAvailable}
                          onChange={() => handleToggleAvailability(item._id, item.isAvailable)}
                          color="success"
                          size="small"
                        />
                      }
                      label={item.isAvailable ? 'Available' : 'Unavailable'}
                    />
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={editDialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editDialog.item ? 'Edit Menu Item' : 'Add Menu Item'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Price ($)"
                  fullWidth
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Prep Time (min)"
                  fullWidth
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value, 10) })}
                  InputProps={{ inputProps: { min: 1, max: 120 } }}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
                <MenuItem value="__new__">+ Add New Category</MenuItem>
              </Select>
            </FormControl>
            {formData.category === '__new__' && (
              <TextField
                label="New Category Name"
                fullWidth
                required
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            )}
            <Box display="flex" gap={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    color="success"
                  />
                }
                label="Available"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isVegetarian}
                    onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                    color="success"
                  />
                }
                label="Vegetarian"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !formData.name || !formData.price || !formData.category}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantMenu;


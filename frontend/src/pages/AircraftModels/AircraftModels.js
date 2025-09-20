import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search,
  FlightTakeoff,
  Business,
  Scale,
  AirlineSeatReclineNormal,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import { apiService } from '../../services/apiService';

function AircraftModels() {
  const [loading, setLoading] = useState(true);
  const [aircraftModels, setAircraftModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAircraftModels();
  }, []);

  useEffect(() => {
    // Filter models based on search term
    if (searchTerm) {
      const filtered = aircraftModels.filter(aircraft =>
        aircraft.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aircraft.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aircraft.variant.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredModels(filtered);
    } else {
      setFilteredModels(aircraftModels);
    }
  }, [searchTerm, aircraftModels]);

  const loadAircraftModels = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAircraftModels();
      setAircraftModels(response.aircraft || []);
      setFilteredModels(response.aircraft || []);
      toast.success(`Loaded ${response.aircraft?.length || 0} aircraft models`);
    } catch (error) {
      console.error('Error loading aircraft models:', error);
      toast.error('Failed to load aircraft models');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'manufacturer',
      headerName: 'Manufacturer',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business fontSize="small" color="primary" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'model',
      headerName: 'Model',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightTakeoff fontSize="small" color="secondary" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'variant',
      headerName: 'Variant',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'type_certificate',
      headerName: 'Type Certificate',
      width: 180,
    },
    {
      field: 'max_seats',
      headerName: 'Max Seats',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AirlineSeatReclineNormal fontSize="small" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'max_weight_kg',
      headerName: 'Max Weight (kg)',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Scale fontSize="small" />
          {params.value?.toLocaleString()}
        </Box>
      ),
    },
  ];

  const getManufacturerStats = () => {
    const stats = {};
    aircraftModels.forEach(aircraft => {
      stats[aircraft.manufacturer] = (stats[aircraft.manufacturer] || 0) + 1;
    });
    return stats;
  };

  const getModelFamilyStats = () => {
    const stats = {};
    aircraftModels.forEach(aircraft => {
      // Extract base model (e.g., "E175" from "E175-E2")
      const baseModel = aircraft.model.split('-')[0];
      stats[baseModel] = (stats[baseModel] || 0) + 1;
    });
    return stats;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const manufacturerStats = getManufacturerStats();
  const modelFamilyStats = getModelFamilyStats();

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Aircraft Models Database
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Comprehensive database of supported aircraft models with technical specifications
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FlightTakeoff sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {aircraftModels.length}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Aircraft Models
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Business sx={{ fontSize: 40, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {Object.keys(manufacturerStats).length}
                  </Typography>
                  <Typography color="text.secondary">
                    Manufacturers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Scale sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {Object.keys(modelFamilyStats).length}
                  </Typography>
                  <Typography color="text.secondary">
                    Model Families
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search aircraft models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Aircraft Models Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Aircraft Models ({filteredModels.length})
          </Typography>
          
          {filteredModels.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              {searchTerm ? 'No aircraft models match your search criteria.' : 'No aircraft models found.'}
            </Alert>
          ) : (
            <Box sx={{ height: 600, width: '100%', mt: 2 }}>
              <DataGrid
                rows={filteredModels}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f0f0f0',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid #e0e0e0',
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Summary Information */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                By Manufacturer
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {Object.entries(manufacturerStats).map(([manufacturer, count]) => (
                  <Chip
                    key={manufacturer}
                    label={`${manufacturer} (${count})`}
                    variant="outlined"
                    color="primary"
                    icon={<Business />}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                By Model Family
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {Object.entries(modelFamilyStats).map(([model, count]) => (
                  <Chip
                    key={model}
                    label={`${model} Series (${count})`}
                    variant="outlined"
                    color="secondary"
                    icon={<FlightTakeoff />}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AircraftModels;
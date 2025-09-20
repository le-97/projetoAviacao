import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Gavel,
  ExpandMore,
  Security,
  Assignment,
  Info,
  Public,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { apiService } from '../../services/apiService';

function Regulations() {
  const [loading, setLoading] = useState(false);
  const [authorities, setAuthorities] = useState([]);
  const [supportedModels, setSupportedModels] = useState([]);
  const [supportedCountries, setSupportedCountries] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [regulations, setRegulations] = useState([]);
  const [regulationsLoading, setRegulationsLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load authorities
      const authoritiesResponse = await apiService.getAuthorities();
      setAuthorities(authoritiesResponse.authorities || []);

      // Load supported models and countries
      const modelsResponse = await apiService.getSupportedModels();
      setSupportedModels(modelsResponse.models || []);
      setSupportedCountries(modelsResponse.countries || []);

      toast.success('Loaded aviation authorities and models');
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load authorities and models');
    } finally {
      setLoading(false);
    }
  };

  const loadRegulations = async (model, country) => {
    try {
      setRegulationsLoading(true);
      const response = await apiService.getRegulations(model, country);
      setRegulations(response.regulations || []);
      toast.success(`Loaded ${response.total_regulations || 0} applicable regulations`);
    } catch (error) {
      console.error('Error loading regulations:', error);
      toast.error('Failed to load regulations');
    } finally {
      setRegulationsLoading(false);
    }
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    if (model && selectedCountry) {
      loadRegulations(model, selectedCountry);
    }
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    if (selectedModel && country) {
      loadRegulations(selectedModel, country);
    }
  };

  const getCategoryColor = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('airworthiness') || categoryLower.includes('safety')) {
      return 'error';
    } else if (categoryLower.includes('certification') || categoryLower.includes('operations')) {
      return 'warning';
    } else if (categoryLower.includes('systems') || categoryLower.includes('equipment')) {
      return 'info';
    } else {
      return 'default';
    }
  };

  const getAuthorityStats = () => {
    const stats = {};
    authorities.forEach(authority => {
      stats[authority.country] = (stats[authority.country] || 0) + 1;
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

  const authorityStats = getAuthorityStats();

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Aviation Regulations Database
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Comprehensive database of aviation regulations from international authorities
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Security sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {authorities.length}
                  </Typography>
                  <Typography color="text.secondary">
                    Aviation Authorities
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
                <Gavel sx={{ fontSize: 40, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {regulations.length || '---'}
                  </Typography>
                  <Typography color="text.secondary">
                    Applicable Regulations
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
                <Public sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {Object.keys(authorityStats).length}
                  </Typography>
                  <Typography color="text.secondary">
                    Countries/Regions
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Filter Regulations
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Aircraft Model</InputLabel>
                <Select
                  value={selectedModel}
                  label="Aircraft Model"
                  onChange={(e) => handleModelChange(e.target.value)}
                  disabled={regulationsLoading}
                >
                  {supportedModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Country/Region</InputLabel>
                <Select
                  value={selectedCountry}
                  label="Country/Region"
                  onChange={(e) => handleCountryChange(e.target.value)}
                  disabled={regulationsLoading}
                >
                  {supportedCountries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Aviation Authorities */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Aviation Authorities
          </Typography>
          <Grid container spacing={2}>
            {authorities.map((authority) => (
              <Grid item xs={12} md={6} lg={4} key={authority.id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Security color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {authority.code}
                      </Typography>
                    </Box>
                    <Typography variant="body1" gutterBottom>
                      {authority.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Country: {authority.country}
                    </Typography>
                    {authority.website && (
                      <Typography variant="body2" color="primary">
                        <a href={authority.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Regulations */}
      {(selectedModel && selectedCountry) && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Applicable Regulations: {selectedModel} in {selectedCountry}
              </Typography>
              {regulationsLoading && <CircularProgress size={24} />}
            </Box>

            {regulations.length === 0 && !regulationsLoading ? (
              <Alert severity="info">
                No regulations found for the selected aircraft model and country combination.
              </Alert>
            ) : (
              <Box>
                {regulations.map((regulation, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Gavel color="primary" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {regulation.reference}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {regulation.title}
                          </Typography>
                        </Box>
                        <Chip
                          label={regulation.category}
                          color={getCategoryColor(regulation.category)}
                          size="small"
                        />
                        <Chip
                          label={regulation.authority}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        {regulation.description}
                      </Typography>
                      
                      {regulation.subcategory && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Subcategory:
                          </Typography>
                          <Chip 
                            label={regulation.subcategory} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      )}

                      {regulation.content && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Additional Information:
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <Info fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Detailed regulation content available"
                                secondary="Contact the relevant authority for complete regulatory text"
                              />
                            </ListItem>
                          </List>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      {!(selectedModel && selectedCountry) && (
        <Alert severity="info">
          Select an aircraft model and country/region above to view applicable regulations.
        </Alert>
      )}
    </Box>
  );
}

export default Regulations;
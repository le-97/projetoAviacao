import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search,
  FlightTakeoff,
  CheckCircle,
  Warning,
  Error,
  ExpandMore,
  Info,
  Assignment,
  Gavel,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { apiService, apiUtils } from '../../services/apiService';

function ComplianceCheck() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [supportedModels, setSupportedModels] = useState([]);
  const [supportedCountries, setSupportedCountries] = useState([]);
  const [complianceResult, setComplianceResult] = useState(null);

  useEffect(() => {
    loadSupportedOptions();
  }, []);

  const loadSupportedOptions = async () => {
    try {
      const response = await apiService.getSupportedModels();
      setSupportedModels(response.models || []);
      setSupportedCountries(response.countries || []);
    } catch (error) {
      console.error('Error loading supported options:', error);
      toast.error('Failed to load aircraft models and countries');
    }
  };

  const handleComplianceCheck = async () => {
    if (!selectedModel || !selectedCountry) {
      toast.error('Please select both aircraft model and country');
      return;
    }

    try {
      setLoading(true);
      setComplianceResult(null);

      const result = await apiService.checkCompliance(selectedModel, selectedCountry);
      setComplianceResult(result);
      
      toast.success('Compliance check completed successfully');
    } catch (error) {
      console.error('Error checking compliance:', error);
      toast.error(apiUtils.formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircle color="success" />;
      case 'PARTIAL_COMPLIANCE':
        return <Warning color="warning" />;
      case 'NON_COMPLIANT':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'error';
      case 'MAJOR':
        return 'warning';
      case 'MINOR':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Aircraft Compliance Check
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Check regulatory compliance for aircraft models against international aviation authorities
      </Typography>

      {/* Input Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="end">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Aircraft Model</InputLabel>
                <Select
                  value={selectedModel}
                  label="Aircraft Model"
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={loading}
                >
                  {supportedModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FlightTakeoff fontSize="small" />
                        {model}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Country/Region</InputLabel>
                <Select
                  value={selectedCountry}
                  label="Country/Region"
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={loading}
                >
                  {supportedCountries.map((country) => (
                    <MenuItem key={country} value={country}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Gavel fontSize="small" />
                        {country}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleComplianceCheck}
                disabled={loading || !selectedModel || !selectedCountry}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                sx={{ height: 56 }}
              >
                {loading ? 'Checking...' : 'Check Compliance'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results */}
      {complianceResult && (
        <Box>
          {/* Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {getStatusIcon(complianceResult.overall_status)}
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {apiUtils.formatComplianceStatus(complianceResult.overall_status)}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Aircraft:</strong> {complianceResult.aircraft_model}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Region:</strong> {complianceResult.country}
                  </Typography>
                  {complianceResult.aircraft_info && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Aircraft Details:
                      </Typography>
                      <Typography variant="body2">
                        {complianceResult.aircraft_info.manufacturer} {complianceResult.aircraft_info.variant}
                      </Typography>
                      <Typography variant="body2">
                        Max Seats: {complianceResult.aircraft_info.max_seats} • 
                        Max Weight: {complianceResult.aircraft_info.max_weight_kg} kg
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${complianceResult.total_checks} Total Checks`}
                      color="info"
                      variant="outlined"
                    />
                    <Chip
                      label={`${complianceResult.compliant_checks} Compliant`}
                      color="success"
                      variant="outlined"
                    />
                    {complianceResult.non_compliant_checks > 0 && (
                      <Chip
                        label={`${complianceResult.non_compliant_checks} Non-Compliant`}
                        color="error"
                        variant="outlined"
                      />
                    )}
                    {complianceResult.critical_issues > 0 && (
                      <Chip
                        label={`${complianceResult.critical_issues} Critical Issues`}
                        color="error"
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Detailed Checks */}
          {complianceResult.checks && complianceResult.checks.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Detailed Compliance Checks
                </Typography>
                
                {complianceResult.checks.map((check, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        {getStatusIcon(check.status)}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {check.regulation_reference}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {check.regulation_title}
                          </Typography>
                        </Box>
                        <Chip
                          label={check.severity}
                          color={getSeverityColor(check.severity)}
                          size="small"
                        />
                        <Chip
                          label={apiUtils.formatComplianceStatus(check.status)}
                          color={apiUtils.getStatusColor(check.status)}
                          size="small"
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {check.findings && check.findings.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Findings:
                          </Typography>
                          <List dense>
                            {check.findings.map((finding, i) => (
                              <ListItem key={i} sx={{ py: 0 }}>
                                <ListItemIcon sx={{ minWidth: 24 }}>
                                  <Info fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={finding} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      
                      {check.recommendations && check.recommendations.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Recommendations:
                          </Typography>
                          <List dense>
                            {check.recommendations.map((recommendation, i) => (
                              <ListItem key={i} sx={{ py: 0 }}>
                                <ListItemIcon sx={{ minWidth: 24 }}>
                                  <Assignment fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={recommendation} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {complianceResult.recommendations && complianceResult.recommendations.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Overall Recommendations
                </Typography>
                <List>
                  {complianceResult.recommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Assignment color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {/* Help Text */}
      {!complianceResult && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            Select an aircraft model and country/region to check compliance against relevant aviation regulations.
            This system supports E175, E190, E195 series aircraft and checks against ANAC (Brazil), FAA (USA), and EASA (Europe) regulations.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}

export default ComplianceCheck;
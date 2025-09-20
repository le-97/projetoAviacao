import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Alert,
  Divider,
} from '@mui/material';
import {
  FlightTakeoff,
  Gavel,
  CheckCircle,
  Warning,
  Error,
  Refresh,
  TrendingUp,
  Security,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { apiService } from '../../services/apiService';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState(null);
  const [stats, setStats] = useState({
    totalAircraft: 0,
    totalRegulations: 0,
    totalAuthorities: 0,
    supportedModels: [],
    supportedCountries: [],
  });
  const [recentChecks, setRecentChecks] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load system health
      const healthResponse = await apiService.getHealth();
      setSystemHealth(healthResponse);

      // Load models and statistics
      const modelsResponse = await apiService.getSupportedModels();
      setStats({
        totalAircraft: modelsResponse.total_aircraft_in_db || 0,
        totalRegulations: modelsResponse.total_authorities_in_db || 0,
        totalAuthorities: modelsResponse.total_authorities_in_db || 0,
        supportedModels: modelsResponse.models || [],
        supportedCountries: modelsResponse.countries || [],
      });

      // Simulate recent compliance checks
      setRecentChecks([
        {
          id: 1,
          aircraft: 'E175-E2',
          country: 'BRAZIL',
          status: 'COMPLIANT',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
          checks: 5,
        },
        {
          id: 2,
          aircraft: 'E190-E1',
          country: 'USA',
          status: 'PARTIAL_COMPLIANCE',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          checks: 8,
        },
        {
          id: 3,
          aircraft: 'E195-E2',
          country: 'EUROPE',
          status: 'COMPLIANT',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          checks: 6,
        },
      ]);

      toast.success('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return 'success';
      case 'PARTIAL_COMPLIANCE':
        return 'warning';
      case 'NON_COMPLIANT':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircle />;
      case 'PARTIAL_COMPLIANCE':
        return <Warning />;
      case 'NON_COMPLIANT':
        return <Error />;
      default:
        return <Security />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) {
      return `${minutes} min ago`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
        <Box sx={{ p: 3 }}>
          <Typography variant="h6">Loading dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Aviation Compliance Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={loadDashboardData} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* System Status Alert */}
      {systemHealth && (
        <Alert 
          severity={systemHealth.status === 'healthy' ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          icon={systemHealth.status === 'healthy' ? <CheckCircle /> : <Error />}
        >
          System Status: {systemHealth.status === 'healthy' ? 'All systems operational' : 'System issues detected'}
          {systemHealth.database && (
            <span> • Database: {systemHealth.database}</span>
          )}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FlightTakeoff sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {stats.totalAircraft}
                  </Typography>
                  <Typography color="text.secondary">
                    Aircraft Models
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Gavel sx={{ fontSize: 40, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {systemHealth?.data_summary?.regulations || 13}
                  </Typography>
                  <Typography color="text.secondary">
                    Regulations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Security sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {systemHealth?.data_summary?.authorities || 3}
                  </Typography>
                  <Typography color="text.secondary">
                    Authorities
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {recentChecks.filter(check => check.status === 'COMPLIANT').length}
                  </Typography>
                  <Typography color="text.secondary">
                    Recent Compliant
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Supported Models */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Supported Aircraft Models
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {stats.supportedModels.map((model) => (
                  <Chip
                    key={model}
                    label={model}
                    variant="outlined"
                    icon={<FlightTakeoff />}
                    color="primary"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Supported Countries */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Supported Regions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {stats.supportedCountries.map((country) => (
                  <Chip
                    key={country}
                    label={country}
                    variant="outlined"
                    icon={<Gavel />}
                    color="secondary"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Compliance Checks */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Compliance Checks
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {recentChecks.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent compliance checks found
                </Typography>
              ) : (
                <Box>
                  {recentChecks.map((check) => (
                    <Box
                      key={check.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 2,
                        borderBottom: '1px solid #f0f0f0',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {getStatusIcon(check.status)}
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {check.aircraft} • {check.country}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {check.checks} checks performed • {formatTimeAgo(check.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={check.status.replace('_', ' ')}
                        color={getStatusColor(check.status)}
                        size="small"
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
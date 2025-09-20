import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Tab,
  Tabs,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  FlightTakeoff,
  CheckCircle,
  Warning,
  Error,
  Info,
  DateRange,
  Security,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

function Reports() {
  const [activeTab, setActiveTab] = useState(0);

  // Mock data for demonstration
  const complianceOverview = {
    totalChecks: 156,
    compliantChecks: 128,
    partialCompliance: 22,
    nonCompliantChecks: 6,
    criticalIssues: 2,
  };

  const modelPerformance = [
    { model: 'E175-E1', compliant: 85, partial: 12, nonCompliant: 3 },
    { model: 'E175-E2', compliant: 92, partial: 6, nonCompliant: 2 },
    { model: 'E190-E1', compliant: 78, partial: 18, nonCompliant: 4 },
    { model: 'E190-E2', compliant: 88, partial: 10, nonCompliant: 2 },
    { model: 'E195-E1', compliant: 82, partial: 15, nonCompliant: 3 },
    { model: 'E195-E2', compliant: 90, partial: 8, nonCompliant: 2 },
    { model: '737-800', compliant: 95, partial: 4, nonCompliant: 1 },
    { model: 'A320neo', compliant: 93, partial: 5, nonCompliant: 2 },
  ];

  const authorityBreakdown = [
    { authority: 'ANAC', value: 45, color: '#8884d8' },
    { authority: 'FAA', value: 38, color: '#82ca9d' },
    { authority: 'EASA', value: 35, color: '#ffc658' },
  ];

  const complianceTrend = [
    { month: 'Jan', compliant: 88, partial: 10, nonCompliant: 2 },
    { month: 'Feb', compliant: 90, partial: 8, nonCompliant: 2 },
    { month: 'Mar', compliant: 85, partial: 12, nonCompliant: 3 },
    { month: 'Apr', compliant: 92, partial: 6, nonCompliant: 2 },
    { month: 'May', compliant: 89, partial: 9, nonCompliant: 2 },
    { month: 'Jun', compliant: 94, partial: 5, nonCompliant: 1 },
  ];

  const recentIssues = [
    {
      id: 1,
      aircraft: 'E190-E1',
      authority: 'FAA',
      issue: 'Emergency evacuation system inspection overdue',
      severity: 'CRITICAL',
      status: 'OPEN',
      date: '2024-01-15',
    },
    {
      id: 2,
      aircraft: 'E175-E1',
      authority: 'EASA',
      issue: 'Navigation system software update required',
      severity: 'MAJOR',
      status: 'IN_PROGRESS',
      date: '2024-01-12',
    },
    {
      id: 3,
      aircraft: 'E195-E2',
      authority: 'ANAC',
      issue: 'Cabin air quality monitoring documentation',
      severity: 'MINOR',
      status: 'RESOLVED',
      date: '2024-01-10',
    },
  ];

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'success';
      case 'IN_PROGRESS':
        return 'warning';
      case 'OPEN':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateComplianceRate = () => {
    const total = complianceOverview.totalChecks;
    const compliant = complianceOverview.compliantChecks;
    return ((compliant / total) * 100).toFixed(1);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Compliance Reports & Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Comprehensive analysis of aircraft compliance performance and regulatory trends
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {complianceOverview.totalChecks}
                  </Typography>
                  <Typography color="text.secondary">
                    Total Checks
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
                    {calculateComplianceRate()}%
                  </Typography>
                  <Typography color="text.secondary">
                    Compliance Rate
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
                <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {complianceOverview.partialCompliance}
                  </Typography>
                  <Typography color="text.secondary">
                    Partial Compliance
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
                <Error sx={{ fontSize: 40, color: 'error.main' }} />
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {complianceOverview.criticalIssues}
                  </Typography>
                  <Typography color="text.secondary">
                    Critical Issues
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Model Performance" />
            <Tab label="Authority Breakdown" />
            <Tab label="Compliance Trends" />
            <Tab label="Recent Issues" />
          </Tabs>
        </Box>

        {/* Model Performance Tab */}
        <TabPanel value={activeTab} index={0}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Compliance Performance by Aircraft Model
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={modelPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="compliant" stackId="a" fill="#4caf50" name="Compliant" />
                <Bar dataKey="partial" stackId="a" fill="#ff9800" name="Partial" />
                <Bar dataKey="nonCompliant" stackId="a" fill="#f44336" name="Non-Compliant" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </TabPanel>

        {/* Authority Breakdown Tab */}
        <TabPanel value={activeTab} index={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Regulations by Aviation Authority
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={authorityBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {authorityBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                  {authorityBreakdown.map((authority) => (
                    <Box key={authority.authority} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          backgroundColor: authority.color,
                          borderRadius: 1,
                        }}
                      />
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {authority.authority}
                      </Typography>
                      <Chip label={`${authority.value} regulations`} size="small" />
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Compliance Trends Tab */}
        <TabPanel value={activeTab} index={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Compliance Trends Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={complianceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="compliant" stroke="#4caf50" name="Compliant %" />
                <Line type="monotone" dataKey="partial" stroke="#ff9800" name="Partial %" />
                <Line type="monotone" dataKey="nonCompliant" stroke="#f44336" name="Non-Compliant %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </TabPanel>

        {/* Recent Issues Tab */}
        <TabPanel value={activeTab} index={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Compliance Issues
            </Typography>
            
            {recentIssues.length === 0 ? (
              <Alert severity="success" icon={<CheckCircle />}>
                No recent compliance issues found. All aircraft are maintaining good compliance status.
              </Alert>
            ) : (
              <List>
                {recentIssues.map((issue, index) => (
                  <React.Fragment key={issue.id}>
                    <ListItem sx={{ alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ mt: 1 }}>
                        {issue.severity === 'CRITICAL' ? (
                          <Error color="error" />
                        ) : issue.severity === 'MAJOR' ? (
                          <Warning color="warning" />
                        ) : (
                          <Info color="info" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {issue.aircraft} • {issue.authority}
                            </Typography>
                            <Chip
                              label={issue.severity}
                              color={getSeverityColor(issue.severity)}
                              size="small"
                            />
                            <Chip
                              label={issue.status.replace('_', ' ')}
                              color={getStatusColor(issue.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" paragraph>
                              {issue.issue}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DateRange fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(issue.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentIssues.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  );
}

export default Reports;
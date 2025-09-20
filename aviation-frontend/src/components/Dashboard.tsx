import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Plane,
  FileText,
  Activity
} from 'lucide-react';
import { useHealthCheck, useAircraft, useComplianceRequirements } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const Dashboard = () => {
  const { 
    data: health, 
    isLoading: healthLoading, 
    isError: healthError,
    refetch: refetchHealth 
  } = useHealthCheck();
  
  const { 
    data: aircraft, 
    isLoading: aircraftLoading, 
    isError: aircraftError 
  } = useAircraft();
  
  const { 
    data: requirements, 
    isLoading: reqLoading, 
    isError: reqError 
  } = useComplianceRequirements();

  if (healthLoading || aircraftLoading || reqLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (healthError) {
    return (
      <div className="p-8">
        <ErrorDisplay 
          error="Unable to connect to Aviation Compliance API"
          onRetry={refetchHealth}
          title="Connection Error"
        />
      </div>
    );
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'COMPLIANT':
        return 'text-green-600 bg-green-100';
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-100';
      case 'NON_COMPLIANT':
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'COMPLIANT':
        return <CheckCircle className="h-5 w-5" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5" />;
      case 'NON_COMPLIANT':
      case 'unhealthy':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* System Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(health?.status || 'unknown')}`}>
            {getStatusIcon(health?.status || 'unknown')}
            <span className="font-medium capitalize">
              {health?.status || 'Unknown'}
            </span>
          </div>
        </div>
        
        {health && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Activity className="h-6 w-6 text-aviation-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatUptime(health.uptime_seconds)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Plane className="h-6 w-6 text-aviation-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Aircraft</p>
              <p className="text-lg font-semibold text-gray-900">
                {health.total_aircraft}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FileText className="h-6 w-6 text-aviation-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Requirements</p>
              <p className="text-lg font-semibold text-gray-900">
                {health.total_requirements}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-aviation-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Database</p>
              <p className="text-lg font-semibold text-gray-900">
                {health.database_connected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Aircraft Fleet</h3>
          {aircraftError ? (
            <p className="text-red-600">Failed to load aircraft</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">
                {aircraft?.length || 0} aircraft registered
              </p>
              <button className="btn-primary w-full">
                View Aircraft
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance Check</h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              Run compliance checks for your fleet
            </p>
            <button className="btn-primary w-full">
              Check Compliance
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
          {reqError ? (
            <p className="text-red-600">Failed to load requirements</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">
                {requirements?.length || 0} regulatory requirements
              </p>
              <button className="btn-secondary w-full">
                View Requirements
              </button>
            </div>
          )}
        </div>
      </div>

      {/* API Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">API Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Endpoint:</p>
            <p className="font-mono text-gray-900">http://172.173.225.32:8000</p>
          </div>
          <div>
            <p className="text-gray-600">Version:</p>
            <p className="text-gray-900">{health?.version || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-gray-600">Documentation:</p>
            <a 
              href="http://172.173.225.32:8000/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-aviation-600 hover:text-aviation-700 underline"
            >
              Swagger UI
            </a>
          </div>
          <div>
            <p className="text-gray-600">Status:</p>
            <p className="text-gray-900">
              {health?.timestamp && new Date(health.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
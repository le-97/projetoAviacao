import { Plane, Activity, AlertTriangle } from 'lucide-react';
import { useHealthCheck } from '../hooks/useApi';

const Header = () => {
  const { data: health, isLoading, isError } = useHealthCheck();

  const getStatusIndicator = () => {
    if (isLoading) {
      return <Activity className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
    if (isError || !health || health.status !== 'healthy') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Connecting...';
    if (isError || !health) return 'Offline';
    return health.status === 'healthy' ? 'Online' : 'Issues';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-aviation-600 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Aviation Compliance</h1>
              <p className="text-sm text-gray-500">Regulatory Management System</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50">
              {getStatusIndicator()}
              <span className="text-sm font-medium text-gray-700">
                {getStatusText()}
              </span>
            </div>
            {health && (
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-500">
                  {health.total_aircraft} Aircraft • {health.total_requirements} Requirements
                </p>
                <p className="text-xs text-gray-400">
                  v{health.version}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
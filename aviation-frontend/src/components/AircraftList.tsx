import { 
  Plane, 
  Calendar, 
  Clock, 
  Settings,
  Plus,
  Search
} from 'lucide-react';
import { useAircraft, useDeleteAircraft } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const AircraftList = () => {
  const { data: aircraft, isLoading, isError, error, refetch } = useAircraft();
  const deleteMutation = useDeleteAircraft();

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta aeronave?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao deletar aeronave:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner size="lg" text="Carregando aeronaves..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <ErrorDisplay 
          error={error instanceof Error ? error.message : 'Erro ao carregar aeronaves'}
          onRetry={refetch}
          title="Falha ao carregar frota"
        />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getAircraftStatus = (lastInspection: string, currentHours: number) => {
    const lastInspectionDate = new Date(lastInspection);
    const daysSinceInspection = Math.floor(
      (Date.now() - lastInspectionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceInspection > 365 || currentHours > 8000) {
      return { status: 'critical', text: 'Inspeção Vencida', color: 'bg-red-100 text-red-800' };
    } else if (daysSinceInspection > 300 || currentHours > 7000) {
      return { status: 'warning', text: 'Atenção', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'good', text: 'Em Dia', color: 'bg-green-100 text-green-800' };
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Frota de Aeronaves</h1>
          <p className="text-gray-600">
            {aircraft?.length || 0} aeronaves registradas
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Buscar</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Aeronave</span>
          </button>
        </div>
      </div>

      {/* Aircraft Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aircraft?.map((plane) => {
          const statusInfo = getAircraftStatus(plane.last_inspection, plane.current_hours);
          
          return (
            <div key={plane.id} className="card hover:shadow-lg transition-shadow">
              {/* Aircraft Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-aviation-100 rounded-lg">
                    <Plane className="h-6 w-6 text-aviation-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{plane.name}</h3>
                    <p className="text-sm text-gray-500">{plane.aircraft_type}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>

              {/* Aircraft Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Registro:</span>
                  <span className="font-medium text-gray-900">{plane.registration}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Horas de Voo:</span>
                  </span>
                  <span className="font-medium text-gray-900">
                    {plane.current_hours.toLocaleString()} h
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Última Inspeção:</span>
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatDate(plane.last_inspection)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button className="text-aviation-600 hover:text-aviation-700 text-sm font-medium">
                  Ver Compliance
                </button>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Settings className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(plane.id)}
                    className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {aircraft?.length === 0 && (
        <div className="text-center py-12">
          <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma aeronave registrada
          </h3>
          <p className="text-gray-600 mb-6">
            Comece adicionando sua primeira aeronave à frota.
          </p>
          <button className="btn-primary">
            Adicionar Primeira Aeronave
          </button>
        </div>
      )}
    </div>
  );
};

export default AircraftList;
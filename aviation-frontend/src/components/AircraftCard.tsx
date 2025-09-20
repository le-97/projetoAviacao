import { useState } from 'react';
import { 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  Settings, 
  Trash2, 
  Edit3,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useDeleteAircraft, useComplianceReport } from '../hooks/useApi';
import type { Aircraft } from '../types/api';
import LoadingSpinner from './LoadingSpinner';

interface AircraftCardProps {
  aircraft: Aircraft;
  onEdit?: (aircraft: Aircraft) => void;
}

const AircraftCard = ({ aircraft, onEdit }: AircraftCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const deleteMutation = useDeleteAircraft();
  const { data: complianceReport, isLoading: loadingCompliance } = useComplianceReport(aircraft.id);

  const handleDelete = () => {
    deleteMutation.mutate(aircraft.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'text-green-600 bg-green-100';
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-100';
      case 'NON_COMPLIANT':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'COMPLIANT':
        return <CheckCircle className="h-4 w-4" />;
      case 'WARNING':
      case 'NON_COMPLIANT':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-aviation-100 rounded-lg">
            <Plane className="h-6 w-6 text-aviation-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{aircraft.name}</h3>
            <p className="text-sm text-gray-500">{aircraft.aircraft_type}</p>
          </div>
        </div>
        
        {/* Status de Compliance */}
        {loadingCompliance ? (
          <LoadingSpinner size="sm" />
        ) : complianceReport && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complianceReport.overall_status)}`}>
            {getStatusIcon(complianceReport.overall_status)}
            <span className="capitalize">
              {complianceReport.overall_status === 'COMPLIANT' ? 'Conforme' :
               complianceReport.overall_status === 'WARNING' ? 'Atenção' :
               complianceReport.overall_status === 'NON_COMPLIANT' ? 'Não Conforme' : 'Desconhecido'}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{aircraft.registration}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{aircraft.current_hours.toLocaleString()} horas</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Última: {formatDate(aircraft.last_inspection)}</span>
        </div>
        
        {complianceReport?.next_inspection_due && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Settings className="h-4 w-4" />
            <span>Próxima: {formatDate(complianceReport.next_inspection_due)}</span>
          </div>
        )}
      </div>

      {/* Resumo de Compliance */}
      {complianceReport && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Status de Conformidade</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {complianceReport.requirements.filter(r => r.status === 'COMPLIANT').length}
              </div>
              <div className="text-gray-500">Conformes</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">
                {complianceReport.requirements.filter(r => r.status === 'WARNING').length}
              </div>
              <div className="text-gray-500">Atenção</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">
                {complianceReport.requirements.filter(r => r.status === 'NON_COMPLIANT').length}
              </div>
              <div className="text-gray-500">Não Conformes</div>
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex justify-end space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(aircraft)}
            className="p-2 text-gray-600 hover:text-aviation-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Editar aeronave"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
        
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Excluir aeronave"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Excluir Aeronave</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir a aeronave <strong>{aircraft.name}</strong> ({aircraft.registration})?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
                disabled={deleteMutation.isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && <LoadingSpinner size="sm" />}
                <span>{deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AircraftCard;
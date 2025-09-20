import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Save, Loader2 } from 'lucide-react';
import { apiClient } from '../config/api';
import type { CreateAircraftRequest, Aircraft } from '../types/api';

interface AddAircraftFormProps {
  onClose?: () => void;
  onSuccess?: (aircraft: Aircraft) => void;
  onCancel?: () => void;
  aircraft?: Aircraft | null;
}

const AddAircraftForm = ({ onClose, onSuccess, onCancel, aircraft }: AddAircraftFormProps) => {
  const [formData, setFormData] = useState<CreateAircraftRequest>({
    name: aircraft?.name || '',
    aircraft_type: aircraft?.aircraft_type || '',
    current_hours: aircraft?.current_hours || 0,
    last_inspection: aircraft?.last_inspection ? aircraft.last_inspection.split('T')[0] : '',
    registration: aircraft?.registration || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateAircraftRequest) => {
      if (aircraft) {
        // Editar aeronave existente
        const response = await apiClient.put(`/aircraft/${aircraft.id}`, data);
        return response.data;
      } else {
        // Criar nova aeronave
        const response = await apiClient.post('/aircraft', data);
        return response.data;
      }
    },
    onSuccess: (newAircraft: Aircraft) => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
      onSuccess?.(newAircraft);
      onClose?.();
    },
    onError: (error: any) => {
      console.error('Erro ao salvar aeronave:', error);
      if (error.response?.data?.detail) {
        setErrors({ general: error.response.data.detail });
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.aircraft_type.trim()) newErrors.aircraft_type = 'Tipo é obrigatório';
    if (!formData.registration.trim()) newErrors.registration = 'Registro é obrigatório';
    if (!formData.last_inspection) newErrors.last_inspection = 'Data da última inspeção é obrigatória';
    if (formData.current_hours < 0) newErrors.current_hours = 'Horas não podem ser negativas';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (field: keyof CreateAircraftRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const aircraftTypes = [
    'Boeing 737',
    'Airbus A320',
    'Boeing 777',
    'Airbus A330',
    'Embraer E190',
    'Cessna 172',
    'Piper PA-28',
    'Helicopter R44'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Adicionar Nova Aeronave
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Aeronave *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`input-field ${errors.name ? 'border-red-300' : ''}`}
              placeholder="Ex: TAM 3051"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Aeronave *
            </label>
            <select
              value={formData.aircraft_type}
              onChange={(e) => handleChange('aircraft_type', e.target.value)}
              className={`input-field ${errors.aircraft_type ? 'border-red-300' : ''}`}
            >
              <option value="">Selecione o tipo</option>
              {aircraftTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.aircraft_type && <p className="text-sm text-red-600 mt-1">{errors.aircraft_type}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registro *
            </label>
            <input
              type="text"
              value={formData.registration}
              onChange={(e) => handleChange('registration', e.target.value.toUpperCase())}
              className={`input-field ${errors.registration ? 'border-red-300' : ''}`}
              placeholder="Ex: PT-ABC"
            />
            {errors.registration && <p className="text-sm text-red-600 mt-1">{errors.registration}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas de Voo Atuais
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.current_hours}
              onChange={(e) => handleChange('current_hours', parseFloat(e.target.value) || 0)}
              className={`input-field ${errors.current_hours ? 'border-red-300' : ''}`}
              placeholder="0.0"
            />
            {errors.current_hours && <p className="text-sm text-red-600 mt-1">{errors.current_hours}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Última Inspeção *
            </label>
            <input
              type="date"
              value={formData.last_inspection}
              onChange={(e) => handleChange('last_inspection', e.target.value)}
              className={`input-field ${errors.last_inspection ? 'border-red-300' : ''}`}
            />
            {errors.last_inspection && <p className="text-sm text-red-600 mt-1">{errors.last_inspection}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel || onClose}
              className="btn-secondary"
              disabled={createMutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>
                {createMutation.isPending 
                  ? 'Salvando...' 
                  : aircraft 
                    ? 'Atualizar' 
                    : 'Adicionar'
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAircraftForm;
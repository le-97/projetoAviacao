import { useState } from 'react';
import { Plus, Search, Filter, Plane } from 'lucide-react';
import { useAircraft } from '../hooks/useApi';
import AircraftCard from './AircraftCard';
import AddAircraftForm from './AddAircraftForm';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import type { Aircraft } from '../types/api';

const AircraftList = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const { data: aircraftList, isLoading, error } = useAircraft();

  // Filtrar aeronaves baseado na busca e filtro
  const filteredAircraft = aircraftList?.filter(aircraft => {
    const matchesSearch = aircraft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aircraft.registration.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || aircraft.aircraft_type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  // Obter tipos únicos de aeronaves para o filtro
  const aircraftTypes = [...new Set(aircraftList?.map(a => a.aircraft_type) || [])];

  const handleEdit = (aircraft: Aircraft) => {
    setEditingAircraft(aircraft);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingAircraft(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Carregando aeronaves...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorDisplay 
          error="Erro ao carregar a lista de aeronaves"
          title="Falha ao carregar aeronaves"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Aeronaves</h1>
            <p className="text-gray-600 mt-1">
              {aircraftList?.length || 0} aeronave{(aircraftList?.length || 0) !== 1 ? 's' : ''} cadastrada{(aircraftList?.length || 0) !== 1 ? 's' : ''}
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Aeronave</span>
          </button>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por nome ou registro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-500 focus:border-aviation-500"
              />
            </div>

            {/* Filtro por Tipo */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-500 focus:border-aviation-500 appearance-none"
              >
                <option value="">Todos os tipos</option>
                {aircraftTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Aeronaves */}
        {filteredAircraft.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <Plane className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterType ? 'Nenhuma aeronave encontrada' : 'Nenhuma aeronave cadastrada'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType 
                ? 'Tente ajustar os filtros de busca para encontrar outras aeronaves.'
                : 'Comece adicionando sua primeira aeronave ao sistema.'
              }
            </p>
            {!searchTerm && !filterType && (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Adicionar Primeira Aeronave</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAircraft.map(aircraft => (
              <AircraftCard
                key={aircraft.id}
                aircraft={aircraft}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {/* Modal do Formulário */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingAircraft ? 'Editar Aeronave' : 'Nova Aeronave'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <AddAircraftForm
                  aircraft={editingAircraft}
                  onSuccess={handleCloseForm}
                  onCancel={handleCloseForm}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AircraftList;
import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Search,
  Filter,
  Download
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { apiClient } from '@/config/api';

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'requires-attention';
  lastCheck: string;
  nextCheck: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  documents: string[];
}

const ComplianceChecker = () => {
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchComplianceRequirements();
  }, []);

  const fetchComplianceRequirements = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/compliance/requirements');
      
      setRequirements(response.data.requirements || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: ComplianceRequirement['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'non-compliant':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'requires-attention':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ComplianceRequirement['status']) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'requires-attention':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: ComplianceRequirement['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusCounts = requirements.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = [...new Set(requirements.map(req => req.category))];

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchComplianceRequirements} />;

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verificação de Compliance</h1>
            <p className="text-gray-600">Monitore o cumprimento de requisitos regulamentares</p>
          </div>
          <button className="flex items-center space-x-2 bg-aviation-600 text-white px-4 py-2 rounded-lg hover:bg-aviation-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Exportar Relatório</span>
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700 font-medium">Conformes</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {statusCounts.compliant || 0}
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 font-medium">Não Conformes</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-1">
              {statusCounts['non-compliant'] || 0}
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="text-yellow-700 font-medium">Pendentes</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900 mt-1">
              {statusCounts.pending || 0}
            </p>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-orange-700 font-medium">Requer Atenção</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 mt-1">
              {statusCounts['requires-attention'] || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="h-4 w-4 inline mr-1" />
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar requisitos..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-aviation-500 focus:border-aviation-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="h-4 w-4 inline mr-1" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-aviation-500 focus:border-aviation-500"
            >
              <option value="all">Todos</option>
              <option value="compliant">Conforme</option>
              <option value="non-compliant">Não Conforme</option>
              <option value="pending">Pendente</option>
              <option value="requires-attention">Requer Atenção</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-aviation-500 focus:border-aviation-500"
            >
              <option value="all">Todas</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de requisitos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Requisitos de Compliance ({filteredRequirements.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredRequirements.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum requisito encontrado com os filtros aplicados</p>
            </div>
          ) : (
            filteredRequirements.map((requirement) => (
              <div key={requirement.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(requirement.status)}
                      <h3 className="text-lg font-medium text-gray-900">
                        {requirement.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(requirement.severity)}`}>
                        {requirement.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{requirement.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>Categoria: {requirement.category}</span>
                      <span>Fonte: {requirement.source}</span>
                      <span>Última verificação: {new Date(requirement.lastCheck).toLocaleDateString('pt-BR')}</span>
                      <span>Próxima verificação: {new Date(requirement.nextCheck).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {requirement.documents.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-500">Documentos: </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {requirement.documents.map((doc, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              <FileText className="h-3 w-3 mr-1" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(requirement.status)}`}>
                      {requirement.status === 'compliant' && 'Conforme'}
                      {requirement.status === 'non-compliant' && 'Não Conforme'}
                      {requirement.status === 'pending' && 'Pendente'}
                      {requirement.status === 'requires-attention' && 'Requer Atenção'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceChecker;
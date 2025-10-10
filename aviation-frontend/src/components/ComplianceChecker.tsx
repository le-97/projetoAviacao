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
      <div className="card-aviation p-6" style={{ 
        background: 'white',
        boxShadow: 'var(--shadow-aviation-md)'
      }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ 
              fontFamily: 'var(--font-aviation-sans)',
              color: 'var(--aviation-neutral-900)'
            }}>Verificação de Compliance</h1>
            <p style={{ 
              fontFamily: 'var(--font-aviation-sans)',
              color: 'var(--aviation-neutral-600)'
            }}>Monitore o cumprimento de requisitos regulamentares</p>
          </div>
          <button className="btn-aviation-primary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar Relatório</span>
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="metric-card-aviation p-4" style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: 'var(--radius-aviation-lg)'
          }}>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" style={{ color: '#d1fae5' }} />
              <span className="font-medium" style={{ 
                color: '#ecfdf5',
                fontFamily: 'var(--font-aviation-sans)'
              }}>Conformes</span>
            </div>
            <p className="text-2xl font-bold mt-1" style={{ 
              color: 'white',
              fontFamily: 'var(--font-aviation-sans)'
            }}>
              {statusCounts.compliant || 0}
            </p>
          </div>
          
          <div className="metric-card-aviation p-4" style={{ 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: 'var(--radius-aviation-lg)'
          }}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" style={{ color: '#fecaca' }} />
              <span className="font-medium" style={{ 
                color: '#fee2e2',
                fontFamily: 'var(--font-aviation-sans)'
              }}>Não Conformes</span>
            </div>
            <p className="text-2xl font-bold mt-1" style={{ 
              color: 'white',
              fontFamily: 'var(--font-aviation-sans)'
            }}>
              {statusCounts['non-compliant'] || 0}
            </p>
          </div>
          
          <div className="metric-card-aviation p-4" style={{ 
            background: 'var(--gradient-aviation-accent)',
            borderRadius: 'var(--radius-aviation-lg)'
          }}>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" style={{ color: 'var(--aviation-accent-100)' }} />
              <span className="font-medium" style={{ 
                color: 'var(--aviation-accent-50)',
                fontFamily: 'var(--font-aviation-sans)'
              }}>Pendentes</span>
            </div>
            <p className="text-2xl font-bold mt-1" style={{ 
              color: 'white',
              fontFamily: 'var(--font-aviation-sans)'
            }}>
              {statusCounts.pending || 0}
            </p>
          </div>
          
          <div className="metric-card-aviation p-4" style={{ 
            background: 'var(--gradient-aviation-primary)',
            borderRadius: 'var(--radius-aviation-lg)'
          }}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" style={{ color: 'var(--aviation-primary-100)' }} />
              <span className="font-medium" style={{ 
                color: 'var(--aviation-primary-50)',
                fontFamily: 'var(--font-aviation-sans)'
              }}>Requer Atenção</span>
            </div>
            <p className="text-2xl font-bold mt-1" style={{ 
              color: 'white',
              fontFamily: 'var(--font-aviation-sans)'
            }}>
              {statusCounts['requires-attention'] || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-aviation p-6" style={{ 
        background: 'white',
        boxShadow: 'var(--shadow-aviation-md)'
      }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ 
              fontFamily: 'var(--font-aviation-sans)',
              color: 'var(--aviation-neutral-700)'
            }}>
              <Search className="h-4 w-4 inline mr-1" />
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar requisitos..."
              className="w-full rounded-lg px-3 py-2"
              style={{ 
                border: '1px solid var(--aviation-neutral-300)',
                fontFamily: 'var(--font-aviation-sans)',
                outline: 'none'
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ 
              fontFamily: 'var(--font-aviation-sans)',
              color: 'var(--aviation-neutral-700)'
            }}>
              <Filter className="h-4 w-4 inline mr-1" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg px-3 py-2"
              style={{ 
                border: '1px solid var(--aviation-neutral-300)',
                fontFamily: 'var(--font-aviation-sans)',
                outline: 'none'
              }}
            >
              <option value="all">Todos</option>
              <option value="compliant">Conforme</option>
              <option value="non-compliant">Não Conforme</option>
              <option value="pending">Pendente</option>
              <option value="requires-attention">Requer Atenção</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ 
              fontFamily: 'var(--font-aviation-sans)',
              color: 'var(--aviation-neutral-700)'
            }}>
              Categoria
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg px-3 py-2"
              style={{ 
                border: '1px solid var(--aviation-neutral-300)',
                fontFamily: 'var(--font-aviation-sans)',
                outline: 'none'
              }}
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
      <div className="card-aviation overflow-hidden" style={{ 
        background: 'white',
        boxShadow: 'var(--shadow-aviation-md)'
      }}>
        <div className="px-6 py-4" style={{ 
          borderBottom: '1px solid var(--aviation-neutral-200)'
        }}>
          <h2 className="text-lg font-semibold" style={{ 
            fontFamily: 'var(--font-aviation-sans)',
            color: 'var(--aviation-neutral-900)'
          }}>
            Requisitos de Compliance ({filteredRequirements.length})
          </h2>
        </div>
        
        <div style={{ 
          borderTop: '1px solid var(--aviation-neutral-200)'
        }}>
          {filteredRequirements.length === 0 ? (
            <div className="p-8 text-center" style={{ 
              color: 'var(--aviation-neutral-500)'
            }}>
              <FileText className="h-12 w-12 mx-auto mb-4" style={{ 
                color: 'var(--aviation-neutral-300)'
              }} />
              <p style={{ fontFamily: 'var(--font-aviation-sans)' }}>
                Nenhum requisito encontrado com os filtros aplicados
              </p>
            </div>
          ) : (
            filteredRequirements.map((requirement) => (
              <div 
                key={requirement.id} 
                className="p-6" 
                style={{ 
                  borderBottom: '1px solid var(--aviation-neutral-200)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--aviation-neutral-50)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(requirement.status)}
                      <h3 className="text-lg font-medium" style={{ 
                        fontFamily: 'var(--font-aviation-sans)',
                        color: 'var(--aviation-neutral-900)'
                      }}>
                        {requirement.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(requirement.severity)}`}>
                        {requirement.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <p style={{ 
                      fontFamily: 'var(--font-aviation-sans)',
                      color: 'var(--aviation-neutral-600)',
                      marginBottom: '0.75rem'
                    }}>{requirement.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm" style={{ 
                      fontFamily: 'var(--font-aviation-mono)',
                      color: 'var(--aviation-neutral-500)'
                    }}>
                      <span>Categoria: {requirement.category}</span>
                      <span>Fonte: {requirement.source}</span>
                      <span>Última verificação: {new Date(requirement.lastCheck).toLocaleDateString('pt-BR')}</span>
                      <span>Próxima verificação: {new Date(requirement.nextCheck).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {requirement.documents.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm" style={{ 
                          fontFamily: 'var(--font-aviation-sans)',
                          color: 'var(--aviation-neutral-500)'
                        }}>Documentos: </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {requirement.documents.map((doc, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2 py-1 text-xs rounded"
                              style={{ 
                                background: 'var(--aviation-neutral-100)',
                                color: 'var(--aviation-neutral-700)',
                                fontFamily: 'var(--font-aviation-mono)'
                              }}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(requirement.status)}`} style={{ 
                      fontFamily: 'var(--font-aviation-sans)'
                    }}>
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
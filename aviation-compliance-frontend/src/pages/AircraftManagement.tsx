import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plane, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Eye,
  FileText
} from 'lucide-react'

export default function AircraftManagement() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const aircraftList = [
    {
      id: 1,
      registration: 'PR-ABC123',
      model: 'Embraer E190',
      manufacturer: 'Embraer',
      serialNumber: '19000789',
      yearOfManufacture: 2018,
      status: 'operational',
      lastInspection: '2024-01-15',
      nextInspection: '2024-04-15',
      flightHours: 12450,
      complianceScore: 95,
      alerts: 0
    },
    {
      id: 2,
      registration: 'PR-XYZ456',
      model: 'Boeing 737-800',
      manufacturer: 'Boeing',
      serialNumber: '37842',
      yearOfManufacture: 2015,
      status: 'maintenance',
      lastInspection: '2024-01-10',
      nextInspection: '2024-03-20',
      flightHours: 25680,
      complianceScore: 88,
      alerts: 2
    },
    {
      id: 3,
      registration: 'PR-DEF789',
      model: 'Airbus A320',
      manufacturer: 'Airbus',
      serialNumber: 'A320-9876',
      yearOfManufacture: 2020,
      status: 'operational',
      lastInspection: '2024-02-01',
      nextInspection: '2024-05-01',
      flightHours: 8920,
      complianceScore: 97,
      alerts: 0
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'maintenance':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'grounded':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'grounded':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Aeronaves</h1>
          <p className="text-gray-600 mt-1">Gerencie sua frota e monitore o status de conformidade</p>
        </div>
        <Button variant="aviation">
          <Plus className="w-4 h-4 mr-2" />
          Nova Aeronave
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por matrícula, modelo ou número de série..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="operational">Operacional</option>
                <option value="maintenance">Manutenção</option>
                <option value="grounded">Não operacional</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aircraft List */}
      <div className="grid gap-4">
        {aircraftList.map((aircraft) => (
          <Card key={aircraft.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                {/* Aircraft Info */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {aircraft.registration}
                      </h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(aircraft.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(aircraft.status)}`}>
                          {aircraft.status === 'operational' ? 'Operacional' : 
                           aircraft.status === 'maintenance' ? 'Manutenção' : 'Não operacional'}
                        </span>
                      </div>
                      {aircraft.alerts > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          {aircraft.alerts} alertas
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Modelo</p>
                        <p className="font-medium">{aircraft.model}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fabricante</p>
                        <p className="font-medium">{aircraft.manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Ano</p>
                        <p className="font-medium">{aircraft.yearOfManufacture}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Horas de voo</p>
                        <p className="font-medium">{aircraft.flightHours.toLocaleString()}h</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Última inspeção</p>
                        <p className="font-medium">{new Date(aircraft.lastInspection).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Próxima inspeção</p>
                        <p className="font-medium">{new Date(aircraft.nextInspection).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Score de conformidade</p>
                        <p className={`font-bold ${getComplianceColor(aircraft.complianceScore)}`}>
                          {aircraft.complianceScore}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-600">Total de Aeronaves</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-gray-600">Operacionais</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="text-sm text-gray-600">Em Manutenção</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">93%</div>
            <div className="text-sm text-gray-600">Score Médio</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
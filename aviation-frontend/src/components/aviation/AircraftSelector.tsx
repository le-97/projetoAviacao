import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Plane, 
  Settings, 
  CheckCircle, 
  XCircle,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type AircraftStatus = 'operational' | 'maintenance' | 'grounded' | 'in-flight';
export type AircraftType = 'commercial' | 'cargo' | 'private' | 'military';

export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  manufacturer: string;
  type: AircraftType;
  status: AircraftStatus;
  location: string;
  lastMaintenance: string;
  flightHours: number;
  capacity: number;
  fuelLevel?: number; // percentage
  nextMaintenance?: string;
}

interface AircraftSelectorProps {
  aircraft: Aircraft[];
  selectedAircraft?: Aircraft | null;
  onSelect: (aircraft: Aircraft) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showFilters?: boolean;
  className?: string;
}

const statusConfig: Record<AircraftStatus, { 
  color: string; 
  bgColor: string; 
  icon: React.ElementType;
  label: string;
}> = {
  'operational': {
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    icon: CheckCircle,
    label: 'Operacional'
  },
  'maintenance': {
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    icon: Settings,
    label: 'Manutenção'
  },
  'grounded': {
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    icon: XCircle,
    label: 'Em Solo'
  },
  'in-flight': {
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    icon: Plane,
    label: 'Em Voo'
  }
};

const typeLabels: Record<AircraftType, string> = {
  'commercial': 'Comercial',
  'cargo': 'Carga',
  'private': 'Privado',
  'military': 'Militar'
};

export function AircraftSelector({ 
  aircraft, 
  selectedAircraft, 
  onSelect, 
  variant = 'default',
  showFilters = true,
  className 
}: AircraftSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AircraftStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AircraftType | 'all'>('all');

  const filteredAircraft = useMemo(() => {
    return aircraft.filter((item) => {
      const matchesSearch = 
        item.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [aircraft, searchTerm, statusFilter, typeFilter]);

  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className={cn('space-y-4', isCompact && 'pb-3')}>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Seletor de Aeronaves
          <Badge variant="outline" className="ml-auto">
            {filteredAircraft.length} de {aircraft.length}
          </Badge>
        </CardTitle>

        {showFilters && (
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por registro, modelo, fabricante ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AircraftStatus | 'all')}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="operational">Operacional</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="grounded">Em Solo</SelectItem>
                  <SelectItem value="in-flight">Em Voo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as AircraftType | 'all')}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Tipos</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="cargo">Carga</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                  <SelectItem value="military">Militar</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {filteredAircraft.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma aeronave encontrada</p>
            <p className="text-sm">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          filteredAircraft.map((item) => {
            const config = statusConfig[item.status];
            const StatusIcon = config.icon;
            const isSelected = selectedAircraft?.id === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-all duration-200',
                  'hover:shadow-md hover:bg-slate-50',
                  isSelected && 'border-blue-500 bg-blue-50 shadow-md',
                  config.bgColor
                )}
                onClick={() => onSelect(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-lg">
                        {item.registration}
                      </span>
                      <Badge className={cn(config.color, 'text-white')}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{item.manufacturer} {item.model}</span>
                      <span className="mx-2">•</span>
                      <span>{typeLabels[item.type]}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📍 {item.location}</span>
                      <span>✈️ {item.flightHours.toLocaleString()}h</span>
                      <span>👥 {item.capacity} pax</span>
                    </div>

                    {isDetailed && (
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <div>Última Manutenção: {new Date(item.lastMaintenance).toLocaleDateString('pt-BR')}</div>
                        {item.nextMaintenance && (
                          <div>Próxima Manutenção: {new Date(item.nextMaintenance).toLocaleDateString('pt-BR')}</div>
                        )}
                        {item.fuelLevel !== undefined && (
                          <div className="flex items-center gap-2">
                            <span>Combustível:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={cn(
                                  'h-2 rounded-full transition-all',
                                  item.fuelLevel > 50 ? 'bg-green-500' :
                                  item.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'
                                )}
                                style={{ width: `${item.fuelLevel}%` }}
                              />
                            </div>
                            <span>{item.fuelLevel}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
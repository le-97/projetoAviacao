import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AircraftCard } from '@/components/shared/AircraftCard';
import { embraerAircraft } from '@/lib/mockData';
import type { AircraftCategory } from '@/types';

export function AircraftCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AircraftCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAircraft = embraerAircraft.filter((aircraft) => {
    const matchesSearch =
      aircraft.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || aircraft.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || aircraft.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="heading-1 text-embraer-dark">Catálogo de Aeronaves</h1>
        <p className="body-normal text-muted-foreground mt-2">
          Explore todos os modelos Embraer certificados
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por modelo ou fabricante..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={(value: string) => setCategoryFilter(value as AircraftCategory | 'all')}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="commercial">Comercial</SelectItem>
            <SelectItem value="executive">Executivo</SelectItem>
            <SelectItem value="defense">Defesa</SelectItem>
            <SelectItem value="agriculture">Agrícola</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="development">Em Desenvolvimento</SelectItem>
            <SelectItem value="legacy">Legado</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="lg:w-auto">
          <Filter className="w-4 h-4 mr-2" />
          Filtros Avançados
        </Button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="body-normal text-muted-foreground">
          {filteredAircraft.length} {filteredAircraft.length === 1 ? 'aeronave encontrada' : 'aeronaves encontradas'}
        </p>
      </div>

      {/* Aircraft Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAircraft.map((aircraft) => (
          <AircraftCard
            key={aircraft.id}
            aircraft={aircraft}
            onClick={() => navigate(`/aeronaves/${aircraft.id}`)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAircraft.length === 0 && (
        <div className="text-center py-12">
          <p className="heading-3 text-muted-foreground">Nenhuma aeronave encontrada</p>
          <p className="body-normal text-muted-foreground mt-2">
            Tente ajustar os filtros de busca
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStatusFilter('all');
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}
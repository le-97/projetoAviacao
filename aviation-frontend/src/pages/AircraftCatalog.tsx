import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAircraft } from '../hooks/useAircraft';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  Gauge,
  Navigation,
  Settings,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Grid3x3,
  List,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Aircraft, AircraftCategory } from '../types/aircraft';

export default function AircraftCatalog() {
  const navigate = useNavigate();
  const { data: aircraft, isLoading } = useAircraft();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<AircraftCategory[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: { value: AircraftCategory; label: string; count: number }[] = [
    { value: 'commercial', label: 'Comercial', count: 7 },
    { value: 'executive', label: 'Executiva', count: 4 },
    { value: 'defense', label: 'Defesa', count: 3 },
    { value: 'agriculture', label: 'Agrícola', count: 1 },
  ];

  const toggleCategory = (category: AircraftCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const filteredAircraft = aircraft?.filter((a) => {
    const matchesSearch = a.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(a.category);
    return matchesSearch && matchesCategory;
  });

  const sortedAircraft = filteredAircraft?.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.model.localeCompare(b.model);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-embraer-blue-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Carregando aeronaves...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Catálogo de Aeronaves Embraer</h1>
        <p className="text-neutral-600 mt-1">
          Explore os 15 modelos da família Embraer com especificações completas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <h3 className="text-lg font-semibold">Filtros</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    type="text"
                    placeholder="Nome do modelo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Categoria</Label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={cat.value}
                        checked={selectedCategories.includes(cat.value)}
                        onCheckedChange={() => toggleCategory(cat.value)}
                      />
                      <label
                        htmlFor={cat.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {cat.label} ({cat.count})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSearchQuery('');
                  }}
                >
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Aircraft Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900">
                {sortedAircraft?.length || 0} Aeronaves Embraer
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Modelos completos com especificações técnicas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="category">Categoria</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('rounded-r-none', viewMode === 'grid' && 'bg-neutral-100')}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('rounded-l-none border-l', viewMode === 'list' && 'bg-neutral-100')}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedAircraft?.map((aircraft) => (
              <AircraftCard
                key={aircraft.id}
                aircraft={aircraft}
                onClick={() => navigate(`/aeronaves/${aircraft.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AircraftCardProps {
  aircraft: Aircraft;
  onClick: () => void;
}

function AircraftCard({ aircraft, onClick }: AircraftCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Image with Overlay */}
      <div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-neutral-100 to-neutral-200">
        <div className="w-full h-full flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-neutral-300" />
        </div>
        {/* Badge de Categoria */}
        <div className="absolute top-4 left-4">
          <Badge style={{ backgroundColor: aircraft.categoryColor }} className="text-white font-semibold">
            {aircraft.categoryLabel}
          </Badge>
        </div>
        {/* Badge de Destaque */}
        {aircraft.badge && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              {aircraft.badge}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        {/* Título */}
        <h3 className="text-xl font-bold text-neutral-900 mb-3">{aircraft.model}</h3>
        {/* Especificações em Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{aircraft.specs.capacity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{aircraft.specs.speed}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700">{aircraft.specs.range}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4 text-neutral-500" />
            <span className="text-neutral-700 truncate">{aircraft.specs.engines}</span>
          </div>
        </div>
        {/* Destaques */}
        {aircraft.highlights && (
          <div className="border-t pt-4 space-y-2">
            {aircraft.highlights.slice(0, 2).map((highlight, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-neutral-600">{highlight}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full group-hover:bg-embraer-blue-dark transition-colors">
          Ver Detalhes
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
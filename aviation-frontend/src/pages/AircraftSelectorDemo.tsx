import { useState } from 'react';
import { AircraftSelector, type Aircraft } from '@/components/aviation';

// Mock data for testing
const mockAircraft: Aircraft[] = [
  {
    id: 'a1',
    registration: 'PR-GTD',
    model: 'Boeing 737-800',
    manufacturer: 'Boeing',
    type: 'commercial',
    status: 'operational',
    location: 'GRU - São Paulo',
    lastMaintenance: '2025-08-15',
    nextMaintenance: '2025-12-15',
    flightHours: 12450,
    capacity: 176,
    fuelLevel: 85
  },
  {
    id: 'a2',
    registration: 'PR-GUB',
    model: 'Airbus A320',
    manufacturer: 'Airbus',
    type: 'commercial',
    status: 'in-flight',
    location: 'Em rota SDU-BSB',
    lastMaintenance: '2025-09-01',
    nextMaintenance: '2025-11-01',
    flightHours: 8932,
    capacity: 164,
    fuelLevel: 45
  },
  {
    id: 'a3',
    registration: 'PT-MSB',
    model: 'Embraer E195',
    manufacturer: 'Embraer',
    type: 'commercial',
    status: 'maintenance',
    location: 'Hangar 3 - CGH',
    lastMaintenance: '2025-09-18',
    nextMaintenance: '2025-10-18',
    flightHours: 15623,
    capacity: 118,
    fuelLevel: 20
  },
  {
    id: 'a4',
    registration: 'PR-XYZ',
    model: 'Boeing 777-300ER',
    manufacturer: 'Boeing',
    type: 'commercial',
    status: 'operational',
    location: 'GIG - Rio de Janeiro',
    lastMaintenance: '2025-07-10',
    nextMaintenance: '2025-12-10',
    flightHours: 23451,
    capacity: 396,
    fuelLevel: 92
  },
  {
    id: 'a5',
    registration: 'PR-CRG',
    model: 'Boeing 767-300F',
    manufacturer: 'Boeing',
    type: 'cargo',
    status: 'grounded',
    location: 'VCP - Campinas',
    lastMaintenance: '2025-09-10',
    nextMaintenance: '2025-10-10',
    flightHours: 18765,
    capacity: 0,
    fuelLevel: 15
  },
  {
    id: 'a6',
    registration: 'PP-JET',
    model: 'Cessna Citation X',
    manufacturer: 'Cessna',
    type: 'private',
    status: 'operational',
    location: 'SBSP - Campo de Marte',
    lastMaintenance: '2025-08-20',
    nextMaintenance: '2025-11-20',
    flightHours: 3421,
    capacity: 8,
    fuelLevel: 78
  },
  {
    id: 'a7',
    registration: 'FAB-2855',
    model: 'Super Tucano A-29',
    manufacturer: 'Embraer',
    type: 'military',
    status: 'operational',
    location: 'SBSP - Base Aérea',
    lastMaintenance: '2025-09-05',
    nextMaintenance: '2025-10-05',
    flightHours: 1250,
    capacity: 2,
    fuelLevel: 100
  },
  {
    id: 'a8',
    registration: 'PR-LOG',
    model: 'ATR 72-600F',
    manufacturer: 'ATR',
    type: 'cargo',
    status: 'in-flight',
    location: 'Em rota BSB-REC',
    lastMaintenance: '2025-08-25',
    nextMaintenance: '2025-11-25',
    flightHours: 9876,
    capacity: 0,
    fuelLevel: 55
  }
];

export function AircraftSelectorDemo() {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Aircraft Selector Components</h1>
        <p className="text-muted-foreground mb-6">
          Demonstração dos componentes de seleção de aeronaves personalizados para aviação
        </p>
      </div>

      {/* Selected Aircraft Info */}
      {selectedAircraft && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <h3 className="font-semibold text-blue-900">Aeronave Selecionada:</h3>
          <p className="text-blue-800">
            {selectedAircraft.registration} - {selectedAircraft.manufacturer} {selectedAircraft.model}
          </p>
          <p className="text-blue-700 text-sm">
            Status: {selectedAircraft.status} | Localização: {selectedAircraft.location}
          </p>
        </div>
      )}

      {/* Default Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variant: Default</h2>
        <AircraftSelector
          aircraft={mockAircraft}
          selectedAircraft={selectedAircraft}
          onSelect={setSelectedAircraft}
          variant="default"
          showFilters={true}
        />
      </section>

      {/* Compact Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variant: Compact (No Filters)</h2>
        <AircraftSelector
          aircraft={mockAircraft.slice(0, 4)}
          selectedAircraft={selectedAircraft}
          onSelect={setSelectedAircraft}
          variant="compact"
          showFilters={false}
        />
      </section>

      {/* Detailed Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variant: Detailed</h2>
        <AircraftSelector
          aircraft={mockAircraft.slice(0, 3)}
          selectedAircraft={selectedAircraft}
          onSelect={setSelectedAircraft}
          variant="detailed"
          showFilters={true}
        />
      </section>

      {/* Usage Statistics */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-gray-900">Total de Aeronaves</h3>
            <p className="text-2xl font-bold text-blue-600">{mockAircraft.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-gray-900">Operacionais</h3>
            <p className="text-2xl font-bold text-green-600">
              {mockAircraft.filter(a => a.status === 'operational').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-gray-900">Em Voo</h3>
            <p className="text-2xl font-bold text-blue-600">
              {mockAircraft.filter(a => a.status === 'in-flight').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold text-gray-900">Manutenção</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {mockAircraft.filter(a => a.status === 'maintenance').length}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
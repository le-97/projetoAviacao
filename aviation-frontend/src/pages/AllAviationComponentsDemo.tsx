import { useState } from 'react';
import { 
  FlightStatusCard, 
  AircraftSelector, 
  AlertPanel, 
  WeatherWidget, 
  StatusIndicator,
  type FlightData,
  type Aircraft,
  type Alert,
  type WeatherData
} from '@/components/aviation';

// Mock data
const mockFlights: FlightData[] = [
  {
    flightNumber: 'TAM 3054',
    aircraft: 'Boeing 737-800',
    departureAirport: 'CGH',
    arrivalAirport: 'SDU',
    scheduledDeparture: '2025-09-20T14:30:00',
    scheduledArrival: '2025-09-20T15:45:00',
    gate: 'A12',
    status: 'on-time'
  },
  {
    flightNumber: 'GOL 1829',
    aircraft: 'Boeing 737-700',
    departureAirport: 'GRU',
    arrivalAirport: 'BSB',
    scheduledDeparture: '2025-09-20T16:15:00',
    scheduledArrival: '2025-09-20T18:30:00',
    actualDeparture: '2025-09-20T16:45:00',
    gate: 'B08',
    status: 'delayed',
    delay: 30
  }
];

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
    flightHours: 8932,
    capacity: 164,
    fuelLevel: 45
  }
];

const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'critical',
    status: 'active',
    title: 'Falha no Sistema de Navegação',
    description: 'Perda de comunicação com o sistema de navegação primário.',
    location: 'Aeronave PR-GTD',
    timestamp: '2025-09-20T16:30:00',
    category: 'Sistema Crítico',
    priority: 1
  },
  {
    id: 'alert-002',
    type: 'warning',
    status: 'active',
    title: 'Nível de Combustível Baixo',
    description: 'Aeronave com nível de combustível abaixo de 20%.',
    location: 'VCP - Hangar 2',
    timestamp: '2025-09-20T15:45:00',
    category: 'Operacional',
    priority: 2
  }
];

const mockWeather: WeatherData[] = [
  {
    location: 'São Paulo/Guarulhos',
    airportCode: 'GRU',
    timestamp: '2025-09-20T16:00:00',
    condition: 'partly-cloudy',
    temperature: 23,
    humidity: 65,
    pressure: 1013,
    windSpeed: 12,
    windDirection: 180,
    visibility: 8,
    dewPoint: 16,
    cloudCeiling: 2500,
    precipitationChance: 20
  },
  {
    location: 'Rio de Janeiro/Santos Dumont',
    airportCode: 'SDU',
    timestamp: '2025-09-20T16:00:00',
    condition: 'rain',
    temperature: 21,
    humidity: 85,
    pressure: 1008,
    windSpeed: 28,
    windDirection: 120,
    visibility: 3,
    dewPoint: 18,
    cloudCeiling: 800,
    precipitationChance: 90
  }
];

export function AllAviationComponentsDemo() {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  const handleAcknowledge = (alertId: string) => {
    console.log('Acknowledged alert:', alertId);
  };

  const handleResolve = (alertId: string) => {
    console.log('Resolved alert:', alertId);
  };

  const handleDismiss = (alertId: string) => {
    console.log('Dismissed alert:', alertId);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Aviation Components Suite</h1>
        <p className="text-muted-foreground mb-6">
          Demonstração completa de todos os componentes personalizados para aviação
        </p>
      </div>

      {/* Status Indicators Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Status Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium mb-3">Different Variants</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <StatusIndicator status="operational" variant="dot" />
                <span className="text-sm">Dot Variant</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusIndicator status="maintenance" variant="icon" />
                <span className="text-sm">Icon Variant</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusIndicator status="in-flight" variant="badge" animate />
                <span className="text-sm">Badge Variant</span>
              </div>
              <StatusIndicator status="emergency" variant="full" animate />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium mb-3">Different Sizes</h3>
            <div className="space-y-3">
              <StatusIndicator status="operational" size="sm" />
              <StatusIndicator status="operational" size="md" />
              <StatusIndicator status="operational" size="lg" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium mb-3">Aircraft Status</h3>
            <div className="space-y-2">
              <StatusIndicator status="operational" variant="badge" />
              <StatusIndicator status="maintenance" variant="badge" />
              <StatusIndicator status="grounded" variant="badge" />
              <StatusIndicator status="in-flight" variant="badge" animate />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium mb-3">System Status</h3>
            <div className="space-y-2">
              <StatusIndicator status="active" variant="badge" animate />
              <StatusIndicator status="pending" variant="badge" />
              <StatusIndicator status="inactive" variant="badge" />
              <StatusIndicator status="offline" variant="badge" />
            </div>
          </div>
        </div>
      </section>

      {/* Weather Widgets Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Weather Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockWeather.map((weather, index) => (
            <WeatherWidget 
              key={index}
              weather={weather}
              variant="detailed"
              showAlerts={true}
            />
          ))}
        </div>
      </section>

      {/* Flight Status Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Flight Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockFlights.map((flight, index) => (
            <FlightStatusCard 
              key={index} 
              flight={flight} 
              variant="detailed"
            />
          ))}
        </div>
      </section>

      {/* Combined Dashboard Layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Integrated Dashboard Layout</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Aircraft Selector */}
          <div className="lg:col-span-1">
            <AircraftSelector
              aircraft={mockAircraft}
              selectedAircraft={selectedAircraft}
              onSelect={setSelectedAircraft}
              variant="compact"
              showFilters={false}
            />
          </div>

          {/* Right Column - Alerts and Status */}
          <div className="lg:col-span-2 space-y-6">
            <AlertPanel
              alerts={mockAlerts}
              onAcknowledge={handleAcknowledge}
              onResolve={handleResolve}
              onDismiss={handleDismiss}
              variant="compact"
              maxHeight="250px"
            />

            {/* System Status Overview */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">System Status Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <StatusIndicator status="operational" variant="full" />
                  <p className="text-sm text-muted-foreground mt-2">Sistema Principal</p>
                </div>
                <div className="text-center">
                  <StatusIndicator status="maintenance" variant="full" />
                  <p className="text-sm text-muted-foreground mt-2">Radar Secundário</p>
                </div>
                <div className="text-center">
                  <StatusIndicator status="emergency" variant="full" animate />
                  <p className="text-sm text-muted-foreground mt-2">Alerta Crítico</p>
                </div>
                <div className="text-center">
                  <StatusIndicator status="in-flight" variant="full" animate />
                  <p className="text-sm text-muted-foreground mt-2">Aeronaves Ativas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Statistics */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Component Usage Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
            <h3 className="font-semibold text-gray-900">FlightStatusCard</h3>
            <p className="text-2xl font-bold text-blue-600">{mockFlights.length}</p>
            <p className="text-sm text-muted-foreground">Voos Ativos</p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
            <h3 className="font-semibold text-gray-900">AircraftSelector</h3>
            <p className="text-2xl font-bold text-green-600">{mockAircraft.length}</p>
            <p className="text-sm text-muted-foreground">Aeronaves</p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
            <h3 className="font-semibold text-gray-900">AlertPanel</h3>
            <p className="text-2xl font-bold text-red-600">{mockAlerts.length}</p>
            <p className="text-sm text-muted-foreground">Alertas Ativos</p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
            <h3 className="font-semibold text-gray-900">WeatherWidget</h3>
            <p className="text-2xl font-bold text-yellow-600">{mockWeather.length}</p>
            <p className="text-sm text-muted-foreground">Estações Meteorológicas</p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
            <h3 className="font-semibold text-gray-900">StatusIndicator</h3>
            <p className="text-2xl font-bold text-purple-600">12+</p>
            <p className="text-sm text-muted-foreground">Indicadores de Status</p>
          </div>
        </div>
      </section>
    </div>
  );
}
import { FlightStatusCard, type FlightData } from '@/components/aviation';

// Mock data for testing
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
  },
  {
    flightNumber: 'AZU 4521',
    aircraft: 'Embraer E195',
    departureAirport: 'SDU',
    arrivalAirport: 'REC',
    scheduledDeparture: '2025-09-20T19:20:00',
    scheduledArrival: '2025-09-20T22:10:00',
    gate: 'C05',
    status: 'boarding'
  },
  {
    flightNumber: 'TAM 8047',
    aircraft: 'Airbus A330-200',
    departureAirport: 'GRU',
    arrivalAirport: 'MAD',
    scheduledDeparture: '2025-09-20T23:45:00',
    scheduledArrival: '2025-09-21T14:30:00',
    status: 'cancelled'
  },
  {
    flightNumber: 'GOL 1634',
    aircraft: 'Boeing 737-800',
    departureAirport: 'POA',
    arrivalAirport: 'GRU',
    scheduledDeparture: '2025-09-20T12:00:00',
    scheduledArrival: '2025-09-20T13:15:00',
    actualDeparture: '2025-09-20T12:05:00',
    actualArrival: '2025-09-20T13:20:00',
    gate: 'D02',
    status: 'arrived'
  }
];

export function FlightStatusDemo() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Flight Status Components</h1>
        <p className="text-muted-foreground mb-6">
          Demonstração dos componentes de status de voo personalizados para aviação
        </p>
      </div>

      {/* Default Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variant: Default</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockFlights.slice(0, 2).map((flight, index) => (
            <FlightStatusCard 
              key={index} 
              flight={flight} 
              variant="default"
            />
          ))}
        </div>
      </section>

      {/* Compact Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variant: Compact</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {mockFlights.slice(0, 3).map((flight, index) => (
            <FlightStatusCard 
              key={index} 
              flight={flight} 
              variant="compact"
            />
          ))}
        </div>
      </section>

      {/* Detailed Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variant: Detailed</h2>
        <div className="grid grid-cols-1 gap-4">
          {mockFlights.slice(3, 5).map((flight, index) => (
            <FlightStatusCard 
              key={index} 
              flight={flight} 
              variant="detailed"
            />
          ))}
        </div>
      </section>

      {/* All Status Types */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">All Status Types</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockFlights.map((flight, index) => (
            <FlightStatusCard 
              key={index} 
              flight={flight} 
              variant="default"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
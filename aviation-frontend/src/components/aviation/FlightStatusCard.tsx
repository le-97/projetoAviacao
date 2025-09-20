import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Plane, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FlightStatus = 'on-time' | 'delayed' | 'cancelled' | 'boarding' | 'departed' | 'arrived';

export interface FlightData {
  flightNumber: string;
  aircraft: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  gate?: string;
  status: FlightStatus;
  delay?: number; // minutes
}

interface FlightStatusCardProps {
  flight: FlightData;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const statusConfig: Record<FlightStatus, { 
  color: string; 
  bgColor: string; 
  textColor: string; 
  label: string;
}> = {
  'on-time': {
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    label: 'On Time'
  },
  'delayed': {
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    label: 'Delayed'
  },
  'cancelled': {
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    label: 'Cancelled'
  },
  'boarding': {
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    label: 'Boarding'
  },
  'departed': {
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    label: 'Departed'
  },
  'arrived': {
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    label: 'Arrived'
  }
};

export function FlightStatusCard({ flight, variant = 'default', className }: FlightStatusCardProps) {
  const config = statusConfig[flight.status];

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      config.bgColor,
      className
    )}>
      <CardHeader className={cn('pb-3', isCompact && 'pb-2')}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            'flex items-center gap-2',
            isCompact ? 'text-lg' : 'text-xl'
          )}>
            <Plane className="h-5 w-5" />
            {flight.flightNumber}
          </CardTitle>
          <Badge className={cn(
            'px-3 py-1',
            config.color,
            'text-white'
          )}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Route Information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{flight.departureAirport}</span>
          </div>
          <div className="flex-1 border-t border-dashed border-gray-300 mx-4"></div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{flight.arrivalAirport}</span>
          </div>
        </div>

        {/* Time Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              Partida
            </div>
            <div className="text-lg font-mono">
              {formatTime(flight.scheduledDeparture)}
            </div>
            {flight.actualDeparture && flight.actualDeparture !== flight.scheduledDeparture && (
              <div className={cn(
                'text-sm font-mono',
                flight.status === 'delayed' ? 'text-yellow-600' : 'text-gray-600'
              )}>
                Real: {formatTime(flight.actualDeparture)}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              Chegada
            </div>
            <div className="text-lg font-mono">
              {formatTime(flight.scheduledArrival)}
            </div>
            {flight.actualArrival && flight.actualArrival !== flight.scheduledArrival && (
              <div className={cn(
                'text-sm font-mono',
                flight.status === 'delayed' ? 'text-yellow-600' : 'text-gray-600'
              )}>
                Real: {formatTime(flight.actualArrival)}
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {!isCompact && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Aeronave:</span> {flight.aircraft}
            </div>
            {flight.gate && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Portão:</span> {flight.gate}
              </div>
            )}
          </div>
        )}

        {/* Detailed Information */}
        {isDetailed && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Data: {formatDate(flight.scheduledDeparture)}</span>
            </div>
            
            {flight.delay && flight.delay > 0 && (
              <div className="text-sm text-yellow-600">
                <span className="font-medium">Atraso:</span> {flight.delay} minutos
              </div>
            )}
            
            {flight.status === 'cancelled' && (
              <div className="text-sm text-red-600 font-medium">
                Voo cancelado - Entre em contato com a companhia aérea
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
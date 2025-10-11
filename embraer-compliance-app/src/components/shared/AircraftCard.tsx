import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane } from 'lucide-react';
import { cn, getCategoryLabel, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { Aircraft } from '@/types';

interface AircraftCardProps {
  aircraft: Aircraft;
  onClick?: () => void;
}

export function AircraftCard({ aircraft, onClick }: AircraftCardProps) {
  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl group-hover:text-embraer-blue transition-colors">
              {aircraft.model}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {aircraft.manufacturer}
            </p>
          </div>
          <Badge className={cn('ml-2', getStatusColor(aircraft.status))}>
            {getStatusLabel(aircraft.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Aircraft Image */}
        {aircraft.image ? (
          <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
            <img
              src={aircraft.image}
              alt={`${aircraft.model} - ${aircraft.manufacturer} aircraft`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-embraer-blue/10 to-embraer-dark/10 rounded-lg flex items-center justify-center mb-4">
            <Plane className="w-16 h-16 text-embraer-blue/40" />
          </div>
        )}

        {/* Specs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Categoria:</span>
            <span className="font-medium">{getCategoryLabel(aircraft.category)}</span>
          </div>
          {aircraft.capacity.passengers && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Passageiros:</span>
              <span className="font-medium">{aircraft.capacity.passengers}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Alcance:</span>
            <span className="font-medium">
              {aircraft.range.value.toLocaleString()} {aircraft.range.unit}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Motores:</span>
            <span className="font-medium">{aircraft.engines.type}</span>
          </div>
        </div>

        {/* Features */}
        {aircraft.features && aircraft.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {aircraft.features.slice(0, 2).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {aircraft.features.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{aircraft.features.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
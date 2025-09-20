import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudDrizzle,
  Zap,
  Wind,
  Eye,
  Thermometer,
  Gauge,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type WeatherCondition = 
  | 'clear' 
  | 'partly-cloudy' 
  | 'cloudy' 
  | 'rain' 
  | 'drizzle' 
  | 'snow' 
  | 'thunderstorm' 
  | 'fog'
  | 'mist';

export type VisibilityCategory = 'excellent' | 'good' | 'fair' | 'poor' | 'very-poor';

export interface WeatherData {
  location: string;
  airportCode?: string;
  timestamp: string;
  condition: WeatherCondition;
  temperature: number; // Celsius
  humidity: number; // percentage
  pressure: number; // hPa
  windSpeed: number; // knots
  windDirection: number; // degrees
  visibility: number; // kilometers
  dewPoint: number; // Celsius
  cloudCeiling?: number; // feet
  precipitationChance?: number; // percentage
  uvIndex?: number;
}

interface WeatherWidgetProps {
  weather: WeatherData;
  variant?: 'default' | 'compact' | 'detailed';
  showAlerts?: boolean;
  className?: string;
}

const conditionConfig: Record<WeatherCondition, {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
}> = {
  clear: {
    icon: Sun,
    label: 'Céu Limpo',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  'partly-cloudy': {
    icon: Cloud,
    label: 'Parcialmente Nublado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  cloudy: {
    icon: Cloud,
    label: 'Nublado',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  rain: {
    icon: CloudRain,
    label: 'Chuva',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100'
  },
  drizzle: {
    icon: CloudDrizzle,
    label: 'Garoa',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  snow: {
    icon: CloudSnow,
    label: 'Neve',
    color: 'text-blue-300',
    bgColor: 'bg-blue-50'
  },
  thunderstorm: {
    icon: Zap,
    label: 'Tempestade',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50'
  },
  fog: {
    icon: Cloud,
    label: 'Nevoeiro',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100'
  },
  mist: {
    icon: Cloud,
    label: 'Neblina',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50'
  }
};

const getVisibilityCategory = (visibility: number): VisibilityCategory => {
  if (visibility >= 10) return 'excellent';
  if (visibility >= 5) return 'good';
  if (visibility >= 1.5) return 'fair';
  if (visibility >= 0.8) return 'poor';
  return 'very-poor';
};

const visibilityColors: Record<VisibilityCategory, string> = {
  excellent: 'text-green-600',
  good: 'text-green-500',
  fair: 'text-yellow-500',
  poor: 'text-orange-500',
  'very-poor': 'text-red-600'
};

const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getWeatherAlerts = (weather: WeatherData): Array<{type: string, message: string}> => {
  const alerts = [];
  
  if (weather.visibility < 1.5) {
    alerts.push({
      type: 'visibility',
      message: `Visibilidade baixa: ${weather.visibility}km`
    });
  }
  
  if (weather.windSpeed >= 25) {
    alerts.push({
      type: 'wind',
      message: `Ventos fortes: ${weather.windSpeed}kt`
    });
  }
  
  if (weather.condition === 'thunderstorm') {
    alerts.push({
      type: 'storm',
      message: 'Atividade de tempestade detectada'
    });
  }
  
  if (weather.cloudCeiling && weather.cloudCeiling < 1000) {
    alerts.push({
      type: 'ceiling',
      message: `Teto baixo: ${weather.cloudCeiling}ft`
    });
  }
  
  return alerts;
};

export function WeatherWidget({ weather, variant = 'default', showAlerts = true, className }: WeatherWidgetProps) {
  const config = conditionConfig[weather.condition];
  const WeatherIcon = config.icon;
  const visibilityCategory = getVisibilityCategory(weather.visibility);
  const windDirection = getWindDirection(weather.windDirection);
  const alerts = getWeatherAlerts(weather);
  
  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  return (
    <Card className={cn('w-full', config.bgColor, className)}>
      <CardHeader className={cn('pb-3', isCompact && 'pb-2')}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <WeatherIcon className={cn('h-5 w-5', config.color)} />
            <div>
              <span className="text-lg">{weather.location}</span>
              {weather.airportCode && (
                <Badge variant="outline" className="ml-2">
                  {weather.airportCode}
                </Badge>
              )}
            </div>
          </CardTitle>
          
          <div className="text-right">
            <div className="text-2xl font-bold">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-muted-foreground">
              {config.label}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Weather Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wind className="h-3 w-3" />
              Vento
            </div>
            <div className="font-mono text-sm">
              {windDirection} {weather.windSpeed}kt
            </div>
            <div className="text-xs text-muted-foreground">
              {weather.windDirection}°
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-3 w-3" />
              Visibilidade
            </div>
            <div className={cn(
              'font-mono text-sm font-medium',
              visibilityColors[visibilityCategory]
            )}>
              {weather.visibility}km
            </div>
            <div className="text-xs text-muted-foreground capitalize">
              {visibilityCategory.replace('-', ' ')}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Gauge className="h-3 w-3" />
              Pressão
            </div>
            <div className="font-mono text-sm">
              {weather.pressure} hPa
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Thermometer className="h-3 w-3" />
              Umidade
            </div>
            <div className="font-mono text-sm">
              {weather.humidity}%
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        {!isCompact && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t">
            <div className="text-sm">
              <span className="text-muted-foreground">Ponto de Orvalho:</span>
              <span className="ml-2 font-mono">{weather.dewPoint}°C</span>
            </div>
            
            {weather.cloudCeiling && (
              <div className="text-sm">
                <span className="text-muted-foreground">Teto de Nuvens:</span>
                <span className="ml-2 font-mono">{weather.cloudCeiling}ft</span>
              </div>
            )}
            
            {weather.precipitationChance !== undefined && (
              <div className="text-sm">
                <span className="text-muted-foreground">Chance de Chuva:</span>
                <span className="ml-2 font-mono">{weather.precipitationChance}%</span>
              </div>
            )}
          </div>
        )}

        {/* Extra Detailed Information */}
        {isDetailed && weather.uvIndex !== undefined && (
          <div className="pt-3 border-t">
            <div className="text-sm">
              <span className="text-muted-foreground">Índice UV:</span>
              <span className="ml-2 font-mono">{weather.uvIndex}</span>
            </div>
          </div>
        )}

        {/* Weather Alerts */}
        {showAlerts && alerts.length > 0 && (
          <div className="pt-3 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-orange-700">
                <AlertTriangle className="h-4 w-4" />
                Alertas Meteorológicos
              </div>
              <div className="space-y-1">
                {alerts.map((alert, index) => (
                  <div key={index} className="text-sm text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Atualizado às {formatTime(weather.timestamp)}
          </div>
          
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {weather.airportCode || 'LOCAL'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { AviationGrid, AviationPanel, AviationMetric } from "@/components/ui/aviation-hud";
import { AviationButton, AviationIconButton } from "@/components/ui/aviation-button";
import { Plane, Gauge, Settings, AlertTriangle } from "lucide-react";

export function AviationDashboard() {
  return (
    <AviationGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* System Status Panel */}
      <AviationPanel title="System Status" status="online" className="md:col-span-2">
        <div className="grid grid-cols-2 gap-4">
          <AviationMetric label="Engine Temp" value={285} unit="°C" trend="stable" />
          <AviationMetric label="Fuel Level" value={87} unit="%" trend="down" />
          <AviationMetric label="Altitude" value={35000} unit="ft" trend="up" />
          <AviationMetric label="Speed" value={580} unit="kts" trend="stable" />
        </div>
        
        <div className="flex space-x-2 mt-4">
          <AviationButton variant="primary" size="sm">
            <Plane className="w-4 h-4 mr-2" />
            Auto Pilot
          </AviationButton>
          <AviationButton variant="secondary" size="sm">
            <Gauge className="w-4 h-4 mr-2" />
            Diagnostics
          </AviationButton>
        </div>
      </AviationPanel>

      {/* Navigation Panel */}
      <AviationPanel title="Navigation" status="online">
        <AviationMetric label="Heading" value={270} unit="°" />
        <AviationMetric label="Distance" value={1250} unit="nm" />
        <AviationMetric label="ETA" value="14:35" unit="UTC" />
        
        <div className="flex justify-between mt-4">
          <AviationIconButton 
            icon={<Settings className="w-4 h-4" />} 
            variant="ghost"
            size="sm"
          />
          <AviationIconButton 
            icon={<AlertTriangle className="w-4 h-4" />} 
            variant="warning"
            size="sm"
            pulse
          />
        </div>
      </AviationPanel>

      {/* Weather Panel */}
      <AviationPanel title="Weather" status="warning">
        <AviationMetric label="Wind Speed" value={25} unit="kts" trend="up" />
        <AviationMetric label="Visibility" value={10} unit="km" />
        <AviationMetric label="Pressure" value={1013} unit="hPa" />
      </AviationPanel>

      {/* Communications Panel */}
      <AviationPanel title="Communications" status="online">
        <div className="space-y-2">
          <div className="text-xs font-mono text-green-400">
            ▸ ATC: Maintain FL350
          </div>
          <div className="text-xs font-mono text-blue-400">
            ▸ CREW: Roger, FL350
          </div>
          <div className="text-xs font-mono text-yellow-400">
            ▸ WARN: Weather ahead
          </div>
        </div>
      </AviationPanel>

      {/* Flight Plan Panel */}
      <AviationPanel title="Flight Plan" status="online">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-green-400">✓ KORD</span>
            <span>15:20</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-blue-400">→ KJFK</span>
            <span>18:45</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">○ KLAX</span>
            <span>22:10</span>
          </div>
        </div>
      </AviationPanel>
    </AviationGrid>
  );
}
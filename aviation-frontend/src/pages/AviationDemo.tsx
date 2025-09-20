import { useState } from "react";
import { AviationButton } from "../components/ui";
import { Plane, AlertTriangle, Power, Settings, ArrowRight, Radar, Shield, Clock, Activity, Wifi, Battery } from "lucide-react";

function AviationDemo() {
  const [loading, setLoading] = useState(false);

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="space-y-8 max-w-6xl w-full">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Plane className="w-12 h-12 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold text-white font-mono">
                AVIATION CONTROL SYSTEM
              </h1>
              <p className="text-slate-400 font-mono text-lg">
                Professional Aerospace Interface Components
              </p>
            </div>
            <Radar className="w-12 h-12 text-orange-400" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-mono text-sm">ONLINE</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <Shield className="w-4 h-4" />
              <span className="font-mono text-sm">SECURE</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-orange-400">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">READY</span>
            </div>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white font-mono mb-2">
              PRIMARY FLIGHT CONTROLS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded"></div>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            <AviationButton
              variant="primary"
              size="sm"
              icon={<Plane className="w-4 h-4" />}
              iconPosition="left"
            >
              TAKEOFF
            </AviationButton>
            <AviationButton
              variant="primary"
              size="md"
              icon={<Settings className="w-4 h-4" />}
              iconPosition="left"
            >
              AUTOPILOT
            </AviationButton>
            <AviationButton
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              ENGAGE SYSTEMS
            </AviationButton>
          </div>
        </div>

        {/* Secondary Systems */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white font-mono mb-2">
              SECONDARY SYSTEMS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-slate-500 to-slate-600 mx-auto rounded"></div>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            <AviationButton
              variant="secondary"
              size="sm"
              icon={<Settings className="w-4 h-4" />}
            >
              CONFIG
            </AviationButton>
            <AviationButton
              variant="secondary"
              size="md"
              icon={<Power className="w-4 h-4" />}
              iconPosition="left"
            >
              POWER SYSTEMS
            </AviationButton>
            <AviationButton
              variant="secondary"
              size="lg"
              icon={<Radar className="w-5 h-5" />}
              iconPosition="left"
            >
              NAVIGATION
            </AviationButton>
            <AviationButton
              variant="secondary"
              size="md"
              disabled
            >
              OFFLINE
            </AviationButton>
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white font-mono mb-2">
              EMERGENCY PROTOCOLS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded"></div>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            <AviationButton
              variant="danger"
              size="sm"
              icon={<AlertTriangle className="w-4 h-4" />}
            >
              ALERT
            </AviationButton>
            <AviationButton
              variant="danger"
              size="md"
              icon={<Power className="w-4 h-4" />}
              iconPosition="left"
            >
              EMERGENCY
            </AviationButton>
            <AviationButton
              variant="danger"
              size="lg"
              loading={loading}
              onClick={handleAsyncAction}
              icon={!loading ? <AlertTriangle className="w-5 h-5" /> : undefined}
              iconPosition="left"
            >
              {loading ? "PROCESSING..." : "ABORT SEQUENCE"}
            </AviationButton>
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white font-mono mb-2">
              SYSTEM STATUS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded"></div>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            <AviationButton
              variant="primary"
              loading={true}
              size="md"
            >
              INITIALIZING
            </AviationButton>
            <AviationButton
              variant="secondary"
              loading={true}
              size="md"
            >
              CALIBRATING
            </AviationButton>
            <AviationButton
              variant="danger"
              loading={true}
              size="md"
            >
              DIAGNOSTICS
            </AviationButton>
          </div>
        </div>

        {/* Demo Grid */}
        <div className="bg-slate-800/50 rounded-xl p-8 space-y-6">
          <h3 className="text-xl font-semibold text-white font-mono text-center">
            COMPONENT SHOWCASE
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Size Variants */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-300 font-mono">Size Variants</h4>
              <div className="space-y-3">
                <AviationButton variant="primary" size="sm">Small</AviationButton>
                <AviationButton variant="primary" size="md">Medium</AviationButton>
                <AviationButton variant="primary" size="lg">Large</AviationButton>
              </div>
            </div>

            {/* Icon Positions */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-300 font-mono">Icon Positions</h4>
              <div className="space-y-3">
                <AviationButton 
                  variant="secondary" 
                  icon={<Plane className="w-4 h-4" />} 
                  iconPosition="left"
                >
                  Left Icon
                </AviationButton>
                <AviationButton 
                  variant="secondary" 
                  icon={<ArrowRight className="w-4 h-4" />} 
                  iconPosition="right"
                >
                  Right Icon
                </AviationButton>
              </div>
            </div>

            {/* States */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-slate-300 font-mono">Button States</h4>
              <div className="space-y-3">
                <AviationButton variant="primary">Normal</AviationButton>
                <AviationButton variant="primary" loading>Loading</AviationButton>
                <AviationButton variant="primary" disabled>Disabled</AviationButton>
              </div>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="bg-slate-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white font-mono text-center mb-6">
            SYSTEM METRICS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-mono font-bold text-white">98%</div>
              <div className="text-sm text-slate-400 font-mono">UPTIME</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Wifi className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-mono font-bold text-white">5G</div>
              <div className="text-sm text-slate-400 font-mono">SIGNAL</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Battery className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-mono font-bold text-white">87%</div>
              <div className="text-sm text-slate-400 font-mono">BATTERY</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-mono font-bold text-white">MAX</div>
              <div className="text-sm text-slate-400 font-mono">SECURITY</div>
            </div>
          </div>
        </div>
        <div className="text-center text-slate-500 font-mono text-sm">
          <p>Aerospace Control Interface v2.1.0 | Built with React & Tailwind CSS</p>
          <p className="mt-1">Inspired by Embraer, NASA, Boeing & SpaceX Design Systems</p>
        </div>
      </div>
    </div>
  );
}

export default AviationDemo;
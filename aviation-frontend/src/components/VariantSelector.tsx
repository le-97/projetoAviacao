import { useState } from 'react';
import { Palette, Monitor, Zap, Shield } from 'lucide-react';

interface VariantSelectorProps {
  onVariantSelect: (variant: 'military' | 'modern' | 'futuristic') => void;
}

export default function VariantSelector({ onVariantSelect }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const variants = [
    {
      id: 'military',
      name: 'Militar/Aeronáutico',
      description: 'Design escuro profissional inspirado em sistemas militares e cockpits de aeronaves. Cores: verde militar, amber, vermelho.',
      icon: Shield,
      preview: 'linear-gradient(135deg, #1a2f1a 0%, #2d5016 50%, #1a2f1a 100%)',
      features: ['Tema escuro profissional', 'Tipografia monospace', 'Indicadores LED', 'Elementos de cockpit']
    },
    {
      id: 'modern',
      name: 'Comercial Moderno',
      description: 'Interface limpa e moderna inspirada em apps comerciais como FlightRadar24. Design minimalista e funcional.',
      icon: Monitor,
      preview: 'linear-gradient(135deg, #f8fafc 0%, #3b82f6 50%, #1e40af 100%)',
      features: ['Design clean/minimalista', 'Cores claras', 'Layout Material Design', 'Tipografia sans-serif']
    },
    {
      id: 'futuristic',
      name: 'Futurista Sci-Fi',
      description: 'Interface holográfica com elementos neon e efeitos visuais avançados. Inspirado em filmes de ficção científica.',
      icon: Zap,
      preview: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #8b5cf6 75%, #06b6d4 100%)',
      features: ['Elementos neon', 'Efeitos glow', 'Bordas brilhantes', 'Interface holográfica']
    }
  ];

  const handleSelect = (variantId: 'military' | 'modern' | 'futuristic') => {
    setSelectedVariant(variantId);
    onVariantSelect(variantId);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Palette className="w-12 h-12 text-blue-400 mr-4" />
            <h1 className="text-4xl font-bold text-white font-mono">
              SISTEMA DE AVIAÇÃO
            </h1>
          </div>
          <p className="text-xl text-slate-400 font-mono">
            Escolha a variante de design que mais lhe agrada
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded"></div>
        </div>

        {/* Variant Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {variants.map((variant) => {
            const Icon = variant.icon;
            const isSelected = selectedVariant === variant.id;
            
            return (
              <div
                key={variant.id}
                className={`relative bg-slate-800 rounded-xl p-8 border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  isSelected 
                    ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-2xl shadow-blue-500/20' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => handleSelect(variant.id as 'military' | 'modern' | 'futuristic')}
              >
                {/* Preview Bar */}
                <div 
                  className="h-4 rounded-lg mb-6"
                  style={{ background: variant.preview }}
                ></div>

                {/* Icon and Title */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">{variant.name}</h3>
                    <div className={`w-6 h-1 rounded mt-1 ${
                      variant.id === 'military' ? 'bg-green-500' :
                      variant.id === 'modern' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}></div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 mb-6 font-mono text-sm leading-relaxed">
                  {variant.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-300 font-mono">CARACTERÍSTICAS:</h4>
                  {variant.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-slate-400 font-mono">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        variant.id === 'military' ? 'bg-green-400' :
                        variant.id === 'modern' ? 'bg-blue-400' :
                        'bg-purple-400'
                      }`}></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {selectedVariant && (
          <div className="text-center">
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-lg font-mono text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => window.location.reload()}
            >
              CARREGAR SISTEMA SELECIONADO
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-500 font-mono text-sm">
            Sistema de Controle Aeronáutico v2.1.0 | Powered by Magic MCP
          </p>
        </div>
      </div>
    </div>
  );
}
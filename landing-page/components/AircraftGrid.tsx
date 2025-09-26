'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Users, 
  Globe, 
  Shield,
  ArrowRight,
  Filter
} from 'lucide-react'

interface Aircraft {
  id: string
  name: string
  model: string
  category: 'commercial' | 'executive' | 'military'
  seats: string
  range: string
  status: 'certified' | 'in-progress' | 'planned'
  countries: number
  description: string
  features: string[]
  image?: string
}

const aircraftData: Aircraft[] = [
  // Aviação Comercial
  {
    id: 'e170',
    name: 'E170',
    model: 'Regional Jet',
    category: 'commercial',
    seats: '70-80',
    range: '3,700 km',
    status: 'certified',
    countries: 45,
    description: 'Jato regional eficiente para rotas de média distância',
    features: ['Baixo consumo', 'Conforto superior', 'Manutenção reduzida']
  },
  {
    id: 'e175',
    name: 'E175',
    model: 'Regional Jet',
    category: 'commercial',
    seats: '76-88',
    range: '4,000 km',
    status: 'certified',
    countries: 48,
    description: 'Líder em aviação regional com eficiência operacional',
    features: ['Tecnologia avançada', 'Economia de combustível', 'Baixo ruído']
  },
  {
    id: 'e190',
    name: 'E190',
    model: 'Regional Jet',
    category: 'commercial',
    seats: '96-114',
    range: '4,800 km',
    status: 'certified',
    countries: 52,
    description: 'Versatilidade para diferentes configurações de mercado',
    features: ['Flexibilidade', 'Conforto premium', 'Eficiência comprovada']
  },
  {
    id: 'e195',
    name: 'E195',
    model: 'Regional Jet',
    category: 'commercial',
    seats: '108-146',
    range: '4,400 km',
    status: 'certified',
    countries: 50,
    description: 'Máxima capacidade da família E-Jets',
    features: ['Alta capacidade', 'Economia operacional', 'Conectividade']
  },
  {
    id: 'e190-e2',
    name: 'E190-E2',
    model: 'Nova Geração',
    category: 'commercial',
    seats: '97-114',
    range: '5,300 km',
    status: 'certified',
    countries: 35,
    description: 'Tecnologia de ponta da segunda geração',
    features: ['Motores GTF', 'Aviónica moderna', 'Sustentabilidade']
  },
  {
    id: 'e195-e2',
    name: 'E195-E2',
    model: 'Nova Geração',
    category: 'commercial',
    seats: '120-146',
    range: '4,800 km',
    status: 'certified',
    countries: 38,
    description: 'O mais eficiente da categoria single-aisle',
    features: ['Tecnologia GTF', 'Menor consumo', 'Cabine premium']
  },

  // Aviação Executiva
  {
    id: 'phenom100',
    name: 'Phenom 100',
    model: 'Very Light Jet',
    category: 'executive',
    seats: '4-6',
    range: '2,200 km',
    status: 'certified',
    countries: 42,
    description: 'Entry-level na aviação executiva premium',
    features: ['Acesso fácil', 'Tecnologia Garmin', 'Operação simples']
  },
  {
    id: 'phenom300',
    name: 'Phenom 300',
    model: 'Light Jet',
    category: 'executive',
    seats: '6-11',
    range: '3,650 km',
    status: 'certified',
    countries: 55,
    description: 'Líder mundial em light jets',
    features: ['Cabine ampla', 'Performance superior', 'Aviónica Garmin']
  },
  {
    id: 'praetor500',
    name: 'Praetor 500',
    model: 'Mid-size',
    category: 'executive',
    seats: '9-12',
    range: '6,100 km',
    status: 'certified',
    countries: 40,
    description: 'Mid-size com alcance transcontinental',
    features: ['Alcance estendido', 'Ka-band', 'Turbulência reduzida']
  },
  {
    id: 'praetor600',
    name: 'Praetor 600',
    model: 'Super Mid-size',
    category: 'executive',
    seats: '8-14',
    range: '7,400 km',
    status: 'certified',
    countries: 45,
    description: 'Máxima performance em super mid-size',
    features: ['Intercontinental', 'Cabine luxuosa', 'Tecnologia avançada']
  },
  {
    id: 'legacy450',
    name: 'Legacy 450',
    model: 'Mid-size',
    category: 'executive',
    seats: '8-9',
    range: '4,200 km',
    status: 'certified',
    countries: 35,
    description: 'Eficiência e conforto em mid-size',
    features: ['Fly-by-wire', 'Cabine silenciosa', 'Eficiência operacional']
  },
  {
    id: 'legacy500',
    name: 'Legacy 500',
    model: 'Mid-size',
    category: 'executive',
    seats: '8-12',
    range: '5,600 km',
    status: 'certified',
    countries: 48,
    description: 'Revolucionário em tecnologia fly-by-wire',
    features: ['Fly-by-wire', 'Cabine flat-floor', 'Performance excepcional']
  },

  // Aviação Militar
  {
    id: 'kc390',
    name: 'KC-390 Millennium',
    model: 'Transporte Tático',
    category: 'military',
    seats: '80 soldados',
    range: '6,000 km',
    status: 'certified',
    countries: 8,
    description: 'Transporte militar multimissão mais avançado',
    features: ['Multimissão', 'Tecnologia militar', 'Capacidade logística']
  },
  {
    id: 'supertucano',
    name: 'A-29 Super Tucano',
    model: 'Ataque Leve',
    category: 'military',
    seats: '2 tripulantes',
    range: '4,200 km',
    status: 'certified',
    countries: 15,
    description: 'Líder mundial em aeronaves de ataque leve',
    features: ['Versatilidade operacional', 'Custo-benefício', 'Proven in combat']
  }
]

const categories = [
  { id: 'all', name: 'Todas', icon: Globe },
  { id: 'commercial', name: 'Comercial', icon: Users },
  { id: 'executive', name: 'Executiva', icon: Shield },
  { id: 'military', name: 'Militar', icon: Filter }
]

export default function AircraftGrid() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredAircraft, setHoveredAircraft] = useState<string | null>(null)

  const filteredAircraft = selectedCategory === 'all' 
    ? aircraftData 
    : aircraftData.filter(aircraft => aircraft.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'certified': return 'bg-success-green text-white'
      case 'in-progress': return 'bg-embraer-gold text-aviation-blue'
      case 'planned': return 'bg-gray-400 text-white'
      default: return 'bg-gray-400 text-white'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'certified': return 'Certificado'
      case 'in-progress': return 'Em Processo'
      case 'planned': return 'Planejado'
      default: return 'Status'
    }
  }

  return (
    <section id="aeronaves" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frota{' '}
            <span className="bg-gradient-to-r from-aviation-blue to-embraer-gold bg-clip-text text-transparent">
              Embraer
            </span>{' '}
            Suportada
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            15+ modelos de aeronaves certificados em múltiplas jurisdições internacionais 
            com suporte completo para análise de conformidade
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-500 ${
                selectedCategory === 'all' 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-white text-blue-900 hover:bg-gray-100'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('commercial')}
              className={`px-4 py-2 text-sm font-medium bg-white text-blue-900 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-500 ${
                selectedCategory === 'commercial' ? 'bg-blue-900 text-white' : ''
              }`}
            >
              Comercial
            </button>
            <button
              onClick={() => setSelectedCategory('executive')}
              className={`px-4 py-2 text-sm font-medium bg-white text-blue-900 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-500 ${
                selectedCategory === 'executive' ? 'bg-blue-900 text-white' : ''
              }`}
            >
              Executiva
            </button>
            <button
              onClick={() => setSelectedCategory('military')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg bg-white text-blue-900 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-500 ${
                selectedCategory === 'military' ? 'bg-blue-900 text-white' : ''
              }`}
            >
              Militar
            </button>
          </div>
        </motion.div>

        {/* Aircraft Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredAircraft.map((aircraft, index) => (
            <motion.div
              key={aircraft.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(0,51,102,0.15)'
              }}
              onHoverStart={() => setHoveredAircraft(aircraft.id)}
              onHoverEnd={() => setHoveredAircraft(null)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group cursor-pointer"
            >
              {/* Aircraft Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-aviation-blue to-sky-gradient-400 flex items-center justify-center overflow-hidden">
                <div className="text-white text-6xl font-bold opacity-20">
                  {aircraft.name}
                </div>
                
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(aircraft.status)}`}>
                  {getStatusText(aircraft.status)}
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                  {aircraft.category === 'commercial' ? 'Comercial' : 
                   aircraft.category === 'executive' ? 'Executiva' : 'Militar'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Embraer {aircraft.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{aircraft.model}</p>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {aircraft.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Assentos</div>
                    <div className="font-semibold text-gray-900">{aircraft.seats}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Alcance</div>
                    <div className="font-semibold text-gray-900">{aircraft.range}</div>
                  </div>
                </div>

                {/* Countries */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <span>{aircraft.countries} países certificados</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {aircraft.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {aircraft.features.length > 2 && (
                      <span className="text-gray-500 text-xs">
                        +{aircraft.features.length - 2} mais
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ x: 5 }}
                  className="w-full bg-aviation-blue hover:bg-sky-gradient-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center group"
                >
                  <span>Analisar Conformidade</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-aviation-blue to-embraer-gold rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Não encontrou seu modelo?
            </h3>
            <p className="text-white/90 mb-6">
              Nossa equipe pode ajudar com análises customizadas para qualquer aeronave Embraer
            </p>
            <button className="bg-white text-aviation-blue font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
              Fale com Especialista
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  GlobeIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Country {
  code: string
  name: string
  authority: string
  region: string
  complexity: 'low' | 'medium' | 'high'
  bilateralAgreements: string[]
  position: { x: number; y: number }
}

const countries: Country[] = [
  // Américas
  { code: 'US', name: 'Estados Unidos', authority: 'FAA', region: 'americas', complexity: 'high', bilateralAgreements: ['BASA'], position: { x: 20, y: 35 } },
  { code: 'BR', name: 'Brasil', authority: 'ANAC', region: 'americas', complexity: 'low', bilateralAgreements: ['BASA', 'Mercosul'], position: { x: 35, y: 65 } },
  { code: 'CA', name: 'Canadá', authority: 'Transport Canada', region: 'americas', complexity: 'medium', bilateralAgreements: ['BASA'], position: { x: 22, y: 25 } },
  { code: 'AR', name: 'Argentina', authority: 'ANAC', region: 'americas', complexity: 'medium', bilateralAgreements: ['Mercosul'], position: { x: 32, y: 75 } },
  { code: 'MX', name: 'México', authority: 'AFAC', region: 'americas', complexity: 'medium', bilateralAgreements: [], position: { x: 18, y: 40 } },
  
  // Europa
  { code: 'EU', name: 'União Europeia', authority: 'EASA', region: 'europe', complexity: 'high', bilateralAgreements: ['BASA'], position: { x: 50, y: 30 } },
  { code: 'UK', name: 'Reino Unido', authority: 'UK CAA', region: 'europe', complexity: 'high', bilateralAgreements: [], position: { x: 48, y: 28 } },
  { code: 'DE', name: 'Alemanha', authority: 'LBA', region: 'europe', complexity: 'high', bilateralAgreements: ['EASA'], position: { x: 52, y: 30 } },
  { code: 'FR', name: 'França', authority: 'DGAC', region: 'europe', complexity: 'high', bilateralAgreements: ['EASA'], position: { x: 50, y: 32 } },
  
  // Ásia-Pacífico
  { code: 'SG', name: 'Singapura', authority: 'CAAS', region: 'asia', complexity: 'medium', bilateralAgreements: [], position: { x: 75, y: 55 } },
  { code: 'JP', name: 'Japão', authority: 'JCAB', region: 'asia', complexity: 'high', bilateralAgreements: [], position: { x: 82, y: 35 } },
  { code: 'AU', name: 'Austrália', authority: 'CASA', region: 'asia', complexity: 'medium', bilateralAgreements: [], position: { x: 82, y: 75 } },
  { code: 'CN', name: 'China', authority: 'CAAC', region: 'asia', complexity: 'high', bilateralAgreements: [], position: { x: 75, y: 35 } },
  
  // Oriente Médio & África
  { code: 'AE', name: 'Emirados Árabes Unidos', authority: 'GCAA', region: 'middle-east', complexity: 'medium', bilateralAgreements: [], position: { x: 58, y: 45 } },
  { code: 'ZA', name: 'África do Sul', authority: 'SACAA', region: 'africa', complexity: 'medium', bilateralAgreements: [], position: { x: 54, y: 70 } },
]

const regions = [
  { id: 'all', name: 'Todos os Países', color: 'bg-gray-600' },
  { id: 'americas', name: 'Américas', color: 'bg-blue-600' },
  { id: 'europe', name: 'Europa', color: 'bg-green-600' },
  { id: 'asia', name: 'Ásia-Pacífico', color: 'bg-purple-600' },
  { id: 'middle-east', name: 'Oriente Médio', color: 'bg-orange-600' },
  { id: 'africa', name: 'África', color: 'bg-red-600' }
]

export default function WorldMap() {
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null)

  const filteredCountries = selectedRegion === 'all' 
    ? countries 
    : countries.filter(country => country.region === selectedRegion)

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-success-green'
      case 'medium': return 'bg-embraer-gold'
      case 'high': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'low': return CheckCircleIcon
      case 'medium': return InformationCircleIcon
      case 'high': return ExclamationTriangleIcon
      default: return InformationCircleIcon
    }
  }

  return (
    <section id="paises" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
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
            Alcance{' '}
            <span className="bg-gradient-to-r from-aviation-blue to-embraer-gold bg-clip-text text-transparent">
              Global
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            60+ países e jurisdições regulamentares suportadas com análise especializada 
            de acordos bilaterais e complexidade de certificação
          </p>
        </motion.div>

        {/* Region Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedRegion === region.id
                  ? 'bg-aviation-blue text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
              <span>{region.name}</span>
            </button>
          ))}
        </motion.div>

        {/* World Map Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 mb-12"
        >
          {/* Map Container */}
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden">
            {/* World Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20"></div>
            
            {/* Continents Outline (Simplified) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {/* Americas */}
              <path
                d="M10 20 Q15 15 20 25 L25 60 Q30 70 35 80 L30 85 Q20 80 15 70 L10 50 Z"
                fill="rgba(59, 130, 246, 0.1)"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="0.2"
              />
              {/* Europe/Africa */}
              <path
                d="M45 25 Q55 20 60 30 L65 50 Q60 65 55 75 L50 80 Q45 70 40 50 L45 35 Z"
                fill="rgba(34, 197, 94, 0.1)"
                stroke="rgba(34, 197, 94, 0.3)"
                strokeWidth="0.2"
              />
              {/* Asia/Oceania */}
              <path
                d="M70 20 Q80 15 85 25 L90 45 Q85 60 80 75 L75 80 Q70 70 65 50 L70 30 Z"
                fill="rgba(147, 51, 234, 0.1)"
                stroke="rgba(147, 51, 234, 0.3)"
                strokeWidth="0.2"
              />
            </svg>

            {/* Country Points */}
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.5, zIndex: 10 }}
                onHoverStart={() => setHoveredCountry(country)}
                onHoverEnd={() => setHoveredCountry(null)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${country.position.x}%`,
                  top: `${country.position.y}%`
                }}
              >
                <div className={`w-4 h-4 rounded-full ${getComplexityColor(country.complexity)} shadow-lg border-2 border-white pulse-animation`}>
                  <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-current"></div>
                </div>
              </motion.div>
            ))}

            {/* Hover Tooltip */}
            {hoveredCountry && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-20 bg-white rounded-lg shadow-xl p-4 border border-gray-200 min-w-64"
                style={{
                  left: `${hoveredCountry.position.x}%`,
                  top: `${Math.max(hoveredCountry.position.y - 20, 5)}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getComplexityColor(hoveredCountry.complexity)}`}>
                    {(() => {
                      const Icon = getComplexityIcon(hoveredCountry.complexity)
                      return <Icon className="h-5 w-5 text-white" />
                    })()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{hoveredCountry.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{hoveredCountry.authority}</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Complexidade:</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full text-white ${getComplexityColor(hoveredCountry.complexity)}`}>
                          {hoveredCountry.complexity === 'low' ? 'Baixa' : 
                           hoveredCountry.complexity === 'medium' ? 'Média' : 'Alta'}
                        </span>
                      </div>
                      {hoveredCountry.bilateralAgreements.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Acordos: {hoveredCountry.bilateralAgreements.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-success-green"></div>
              <span className="text-sm text-gray-600">Baixa Complexidade</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-embraer-gold"></div>
              <span className="text-sm text-gray-600">Média Complexidade</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Alta Complexidade</span>
            </div>
          </div>
        </motion.div>

        {/* Countries Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCountries.map((country, index) => {
            const ComplexityIcon = getComplexityIcon(country.complexity)
            return (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,51,102,0.1)' }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:border-aviation-blue/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{country.name}</h3>
                    <p className="text-gray-600 text-sm">{country.authority}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${getComplexityColor(country.complexity)}`}>
                    <ComplexityIcon className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Complexidade:</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full text-white ${getComplexityColor(country.complexity)}`}>
                      {country.complexity === 'low' ? 'Baixa' : 
                       country.complexity === 'medium' ? 'Média' : 'Alta'}
                    </span>
                  </div>

                  {country.bilateralAgreements.length > 0 && (
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-500">Acordos:</span>
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {country.bilateralAgreements.map((agreement, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {agreement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button className="w-full mt-4 bg-aviation-blue/10 hover:bg-aviation-blue hover:text-white text-aviation-blue font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                  Analisar Conformidade
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
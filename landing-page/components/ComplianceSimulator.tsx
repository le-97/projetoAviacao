'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Clock, DollarSign, AlertCircle } from 'lucide-react'

export default function ComplianceSimulator() {
  const [selectedAircraft, setSelectedAircraft] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const aircraftOptions = [
    'E190-E2',
    'E195-E2', 
    'Phenom 300',
    'Praetor 600',
    'KC-390 Millennium'
  ]

  const countryOptions = [
    'Brasil (ANAC)',
    'Estados Unidos (FAA)',
    'União Europeia (EASA)',
    'China (CAAC)',
    'Emirados Árabes (GCAA)'
  ]

  const handleAnalyze = () => {
    if (selectedAircraft && selectedCountry) {
      setIsAnalyzing(true)
      // Simular análise
      setTimeout(() => {
        setIsAnalyzing(false)
      }, 3000)
    }
  }

  const features = [
    {
      icon: Search,
      title: 'Gap Analysis Automatizado',
      description: 'Identifique automaticamente lacunas entre sua aeronave e os requisitos regulamentares do país alvo.'
    },
    {
      icon: Clock,
      title: 'Predição de Timeline',
      description: 'Receba estimativas precisas do tempo necessário para completar o processo de certificação.'
    },
    {
      icon: DollarSign,
      title: 'Estimativa de Custos',
      description: 'Calcule os custos esperados com base em dados históricos de certificações similares.'
    },
    {
      icon: AlertCircle,
      title: 'Alertas Regulamentares',
      description: 'Notificações em tempo real sobre mudanças regulamentares que afetam sua operação.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50" id="demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Funcionalidades Avançadas de IA
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tecnologia inteligente para simplificar a certificação aeronáutica
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Simulator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  Simulador de Conformidade
                </h3>
                <p className="text-gray-600 mb-6">
                  Selecione sua aeronave e país de operação para receber uma análise instantânea dos requisitos regulamentares.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo Embraer
                    </label>
                    <select
                      value={selectedAircraft}
                      onChange={(e) => setSelectedAircraft(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um modelo</option>
                      {aircraftOptions.map((aircraft) => (
                        <option key={aircraft} value={aircraft}>
                          {aircraft}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      País de Operação
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um país</option>
                      {countryOptions.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    disabled={!selectedAircraft || !selectedCountry || isAnalyzing}
                    className="w-full bg-blue-900 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? 'Analisando...' : 'Analisar Conformidade'}
                  </motion.button>
                  
                  {isAnalyzing && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></div>
                        <span className="text-blue-900 text-sm">
                          Processando análise de conformidade...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex"
                  >
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                      <IconComponent className="text-blue-900 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-blue-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
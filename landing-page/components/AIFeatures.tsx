'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  CpuChipIcon,
  DocumentMagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface AIFeature {
  id: string
  title: string
  description: string
  icon: any
  benefits: string[]
  accuracy: string
  timeReduction: string
  demo?: string
}

const aiFeatures: AIFeature[] = [
  {
    id: 'gap-analysis',
    title: 'Análise Inteligente de Gaps',
    description: 'IA detecta automaticamente lacunas de conformidade entre diferentes jurisdições regulamentares',
    icon: DocumentMagnifyingGlassIcon,
    benefits: [
      'Identificação automática de discrepâncias',
      'Análise comparativa multi-jurisdicional',
      'Priorização de correções críticas',
      'Relatórios detalhados de gaps'
    ],
    accuracy: '95%',
    timeReduction: '80%',
    demo: 'Analisando regulamentações FAA vs EASA...'
  },
  {
    id: 'prediction',
    title: 'Predição de Mudanças Regulamentares',
    description: 'Algoritmos preditivos antecipam alterações nas regulamentações baseado em tendências históricas',
    icon: ArrowTrendingUpIcon,
    benefits: [
      'Antecipação de mudanças normativas',
      'Planejamento proativo de conformidade',
      'Análise de impacto de novos requisitos',
      'Timeline de implementação otimizada'
    ],
    accuracy: '88%',
    timeReduction: '60%',
    demo: 'Prevendo mudanças na EASA para 2025...'
  },
  {
    id: 'automation',
    title: 'Automação de Processos',
    description: 'Fluxos de trabalho inteligentes automatizam tarefas repetitivas de compliance',
    icon: CpuChipIcon,
    benefits: [
      'Automação de documentação',
      'Workflows adaptativos',
      'Notificações inteligentes',
      'Integração com sistemas existentes'
    ],
    accuracy: '99%',
    timeReduction: '90%',
    demo: 'Gerando documentação automática...'
  },
  {
    id: 'optimization',
    title: 'Otimização de Certificação',
    description: 'IA otimiza sequência e timing de certificações para máxima eficiência',
    icon: ChartBarIcon,
    benefits: [
      'Sequenciamento otimizado',
      'Redução de tempo total',
      'Minimização de custos',
      'Maximização de paralelismo'
    ],
    accuracy: '92%',
    timeReduction: '70%',
    demo: 'Otimizando cronograma de certificação...'
  }
]

const stats = [
  { label: 'Redução de Tempo', value: '70%', icon: ClockIcon },
  { label: 'Precisão da IA', value: '95%', icon: ShieldCheckIcon },
  { label: 'Economia de Custos', value: '$500K', icon: LightBulbIcon },
  { label: 'Taxa de Sucesso', value: '98%', icon: CheckCircleIcon }
]

export default function AIFeatures() {
  const [activeFeature, setActiveFeature] = useState(aiFeatures[0])
  const [isDemoRunning, setIsDemoRunning] = useState(false)

  const runDemo = () => {
    setIsDemoRunning(true)
    setTimeout(() => setIsDemoRunning(false), 3000)
  }

  return (
    <section id="ai-features" className="py-20 bg-gradient-to-br from-aviation-blue to-blue-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-aviation-blue/50 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-embraer-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Inteligência Artificial{' '}
            <span className="bg-gradient-to-r from-embraer-gold to-yellow-300 bg-clip-text text-transparent">
              Avançada
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Revolucione a conformidade regulatória com IA de última geração 
            especialmente desenvolvida para a aviação
          </p>
        </motion.div>

        {/* AI Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <Icon className="h-8 w-8 text-embraer-gold mx-auto mb-3" />
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Feature Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Feature List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon
              const isActive = activeFeature.id === feature.id
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => setActiveFeature(feature)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive 
                      ? 'bg-white/20 border-embraer-gold backdrop-blur-lg' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${isActive ? 'bg-embraer-gold' : 'bg-white/20'}`}>
                      <Icon className={`h-6 w-6 ${isActive ? 'text-aviation-blue' : 'text-white'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-blue-100 mb-3">{feature.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <span className="text-blue-200">Precisão:</span>
                          <span className="text-embraer-gold font-semibold">{feature.accuracy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-blue-200">Redução:</span>
                          <span className="text-embraer-gold font-semibold">{feature.timeReduction}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Feature Detail Panel */}
          <motion.div
            key={activeFeature.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-embraer-gold rounded-2xl">
                <activeFeature.icon className="h-8 w-8 text-aviation-blue" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{activeFeature.title}</h3>
                <p className="text-blue-200">{activeFeature.description}</p>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 mb-8">
              <h4 className="text-lg font-semibold text-white mb-4">Principais Benefícios:</h4>
              {activeFeature.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircleIcon className="h-5 w-5 text-embraer-gold flex-shrink-0" />
                  <span className="text-blue-100">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Demo Section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-white font-semibold">Demo Interativo</h5>
                <button
                  onClick={runDemo}
                  disabled={isDemoRunning}
                  className="bg-embraer-gold hover:bg-yellow-500 text-aviation-blue font-semibold px-4 py-2 rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  {isDemoRunning ? 'Executando...' : 'Executar Demo'}
                </button>
              </div>
              
              <div className="bg-black/20 rounded-lg p-4 font-mono text-sm">
                <div className="text-embraer-gold mb-2">$ embraer-ai --feature={activeFeature.id}</div>
                {isDemoRunning ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="text-blue-200">{activeFeature.demo}</div>
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-yellow-300"
                    >
                      ⚡ Processando com IA...
                    </motion.div>
                    <div className="text-success-green">✓ Análise concluída com {activeFeature.accuracy} de precisão</div>
                  </motion.div>
                ) : (
                  <div className="text-gray-400">Clique em "Executar Demo" para ver a IA em ação</div>
                )}
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 bg-embraer-gold hover:bg-yellow-500 text-aviation-blue font-bold py-4 px-6 rounded-xl transition-colors duration-300"
            >
              Testar {activeFeature.title}
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Pronto para Revolucionar sua Conformidade?
          </h3>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 100 empresas que já economizaram milhões usando nossa IA
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-aviation-blue font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-300 shadow-lg"
          >
            Solicitar Demo Completa
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
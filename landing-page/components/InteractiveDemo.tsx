'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Play, BarChart3, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'

interface DemoStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'warning'
  duration: number
}

const demoSteps: DemoStep[] = [
  {
    id: '1',
    title: 'Análise Documental',
    description: 'Processamento automático de certificações existentes',
    status: 'pending',
    duration: 2000
  },
  {
    id: '2',
    title: 'Gap Analysis Inteligente',
    description: 'Identificação de lacunas de conformidade usando IA',
    status: 'pending',
    duration: 3000
  },
  {
    id: '3',
    title: 'Predição de Compliance',
    description: 'Simulação de cenários e estimativas',
    status: 'pending',
    duration: 2500
  },
  {
    id: '4',
    title: 'Relatório Executivo',
    description: 'Geração automática de documentação',
    status: 'pending',
    duration: 1500
  }
]

const resultMetrics = [
  { label: 'Gaps Críticos', value: '7', change: '-67%' },
  { label: 'Tempo Estimado', value: '4.2 meses', change: '-30%' },
  { label: 'Custo Reduzido', value: '$340K', change: '-45%' },
  { label: 'Conformidade', value: '97.3%', change: '+15%' }
]

export default function InteractiveDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState(demoSteps)
  const [showResults, setShowResults] = useState(false)

  const startDemo = () => {
    setIsRunning(true)
    setShowResults(false)
    setSteps(demoSteps.map(step => ({ ...step, status: 'pending' })))
    runSteps()
  }

  const runSteps = () => {
    let stepIndex = 0
    
    const runNextStep = () => {
      if (stepIndex >= demoSteps.length) {
        setIsRunning(false)
        setShowResults(true)
        return
      }

      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === stepIndex ? 'running' : 
                index < stepIndex ? 'completed' : 'pending'
      })))

      setTimeout(() => {
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === stepIndex ? 'completed' : step.status
        })))

        stepIndex++
        setTimeout(runNextStep, 500)
      }, demoSteps[stepIndex].duration)
    }

    runNextStep()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'running':
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50'
      case 'running':
        return 'border-blue-500 bg-blue-50'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <section id="demo" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Demonstração Interativa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja como nossa plataforma acelera o processo de certificação
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Simulação E175 → EASA
              </h3>
              <button
                onClick={startDemo}
                disabled={isRunning}
                className={`
                  inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors
                  ${isRunning 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                `}
              >
                <Play className="w-5 h-5 mr-2" />
                {isRunning ? 'Executando...' : 'Iniciar Demo'}
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-300
                    ${getStatusColor(step.status)}
                  `}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>

                  {step.status === 'running' && (
                    <div className="mt-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: step.duration / 1000 }}
                          className="bg-blue-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Resultados da Análise
            </h3>

            {showResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  {resultMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600">{metric.label}</div>
                      <div className={`text-xs font-semibold ${
                        metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Ver Relatório Completo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Aguardando execução da análise...</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
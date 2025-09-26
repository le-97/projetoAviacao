'use client'

import { motion } from 'framer-motion'
import { 
  ClockIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function ValueProposition() {
  const features = [
    {
      icon: ClockIcon,
      title: 'Redução de 70% no Tempo',
      description: 'Automatizamos análises regulamentares que antes levavam semanas em questão de horas.'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Economia de até $500K',
      description: 'Reduza custos com consultoria externa e minimize erros regulamentares dispendiosos.'
    },
    {
      icon: GlobeAltIcon,
      title: '60+ Jurisdições',
      description: 'Cobertura global com atualizações em tempo real das mudanças regulamentares.'
    },
    {
      icon: ChartBarIcon,
      title: 'Gap Analysis Automatizado',
      description: 'Identifique automaticamente lacunas de conformidade e receba recomendações acionáveis.'
    }
  ]

  return (
    <section className="py-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Como Nossa Plataforma Transforma a Certificação
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tecnologia avançada para simplificar processos complexos de certificação internacional
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="text-blue-900 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
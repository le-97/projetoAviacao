'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { 
  Globe, 
  GraduationCap, 
  BarChart3, 
  Clock,
  DollarSign,
  Users
} from 'lucide-react'

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

function AnimatedCounter({ end, duration = 2, suffix = '', prefix = '' }: CounterProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null
      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [inView, end, duration])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export default function StatsSection() {
  const stats = [
    {
      icon: Globe,
      number: 60,
      suffix: '+',
      label: 'Países Suportados',
      description: 'Jurisdições regulamentares cobertas',
      color: 'text-blue-600'
    },
    {
      icon: GraduationCap,
      number: 15,
      suffix: '+',
      label: 'Modelos Embraer',
      description: 'Aeronaves certificadas',
      color: 'text-embraer-gold'
    },
    {
      icon: BarChart3,
      number: 95,
      suffix: '%',
      label: 'Precisão IA',
      description: 'Em predições de conformidade',
      color: 'text-success-green'
    },
    {
      icon: Clock,
      number: 70,
      suffix: '%',
      label: 'Redução Tempo',
      description: 'Vs. processos tradicionais',
      color: 'text-purple-600'
    },
    {
      icon: DollarSign,
      number: 500,
      suffix: 'K',
      prefix: '$',
      label: 'Economia Potencial',
      description: 'Em custos de consultoria',
      color: 'text-green-600'
    },
    {
      icon: Users,
      number: 150,
      suffix: '+',
      label: 'Clientes Ativos',
      description: 'Empresas que confiam em nós',
      color: 'text-indigo-600'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-white">
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
            Resultados que{' '}
            <span className="bg-gradient-to-r from-aviation-blue to-embraer-gold bg-clip-text text-transparent">
              Impressionam
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa IA revoluciona a certificação aeronáutica com precisão sem precedentes 
            e eficiência comprovada por centenas de casos de sucesso
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(0,51,102,0.15)'
                }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group cursor-pointer"
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-2xl ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>

                {/* Number */}
                <div className="mb-4">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter 
                      end={stat.number} 
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-gray-600">
                    {stat.description}
                  </p>
                </div>

                {/* Progress Bar Animation */}
                <motion.div
                  className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className={`h-full ${stat.color.replace('text-', 'bg-')}`}
                    initial={{ width: '0%' }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Pronto para revolucionar seus processos de certificação?
          </p>
          <button className="bg-aviation-blue hover:bg-sky-gradient-700 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            Comece Sua Análise Gratuita
          </button>
        </motion.div>
      </div>
    </section>
  )
}
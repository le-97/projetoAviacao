'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  CheckIcon,
  StarIcon,
  ArrowRightIcon,
  PhoneIcon,
  EmailIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  cta: string
  popular?: boolean
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$2,999',
    period: 'por projeto',
    description: 'Ideal para empresas iniciando na conformidade regulatória',
    features: [
      'Análise de até 3 jurisdições',
      '1 tipo de aeronave',
      'Relatórios básicos',
      'Suporte por email',
      'Dashboard web',
      'Análise de gaps básica'
    ],
    highlighted: false,
    cta: 'Começar Agora'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$9,999',
    period: 'por projeto',
    description: 'Para empresas com múltiplos projetos de certificação',
    features: [
      'Análise ilimitada de jurisdições',
      'Múltiplos tipos de aeronaves',
      'IA preditiva avançada',
      'Suporte prioritário 24/7',
      'API e integrações',
      'Relatórios executivos',
      'Timeline otimizada',
      'Análise de riscos'
    ],
    highlighted: true,
    cta: 'Mais Popular',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Personalizado',
    period: 'sob consulta',
    description: 'Solução completa para grandes fabricantes',
    features: [
      'Tudo do Professional',
      'Implementação personalizada',
      'Treinamento da equipe',
      'Gestor de conta dedicado',
      'SLA garantido',
      'Integração com sistemas legados',
      'Consultoria especializada',
      'Suporte on-site'
    ],
    highlighted: false,
    cta: 'Falar com Vendas'
  }
]

const faqs = [
  {
    question: 'Como funciona o processo de implementação?',
    answer: 'A implementação é realizada em 3 fases: (1) Análise inicial e configuração (2-3 semanas), (2) Integração com seus sistemas (3-4 semanas), (3) Treinamento e go-live (1-2 semanas). Nossa equipe oferece suporte completo durante todo o processo.'
  },
  {
    question: 'Quais jurisdições regulamentares são suportadas?',
    answer: 'Suportamos mais de 60 jurisdições incluindo FAA (EUA), EASA (Europa), ANAC (Brasil), CAAC (China), JCAB (Japão), Transport Canada, CASA (Austrália) e muitas outras. Estamos constantemente expandindo nossa cobertura.'
  },
  {
    question: 'A plataforma integra com sistemas existentes?',
    answer: 'Sim, oferecemos APIs robustas e conectores pré-construídos para sistemas como SAP, Oracle, Microsoft Project, além de integrações customizadas conforme necessário.'
  },
  {
    question: 'Qual é o ROI típico da solução?',
    answer: 'Nossos clientes reportam ROI médio de 300-500% no primeiro ano, com reduções de 60-80% no tempo de certificação e economia de $500K-$2M por projeto.'
  },
  {
    question: 'Como é garantida a segurança dos dados?',
    answer: 'Utilizamos criptografia de nível militar, certificações SOC 2 Type II, ISO 27001, e oferecemos opções de deployment on-premise para máxima segurança.'
  }
]

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState('professional')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-white to-gray-50">
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
            Planos que se{' '}
            <span className="bg-gradient-to-r from-aviation-blue to-embraer-gold bg-clip-text text-transparent">
              Adaptam
            </span>{' '}
            ao seu Negócio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções flexíveis para empresas de todos os tamanhos. 
            Comece pequeno e escale conforme cresce.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,51,102,0.1)' }}
              className={`relative bg-white rounded-3xl p-8 border transition-all duration-300 ${
                plan.highlighted 
                  ? 'border-aviation-blue shadow-2xl transform scale-105' 
                  : 'border-gray-200 shadow-lg hover:border-aviation-blue/30'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-aviation-blue text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <StarIcon className="h-4 w-4" />
                    <span>Mais Popular</span>
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-aviation-blue">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckIcon className="h-5 w-5 text-success-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-4 px-6 rounded-xl font-bold transition-colors duration-300 ${
                  plan.highlighted
                    ? 'bg-aviation-blue hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-aviation-blue hover:text-white text-gray-900'
                }`}
              >
                {plan.cta}
              </motion.button>

              {/* Additional Info */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Sem taxa de setup • Cancelamento flexível
              </p>
            </motion.div>
          ))}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-aviation-blue rounded-3xl p-8 text-white mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-embraer-gold mb-2">ROI 400%</div>
              <div className="text-blue-100">Retorno médio no primeiro ano</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-embraer-gold mb-2">6 meses</div>
              <div className="text-blue-100">Redução no tempo de certificação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-embraer-gold mb-2">$2M</div>
              <div className="text-blue-100">Economia média por projeto</div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Solicitar Proposta</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Corporativo
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descreva seu Projeto
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Conte-nos sobre seu projeto de certificação, aeronaves envolvidas e jurisdições de interesse..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-blue focus:border-transparent"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-aviation-blue hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <span>Enviar Solicitação</span>
                <ArrowRightIcon className="h-5 w-5" />
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-5 w-5" />
                  <span>+55 11 9999-8888</span>
                </div>
                <div className="flex items-center space-x-2">
                  <EmailIcon className="h-5 w-5" />
                  <span>vendas@embraer-ai.com</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h3>
            
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-200">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left p-6 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-aviation-blue"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === index ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-aviation-blue to-blue-700 rounded-3xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Pronto para Transformar sua Certificação?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Junte-se a mais de 50 empresas que já revolucionaram seus processos 
              de conformidade com nossa plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-embraer-gold hover:bg-yellow-500 text-aviation-blue font-bold py-4 px-8 rounded-xl transition-colors duration-300"
              >
                Começar Teste Gratuito
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold py-4 px-8 rounded-xl transition-colors duration-300"
              >
                Agendar Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Clock } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    aircraft: '',
    message: ''
  })

  const aircraftOptions = [
    'E170',
    'E175', 
    'E190',
    'E195',
    'E190-E2',
    'E195-E2',
    'Phenom 100',
    'Phenom 300',
    'Praetor 500',
    'Praetor 600',
    'KC-390'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Aqui você implementaria a lógica de envio do formulário
  }

  return (
    <section className="py-20 bg-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 lg:mb-0"
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-6">
              Pronto para Simplificar Sua Certificação?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Preencha o formulário e nossa equipe entrará em contato para agendar uma demonstração personalizada.
            </p>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                  <Mail className="text-blue-900 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-900 mb-1">E-mail</h4>
                  <p className="text-gray-600">contato@embraercert.com</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                  <Phone className="text-blue-900 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-900 mb-1">Telefone</h4>
                  <p className="text-gray-600">+55 11 1234-5678</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
                  <Clock className="text-blue-900 w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-blue-900 mb-1">Horário Comercial</h4>
                  <p className="text-gray-600">Segunda a Sexta, 9h às 18h</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-50 p-8 rounded-xl shadow-md"
          >
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="aircraft" className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo de Aeronave
                  </label>
                  <select
                    id="aircraft"
                    name="aircraft"
                    value={formData.aircraft}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Conte-nos sobre seus requisitos de certificação..."
                  />
                </div>
                
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-blue-900 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
                  >
                    Solicitar Demonstração
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
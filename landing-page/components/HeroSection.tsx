'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 text-white" style={{
      background: 'linear-gradient(135deg, #003366 0%, #002244 100%)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 lg:mb-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Certificação Aeronáutica Internacional com IA
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Simplifique processos complexos de certificação Embraer em 60+ países com análise inteligente e gap analysis automatizado
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-lg text-center transition duration-300"
              >
                Iniciar Análise Gratuita
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#demo"
                className="bg-white hover:bg-gray-100 text-blue-900 font-bold py-3 px-6 rounded-lg text-center transition duration-300"
              >
                Ver Demo Interativa
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                alt="Embraer Aircraft" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-50"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
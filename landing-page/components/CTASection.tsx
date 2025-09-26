'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-6"
        >
          Pronto para Transformar Sua Certificação Aeronáutica?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
        >
          Experimente nossa plataforma gratuitamente por 14 dias e veja como podemos simplificar seu processo de certificação internacional.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-md shadow-sm text-blue-900 bg-yellow-500 hover:bg-yellow-600 transition duration-300"
          >
            Iniciar Teste Gratuito
            <ChevronRight className="ml-2 w-6 h-6" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
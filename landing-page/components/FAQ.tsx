'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const faqs = [
    {
      id: 1,
      question: 'Como a plataforma reduz o tempo de certificação?',
      answer: 'Nossa plataforma utiliza inteligência artificial para automatizar a análise de requisitos regulamentares, que tradicionalmente é feita manualmente por especialistas. O sistema compara automaticamente as especificações da aeronave com os requisitos do país alvo, identificando gaps e sugerindo ações corretivas. Isso reduz o tempo de análise de semanas para horas.'
    },
    {
      id: 2,
      question: 'A plataforma substitui consultores de certificação?',
      answer: 'Nossa plataforma não substitui completamente os consultores especializados, mas reduz significativamente a dependência deles. Ela automatiza 80-90% do trabalho analítico, permitindo que os consultores se concentrem em aspectos estratégicos e exceções complexas. Para operações menores, a plataforma pode ser suficiente para gerenciar todo o processo.'
    },
    {
      id: 3,
      question: 'Como são atualizadas as regulamentações?',
      answer: 'Nossa equipe de especialistas monitora diariamente as mudanças regulamentares em todos os 60+ países cobertos. Além disso, utilizamos tecnologia de IA para rastrear e interpretar automaticamente atualizações publicadas pelas autoridades aeronáuticas. Todas as mudanças são validadas por nossos especialistas antes de serem incorporadas à plataforma.'
    },
    {
      id: 4,
      question: 'Quais são os requisitos técnicos para usar a plataforma?',
      answer: 'A plataforma é 100% baseada na web e não requer instalação de software. Basta um navegador moderno (Chrome, Firefox, Safari ou Edge) e conexão com a internet. Para melhor desempenho, recomendamos uma conexão de banda larga. A plataforma é totalmente responsiva e funciona em desktops, tablets e smartphones.'
    },
    {
      id: 5,
      question: 'Como é calculada a estimativa de custos?',
      answer: 'Nossa IA analisa milhares de certificações históricas de modelos Embraer similares no país alvo, considerando fatores como complexidade regulatória, requisitos de documentação, testes necessários e taxas governamentais. O algoritmo leva em conta até mesmo a sazonalidade e a carga de trabalho das autoridades regulatórias para fornecer estimativas realistas.'
    }
  ]

  const toggleItem = (id: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tire suas dúvidas sobre nossa plataforma de certificação
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="flex justify-between items-center w-full text-left"
              >
                <h3 className="text-lg font-bold text-blue-900 pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openItems.has(faq.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {openItems.has(faq.id) ? (
                    <ChevronUp className="text-blue-900 w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="text-blue-900 w-5 h-5 flex-shrink-0" />
                  )}
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openItems.has(faq.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 mt-4 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlaneIcon } from '../icons/PlaneIcon';
import { X } from 'lucide-react';

interface NavLink {
  label: string;
  path: string;
  icon?: string;
}

const navLinks: NavLink[] = [
  { label: 'Dashboard', path: '/', icon: '🏠' },
  { label: 'Verificar Conformidade', path: '/compliance', icon: '✓' },
  { label: 'Sobre', path: '/about', icon: 'ℹ️' },
];

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Fechar menu quando mudar de rota
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevenir scroll quando menu aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Botão de Toggle - Visível apenas em mobile */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg md:hidden hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="plane"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PlaneIcon isOpen={isOpen} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Overlay (fundo escuro) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer de Navegação */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-2xl z-40 md:hidden"
          >
            <div className="h-full flex flex-col p-6 pt-20">
              {/* Header do Menu */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  ✈️ Navegação
                </h2>
                <div className="h-1 w-16 bg-blue-300 rounded-full" />
              </motion.div>

              {/* Links de Navegação */}
              <ul className="flex-grow space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  
                  return (
                    <motion.li
                      key={link.path}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`
                          flex items-center gap-4 px-4 py-4 rounded-lg
                          transition-all duration-200
                          ${
                            isActive
                              ? 'bg-white/20 text-white font-semibold shadow-lg'
                              : 'text-blue-100 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        <span className="text-2xl">{link.icon}</span>
                        <span className="text-lg">{link.label}</span>
                        
                        {/* Indicador de página ativa */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-2 h-2 bg-white rounded-full"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Footer do Menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-auto pt-6 border-t border-blue-400/30"
              >
                <p className="text-blue-200 text-sm text-center">
                  Embraer Aviation System
                </p>
                <p className="text-blue-300 text-xs text-center mt-1">
                  v2.0 - Mobile First
                </p>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

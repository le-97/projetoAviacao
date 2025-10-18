import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Footer } from "./components/Footer";
import { MobileNav } from "./components/MobileNav";
import { DesktopNav } from "./components/DesktopNav";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { ToastProvider } from "./components/ui/toast";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";

// Lazy load page components for code splitting
const EmbraerDashboard = lazy(() =>
  import("./pages/EmbraerDashboard").then((module) => ({
    default: module.EmbraerDashboard,
  })),
);
const ComplianceChecker = lazy(() =>
  import("./pages/ComplianceChecker").then((module) => ({
    default: module.ComplianceChecker,
  })),
);

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ToastProvider />
        <Router>
          <div className="min-h-screen flex flex-col">
            {/* Skip Links */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Pular para conteúdo principal
            </a>
            <a
              href="#navigation"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:top-16 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Pular para navegação
            </a>

            {/* Navegação Desktop - Sempre visível em telas >= 768px */}
            <DesktopNav />

            {/* Navegação Mobile - Botão de avião visível em telas < 768px */}
            <MobileNav />

            <main
              id="main-content"
              className="flex-grow md:pt-16 pb-safe"
              role="main"
            >
              <AnimatePresence mode="wait">
                <Suspense
                  fallback={
                    <div className="min-h-screen bg-gradient-to-br from-[#0E1C59] via-[#003DA5] to-[#0E1C59] flex items-center justify-center">
                      <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="text-white mt-4">Carregando página...</p>
                      </div>
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<EmbraerDashboard />} />
                    <Route path="/compliance" element={<ComplianceChecker />} />
                  </Routes>
                </Suspense>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;

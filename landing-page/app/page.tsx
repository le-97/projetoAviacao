import Navigation from '../components/Navigation'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import ValueProposition from '../components/ValueProposition'
import AircraftGrid from '../components/AircraftGrid'
import WorldMap from '../components/WorldMap'
import ComplianceSimulator from '../components/ComplianceSimulator'
import AIFeatures from '../components/AIFeatures'
import InteractiveDemo from '../components/InteractiveDemo'
import TestimonialsSection from '../components/TestimonialsSection'
import PricingSection from '../components/PricingSection'
import ContactForm from '../components/ContactForm'
import FAQ from '../components/FAQ'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Value Proposition */}
      <ValueProposition />
      
      {/* Aircraft Grid */}
      <AircraftGrid />
      
      {/* World Map */}
      <WorldMap />
      
      {/* Compliance Simulator (from HTML) */}
      <ComplianceSimulator />
      
      {/* AI Features Section */}
      <AIFeatures />
      
      {/* Interactive Demo */}
      <InteractiveDemo />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Contact Form */}
      <ContactForm />
      
      {/* FAQ Section */}
      <FAQ />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Embraer Certification AI | Certificação Aeronáutica Internacional',
  description: 'Sistema revolucionário de certificação aeronáutica com IA para aeronaves Embraer. Análise inteligente em 60+ países, gap analysis automatizado e predições precisas.',
  keywords: 'certificação aeronave embraer, conformidade aviação internacional, gap analysis aeronáutica, ANAC FAA EASA certificação',
  authors: [{ name: 'Embraer Certification AI' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#003366',
  openGraph: {
    title: 'Embraer Certification AI | Certificação Aeronáutica Internacional',
    description: 'Sistema revolucionário de certificação aeronáutica com IA para aeronaves Embraer',
    url: 'https://embraer-certification.ai',
    siteName: 'Embraer Certification AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Embraer Certification AI - Sistema de certificação aeronáutica',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Embraer Certification AI | Certificação Aeronáutica Internacional',
    description: 'Sistema revolucionário de certificação aeronáutica com IA para aeronaves Embraer',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
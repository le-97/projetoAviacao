import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Copy, 
  Download, 
  Eye, 
  Code, 
  Sparkles, 
  Zap, 
  Timer, 
  Search,
  Play,
  Pause,
  RotateCcw,
  Star,
  Heart,
  TrendingUp,
  BarChart3,
  Clock
} from 'lucide-react'
import { componentEngine, type GeneratedComponent } from '@/lib/componentGenerationEngine'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ShowcaseExample {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  tags: string[]
  complexity: 'simple' | 'medium' | 'complex'
  generated?: GeneratedComponent
  featured?: boolean
  likes: number
  views: number
  generationTime?: number
  confidence?: number
  createdAt: Date
}

// Componente de exemplo para demonstração visual
const ExampleFlightCard = () => (
  <Card className="w-full max-w-sm bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
    <CardHeader>
      <CardTitle className="text-blue-900 flex items-center justify-between">
        TAM 3054
        <Badge className="bg-green-100 text-green-800">No Horário</Badge>
      </CardTitle>
      <CardDescription className="text-blue-700">GRU → SDU</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-blue-600">Partida</p>
          <p className="font-semibold text-blue-900">14:30</p>
        </div>
        <div>
          <p className="text-blue-600">Chegada</p>
          <p className="font-semibold text-blue-900">15:45</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

const ExampleWeatherWidget = () => (
  <Card className="w-full max-w-sm bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
    <CardHeader>
      <CardTitle className="text-sky-900 flex items-center gap-2">
        <div className="w-6 h-6 bg-yellow-400 rounded-full">☀️</div>
        Clima GRU
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xl font-bold text-sky-900">28°</p>
          <p className="text-sky-700 text-xs">Temp</p>
        </div>
        <div>
          <p className="text-xl font-bold text-sky-900">65%</p>
          <p className="text-sky-700 text-xs">Umidade</p>
        </div>
        <div>
          <p className="text-xl font-bold text-sky-900">15km</p>
          <p className="text-sky-700 text-xs">Visib.</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

const ExampleAlertPanel = () => (
  <Card className="w-full max-w-sm bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
    <CardHeader>
      <CardTitle className="text-red-900 flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        Alerta Crítico
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <p className="text-red-800 font-medium">Manutenção Urgente</p>
        <p className="text-red-700 text-sm">Aeronave PT-ABC requer inspeção</p>
        <Badge className="bg-red-100 text-red-800 text-xs">Alta Prioridade</Badge>
      </div>
    </CardContent>
  </Card>
)

const showcaseExamples: ShowcaseExample[] = [
  {
    id: 'flight-ops-dashboard',
    title: 'Dashboard de Operações de Voo',
    description: 'Dashboard completo para monitoramento de operações de voo com atualizações em tempo real',
    prompt: 'Crie um dashboard de operações de voo com atualizações em tempo real',
    category: 'dashboard',
    tags: ['tempo-real', 'operações', 'status', 'monitoramento'],
    complexity: 'complex',
    featured: true,
    likes: 247,
    views: 1834,
    generationTime: 3.2,
    confidence: 94,
    createdAt: new Date(2025, 8, 20, 10, 30),
    generated: {
      id: 'flight-ops-dashboard-gen',
      prompt: 'Crie um dashboard de operações de voo com atualizações em tempo real',
      timestamp: new Date(),
      code: `<DashboardOperacoes />`,
      component: <ExampleFlightCard />
    }
  },
  {
    id: 'atc-center',
    title: 'Centro de Controle de Tráfego Aéreo',
    description: 'Display principal para controladores de tráfego aéreo com visão radar e rastreamento',
    prompt: 'Construa um centro de controle de tráfego aéreo principal',
    category: 'dashboard',
    tags: ['atc', 'radar', 'rastreamento', 'controle'],
    complexity: 'complex',
    featured: true,
    likes: 189,
    views: 1456,
    generationTime: 4.1,
    confidence: 91,
    createdAt: new Date(2025, 8, 20, 9, 15),
    generated: {
      id: 'atc-center-gen',
      prompt: 'Construa um centro de controle de tráfego aéreo principal',
      timestamp: new Date(),
      code: `<CentroATC />`,
      component: <ExampleWeatherWidget />
    }
  },
  {
    id: 'flight-plan-form',
    title: 'Formulário de Plano de Voo',
    description: 'Formulário abrangente para pilotos submeterem planos de voo para aprovação',
    prompt: 'Crie um formulário de submissão de plano de voo',
    category: 'forms',
    tags: ['formulário', 'submissão', 'validação', 'plano-voo'],
    complexity: 'medium',
    featured: false,
    likes: 156,
    views: 892,
    generationTime: 2.7,
    confidence: 88,
    createdAt: new Date(2025, 8, 20, 11, 45),
    generated: {
      id: 'flight-plan-form-gen',
      prompt: 'Crie um formulário de submissão de plano de voo',
      timestamp: new Date(),
      code: `<FormularioPlanoVoo />`,
      component: <ExampleFlightCard />
    }
  },
  {
    id: 'maintenance-report',
    title: 'Relatório de Manutenção',
    description: 'Formulário para reportar problemas de manutenção de aeronaves com níveis de prioridade',
    prompt: 'Construa um formulário de relatório de manutenção de aeronave',
    category: 'forms',
    tags: ['manutenção', 'relatório', 'prioridade', 'aeronave'],
    complexity: 'medium',
    featured: false,
    likes: 134,
    views: 678,
    generationTime: 2.3,
    confidence: 92,
    createdAt: new Date(2025, 8, 20, 13, 20),
    generated: {
      id: 'maintenance-report-gen',
      prompt: 'Construa um formulário de relatório de manutenção de aeronave',
      timestamp: new Date(),
      code: `<RelatorioManutencao />`,
      component: <ExampleAlertPanel />
    }
  },
  {
    id: 'delay-notification',
    title: 'Banner de Atraso de Voo',
    description: 'Banner de notificação para atrasos de voo com indicadores visuais claros',
    prompt: 'Crie um banner de notificação de atraso de voo',
    category: 'components',
    tags: ['notificação', 'atraso', 'alerta', 'visual'],
    complexity: 'simple',
    featured: false,
    likes: 98,
    views: 543,
    generationTime: 1.8,
    confidence: 96,
    createdAt: new Date(2025, 8, 20, 14, 10),
    generated: {
      id: 'delay-notification-gen',
      prompt: 'Construa um banner de notificação para atrasos',
      timestamp: new Date(),
      code: `<BannerAtraso />`,
      component: <ExampleAlertPanel />
    }
  },
  {
    id: 'emergency-alert',
    title: 'Painel de Alerta de Emergência',
    description: 'Painel de alerta crítico de emergência com botões de ação imediata',
    prompt: 'Gere um painel de alerta de emergência',
    category: 'components',
    tags: ['emergência', 'crítico', 'alerta', 'ação'],
    complexity: 'medium',
    featured: true,
    likes: 203,
    views: 1234,
    generationTime: 2.5,
    confidence: 89,
    createdAt: new Date(2025, 8, 20, 8, 45),
    generated: {
      id: 'emergency-alert-gen',
      prompt: 'Gere um painel de alerta de emergência',
      timestamp: new Date(),
      code: `<PainelEmergencia />`,
      component: <ExampleAlertPanel />
    }
  },
  {
    id: 'weather-dashboard',
    title: 'Dashboard de Monitoramento Meteorológico',
    description: 'Monitoramento meteorológico do aeroporto com condições e previsões',
    prompt: 'Projete um dashboard de monitoramento meteorológico para aeroportos',
    category: 'dashboard',
    tags: ['clima', 'monitoramento', 'previsão', 'aeroporto'],
    complexity: 'medium',
    featured: true,
    likes: 176,
    views: 967,
    generationTime: 2.9,
    confidence: 93,
    createdAt: new Date(2025, 8, 20, 12, 30),
    generated: {
      id: 'weather-dashboard-gen',
      prompt: 'Projete um dashboard de monitoramento meteorológico para aeroportos',
      timestamp: new Date(),
      code: `<DashboardClima />`,
      component: <ExampleWeatherWidget />
    }
  },
  {
    id: 'passenger-checkin',
    title: 'Interface de Check-in de Passageiros',
    description: 'Interface de check-in self-service para passageiros',
    prompt: 'Projete uma interface de check-in de passageiros',
    category: 'forms',
    tags: ['passageiro', 'checkin', 'self-service', 'interface'],
    complexity: 'medium',
    featured: false,
    likes: 142,
    views: 789,
    generationTime: 2.6,
    confidence: 87,
    createdAt: new Date(2025, 8, 20, 15, 15),
    generated: {
      id: 'passenger-checkin-gen',
      prompt: 'Projete uma interface de check-in de passageiros',
      timestamp: new Date(),
      code: `<InterfaceCheckin />`,
      component: <ExampleFlightCard />
    }
  },
  {
    id: 'runway-status',
    title: 'Monitor de Status de Pista',
    description: 'Monitor em tempo real do status das pistas do aeroporto',
    prompt: 'Crie um monitor de status de pistas de aeroporto',
    category: 'components',
    tags: ['pista', 'status', 'aeroporto', 'tempo-real'],
    complexity: 'simple',
    featured: false,
    likes: 87,
    views: 456,
    generationTime: 1.9,
    confidence: 91,
    createdAt: new Date(2025, 8, 20, 16, 0),
    generated: {
      id: 'runway-status-gen',
      prompt: 'Crie um monitor de status de pistas de aeroporto',
      timestamp: new Date(),
      code: `<MonitorPista />`,
      component: <ExampleWeatherWidget />
    }
  },
  {
    id: 'crew-scheduling',
    title: 'Sistema de Escalação de Tripulação',
    description: 'Interface para gerenciamento e escalação de tripulações',
    prompt: 'Desenvolva um sistema de escalação de tripulação',
    category: 'dashboard',
    tags: ['tripulação', 'escalação', 'gerenciamento', 'horários'],
    complexity: 'complex',
    featured: false,
    likes: 118,
    views: 723,
    generationTime: 3.7,
    confidence: 86,
    createdAt: new Date(2025, 8, 20, 7, 30),
    generated: {
      id: 'crew-scheduling-gen',
      prompt: 'Desenvolva um sistema de escalação de tripulação',
      timestamp: new Date(),
      code: `<SistemaEscalacao />`,
      component: <ExampleFlightCard />
    }
  }
]

const complexityColors = {
  simple: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  complex: 'bg-red-100 text-red-800 border-red-200'
}

export default function AIUIShowcase() {
  const [examples, setExamples] = useState<ShowcaseExample[]>(showcaseExamples)
  const [selectedExample, setSelectedExample] = useState<ShowcaseExample | null>(null)
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [filter, setFilter] = useState<'all' | 'dashboard' | 'forms' | 'components'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'likes' | 'views' | 'featured'>('featured')
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [generationStats, setGenerationStats] = useState({
    totalGenerated: examples.filter(ex => ex.generated).length,
    averageTime: Math.round(examples.reduce((acc, ex) => acc + (ex.generationTime || 0), 0) / examples.length),
    successRate: 100,
    totalViews: examples.reduce((acc, ex) => acc + ex.views, 0),
    totalLikes: examples.reduce((acc, ex) => acc + ex.likes, 0)
  })

  // Auto-play funcionalidade
  useEffect(() => {
    if (isAutoPlay && filteredExamples.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % filteredExamples.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlay])

  // Filtros e ordenação
  const filteredExamples = examples
    .filter(example => {
      const matchesCategory = filter === 'all' || example.category === filter
      const matchesSearch = example.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           example.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           example.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime()
        case 'likes':
          return b.likes - a.likes
        case 'views':
          return b.views - a.views
        case 'featured':
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.likes - a.likes
        default:
          return 0
      }
    })

  const featuredExamples = examples.filter(ex => ex.featured)
  const currentFeatured = featuredExamples[currentSlide] || featuredExamples[0]

  const generateExample = async (example: ShowcaseExample) => {
    if (example.generated) {
      setSelectedExample(example)
      return
    }

    setIsGenerating(example.id)
    const startTime = Date.now()

    try {
      // Simular geração de componente
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const generated = await componentEngine.generateComponent(example.prompt, example.category)
      
      const updatedExample = { 
        ...example, 
        generated,
        generationTime: (Date.now() - startTime) / 1000,
        views: example.views + 1
      }
      
      setExamples(prev => prev.map(ex => ex.id === example.id ? updatedExample : ex))
      setSelectedExample(updatedExample)

      // Atualizar estatísticas
      setGenerationStats(prev => ({
        totalGenerated: prev.totalGenerated + 1,
        averageTime: Math.round((prev.averageTime * prev.totalGenerated + (Date.now() - startTime)) / (prev.totalGenerated + 1)),
        successRate: 100,
        totalViews: prev.totalViews + 1,
        totalLikes: prev.totalLikes
      }))
    } catch (error) {
      console.error('Falha ao gerar componente:', error)
    } finally {
      setIsGenerating(null)
    }
  }

  const likeExample = (exampleId: string) => {
    setExamples(prev => prev.map(ex => 
      ex.id === exampleId 
        ? { ...ex, likes: ex.likes + 1 }
        : ex
    ))
    setGenerationStats(prev => ({ ...prev, totalLikes: prev.totalLikes + 1 }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Falha ao copiar para clipboard:', error)
    }
  }

  const downloadComponent = (example: ShowcaseExample) => {
    if (!example.generated) return

    const blob = new Blob([example.generated.code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${example.id}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Showcase de UI Gerada por IA
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Explore uma galeria completa de componentes de interface gerados por inteligência artificial 
            especificamente para aplicações de aviação. Cada exemplo demonstra como a IA pode interpretar 
            linguagem natural e criar interfaces profissionais e funcionais.
          </p>
        </div>

        {/* Controles de Filtro e Busca */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar exemplos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                  <SelectTrigger className="w-48">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Em Destaque</SelectItem>
                    <SelectItem value="newest">Mais Recentes</SelectItem>
                    <SelectItem value="likes">Mais Curtidos</SelectItem>
                    <SelectItem value="views">Mais Visualizados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="flex items-center gap-2"
                >
                  {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isAutoPlay ? 'Pausar' : 'Auto-Play'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlide(0)}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reiniciar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Aprimoradas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total de Exemplos</p>
                  <p className="text-2xl font-bold">{generationStats.totalGenerated}</p>
                </div>
                <Zap className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-green-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Tempo Médio</p>
                  <p className="text-2xl font-bold">{generationStats.averageTime}s</p>
                </div>
                <Timer className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold">{generationStats.successRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total de Views</p>
                  <p className="text-2xl font-bold">{generationStats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-pink-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Total de Likes</p>
                  <p className="text-2xl font-bold">{generationStats.totalLikes}</p>
                </div>
                <Heart className="w-8 h-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exemplo em Destaque */}
        {currentFeatured && (
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    {currentFeatured.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-blue-700">
                    {currentFeatured.description}
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge className={complexityColors[currentFeatured.complexity]}>
                      {currentFeatured.complexity === 'simple' ? 'Simples' : 
                       currentFeatured.complexity === 'medium' ? 'Médio' : 'Complexo'}
                    </Badge>
                    <Badge variant="secondary">
                      {currentFeatured.confidence}% confiança
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {currentFeatured.generationTime}s
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {currentFeatured.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {currentFeatured.views}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-900 font-medium mb-2">Prompt usado:</p>
                <p className="text-blue-800 italic">"{currentFeatured.prompt}"</p>
              </div>
              
              <div className="flex justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                {currentFeatured.generated?.component}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                <div className="flex flex-wrap gap-2">
                  {currentFeatured.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => likeExample(currentFeatured.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Curtir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => currentFeatured.generated && copyToClipboard(currentFeatured.generated.code)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos os Exemplos</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboards</TabsTrigger>
            <TabsTrigger value="forms">Formulários</TabsTrigger>
            <TabsTrigger value="components">Componentes</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExamples.map((example) => (
                <Card key={example.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {example.featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          {example.title}
                        </CardTitle>
                        <CardDescription>{example.description}</CardDescription>
                      </div>
                      <Badge className={complexityColors[example.complexity]}>
                        {example.complexity === 'simple' ? 'Simples' : 
                         example.complexity === 'medium' ? 'Médio' : 'Complexo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {example.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Preview do Componente */}
                    <div className="flex justify-center p-4 bg-gray-50 rounded border">
                      <div className="scale-75 origin-center">
                        {example.generated?.component}
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Prompt:</p>
                      <p className="text-sm text-muted-foreground italic">
                        "{example.prompt}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Heart className="w-3 h-3" />
                          {example.likes}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-3 h-3" />
                          {example.views}
                        </div>
                        {example.generationTime && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Timer className="w-3 h-3" />
                            {example.generationTime}s
                          </div>
                        )}
                      </div>
                      {example.confidence && (
                        <Badge variant="secondary" className="text-xs">
                          {example.confidence}%
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => generateExample(example)}
                        disabled={isGenerating === example.id}
                        className="flex-1"
                        size="sm"
                      >
                        {isGenerating === example.id ? (
                          <>
                            <Timer className="mr-2 h-4 w-4 animate-spin" />
                            Gerando...
                          </>
                        ) : example.generated ? (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Gerar
                          </>
                        )}
                      </Button>
                      
                      {example.generated && (
                        <Button
                          onClick={() => downloadComponent(example)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => likeExample(example.id)}
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Generated Component Dialog */}
      {selectedExample && selectedExample.generated && (
        <Dialog 
          open={!!selectedExample} 
          onOpenChange={() => setSelectedExample(null)}
        >
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {selectedExample.title}
              </DialogTitle>
              <DialogDescription>
                Gerado a partir de: "{selectedExample.prompt}"
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant={viewMode === 'code' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('code')}
                >
                  <Code className="h-4 w-4 mr-1" />
                  Código
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(selectedExample.generated!.code)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar Código
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadComponent(selectedExample)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>

              {viewMode === 'preview' ? (
                <ScrollArea className="h-96 border rounded-lg p-4">
                  <div className="flex items-center justify-center min-h-full">
                    {selectedExample.generated.component}
                  </div>
                </ScrollArea>
              ) : (
                <ScrollArea className="h-96">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{selectedExample.generated.code}</code>
                  </pre>
                </ScrollArea>
              )}

              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  Este componente foi gerado em {selectedExample.generationTime || 2.5}s usando processamento 
                  de linguagem natural e algoritmos de correspondência de templates.
                </AlertDescription>
              </Alert>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
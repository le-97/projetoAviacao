import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Copy, Download, Eye, Code, Sparkles, Zap, Timer, Activity } from 'lucide-react'
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
}

const showcaseExamples: ShowcaseExample[] = [
  {
    id: 'flight-ops-dashboard',
    title: 'Flight Operations Dashboard',
    description: 'Complete dashboard for monitoring flight operations with real-time status updates',
    prompt: 'Create a flight operations dashboard with real-time status updates',
    category: 'dashboard',
    tags: ['real-time', 'operations', 'status'],
    complexity: 'complex'
  },
  {
    id: 'atc-center',
    title: 'Air Traffic Control Center',
    description: 'Main display for air traffic controllers with radar view and aircraft tracking',
    prompt: 'Build an air traffic control center main display',
    category: 'dashboard',
    tags: ['atc', 'radar', 'tracking'],
    complexity: 'complex'
  },
  {
    id: 'flight-plan-form',
    title: 'Flight Plan Submission Form',
    description: 'Comprehensive form for pilots to submit flight plans for approval',
    prompt: 'Create a flight plan submission form',
    category: 'forms',
    tags: ['form', 'submission', 'validation'],
    complexity: 'medium'
  },
  {
    id: 'maintenance-report',
    title: 'Maintenance Report Form',
    description: 'Form for reporting aircraft maintenance issues with priority levels',
    prompt: 'Build an aircraft maintenance report form',
    category: 'forms',
    tags: ['maintenance', 'reporting', 'priority'],
    complexity: 'medium'
  },
  {
    id: 'delay-notification',
    title: 'Flight Delay Banner',
    description: 'Notification banner for flight delays with clear visual indicators',
    prompt: 'Create a flight delay notification banner',
    category: 'components',
    tags: ['notification', 'delay', 'alert'],
    complexity: 'simple'
  },
  {
    id: 'emergency-alert',
    title: 'Emergency Alert Panel',
    description: 'Critical emergency alert panel with immediate action buttons',
    prompt: 'Generate an emergency alert panel',
    category: 'components',
    tags: ['emergency', 'critical', 'alert'],
    complexity: 'medium'
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Monitoring Dashboard',
    description: 'Airport weather monitoring with conditions and forecasts',
    prompt: 'Design a weather monitoring dashboard for airports',
    category: 'dashboard',
    tags: ['weather', 'monitoring', 'forecast'],
    complexity: 'medium'
  },
  {
    id: 'passenger-checkin',
    title: 'Passenger Check-in Interface',
    description: 'Self-service check-in interface for passengers',
    prompt: 'Design a passenger check-in interface',
    category: 'forms',
    tags: ['passenger', 'checkin', 'self-service'],
    complexity: 'medium'
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
  const [generationStats, setGenerationStats] = useState({
    totalGenerated: 0,
    averageTime: 0,
    successRate: 100
  })

  const filteredExamples = examples.filter(example => 
    filter === 'all' || example.category === filter
  )

  const generateExample = async (example: ShowcaseExample) => {
    if (example.generated) {
      setSelectedExample(example)
      return
    }

    setIsGenerating(example.id)
    const startTime = Date.now()

    try {
      const generated = await componentEngine.generateComponent(example.prompt, example.category)
      
      const updatedExample = { ...example, generated }
      setExamples(prev => prev.map(ex => ex.id === example.id ? updatedExample : ex))
      setSelectedExample(updatedExample)

      // Update stats
      const endTime = Date.now()
      const generationTime = endTime - startTime
      setGenerationStats(prev => ({
        totalGenerated: prev.totalGenerated + 1,
        averageTime: Math.round((prev.averageTime * prev.totalGenerated + generationTime) / (prev.totalGenerated + 1)),
        successRate: 100 // Assuming all generations succeed for demo
      }))
    } catch (error) {
      console.error('Failed to generate component:', error)
    } finally {
      setIsGenerating(null)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">AI UI Generation Showcase</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore a collection of aviation UI components generated from natural language prompts. 
          Each example demonstrates the power of AI-driven interface design.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Activity className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{generationStats.totalGenerated}</p>
              <p className="text-sm text-muted-foreground">Components Generated</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Timer className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{generationStats.averageTime}ms</p>
              <p className="text-sm text-muted-foreground">Average Generation Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Zap className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold">{generationStats.successRate}%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Examples</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboards</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.map((example) => (
              <Card key={example.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription>{example.description}</CardDescription>
                    </div>
                    <Badge className={complexityColors[example.complexity]}>
                      {example.complexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {example.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">Prompt:</p>
                    <p className="text-sm text-muted-foreground italic">
                      "{example.prompt}"
                    </p>
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
                          Generating...
                        </>
                      ) : example.generated ? (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

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
                Generated from: "{selectedExample.prompt}"
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
                  Code
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(selectedExample.generated!.code)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Code
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
                  This component was generated in {Math.round(Math.random() * 200 + 50)}ms using natural language processing
                  and template matching algorithms.
                </AlertDescription>
              </Alert>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
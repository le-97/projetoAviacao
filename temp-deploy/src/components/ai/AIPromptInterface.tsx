import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Lightbulb, Loader2, Sparkles, Code, Eye } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface GeneratedComponent {
  id: string
  prompt: string
  component: React.ReactNode
  code: string
  timestamp: Date
}

interface AIPromptInterfaceProps {
  onGenerate?: (prompt: string, category: string) => Promise<GeneratedComponent>
  className?: string
}

const predefinedPrompts = {
  dashboard: [
    "Create a flight operations dashboard with real-time status updates",
    "Build an air traffic control center main display",
    "Design a weather monitoring dashboard for airports",
    "Generate a flight scheduling overview panel"
  ],
  forms: [
    "Create a flight plan submission form",
    "Build an aircraft maintenance report form",
    "Design a passenger check-in interface",
    "Generate a runway booking request form"
  ],
  components: [
    "Create a flight delay notification banner",
    "Build an aircraft fuel status indicator",
    "Design a gate assignment display",
    "Generate an emergency alert panel"
  ],
  layouts: [
    "Create a two-column layout for flight departures and arrivals",
    "Build a tabbed interface for different aircraft types",
    "Design a grid layout for multiple airport terminals",
    "Generate a sidebar navigation for aviation systems"
  ]
}

export default function AIPromptInterface({ onGenerate, className }: AIPromptInterfaceProps) {
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('dashboard')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<GeneratedComponent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate a component')
      return
    }

    setError(null)
    setIsGenerating(true)

    try {
      if (onGenerate) {
        const result = await onGenerate(prompt.trim(), category)
        setGeneratedComponents(prev => [result, ...prev])
        setSelectedComponent(result)
        setPrompt('')
      } else {
        // Mock generation for demo
        const mockComponent: GeneratedComponent = {
          id: Date.now().toString(),
          prompt: prompt.trim(),
          component: (
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Generated Component</CardTitle>
                <CardDescription>Generated from: "{prompt.trim()}"</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is a mock generated component based on your prompt.</p>
                <Badge variant="outline" className="mt-2">Category: {category}</Badge>
              </CardContent>
            </Card>
          ),
          code: `// Generated component for: ${prompt.trim()}
export default function GeneratedComponent() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Generated Component</CardTitle>
        <CardDescription>Generated from: "${prompt.trim()}"</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is a mock generated component based on your prompt.</p>
        <Badge variant="outline" className="mt-2">Category: ${category}</Badge>
      </CardContent>
    </Card>
  )
}`,
          timestamp: new Date()
        }
        
        setGeneratedComponents(prev => [mockComponent, ...prev])
        setSelectedComponent(mockComponent)
        setPrompt('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate component')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePredefinedPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Input Panel */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              AI UI Generation
            </CardTitle>
            <CardDescription>
              Generate aviation UI components using natural language prompts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboards</SelectItem>
                  <SelectItem value="forms">Forms</SelectItem>
                  <SelectItem value="components">Components</SelectItem>
                  <SelectItem value="layouts">Layouts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the UI component you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to generate
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Component
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Predefined Prompts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Prompt Suggestions
            </CardTitle>
            <CardDescription>
              Click on any suggestion to use it as your prompt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {Object.entries(predefinedPrompts).map(([cat, prompts]) => (
                  <div key={cat}>
                    <h4 className="font-medium capitalize mb-2">{cat}</h4>
                    <div className="space-y-1">
                      {prompts.map((promptText, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-2 text-sm"
                          onClick={() => handlePredefinedPrompt(promptText)}
                        >
                          {promptText}
                        </Button>
                      ))}
                    </div>
                    {cat !== 'layouts' && <Separator className="mt-3" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Output Panel */}
      <div className="space-y-6">
        {selectedComponent && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Component</CardTitle>
                  <CardDescription>
                    Generated from: "{selectedComponent.prompt}"
                  </CardDescription>
                </div>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'preview' ? (
                <div className="border rounded-lg p-4 bg-muted/10">
                  {selectedComponent.component}
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{selectedComponent.code}</code>
                  </pre>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        )}

        {/* Generated Components History */}
        {generatedComponents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generation History</CardTitle>
              <CardDescription>
                Previously generated components ({generatedComponents.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {generatedComponents.map((component) => (
                    <Button
                      key={component.id}
                      variant={selectedComponent?.id === component.id ? 'default' : 'ghost'}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setSelectedComponent(component)}
                    >
                      <div className="flex-1">
                        <div className="font-medium line-clamp-1">
                          {component.prompt}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {component.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
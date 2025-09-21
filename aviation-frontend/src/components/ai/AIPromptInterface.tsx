import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Plane, 
  Send, 
  Copy, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Code,
  Eye,
  Lightbulb,
  Brain
} from 'lucide-react';
import { generateAviationComponent, type GenerationResult } from '@/lib/componentGenerator';

interface GeneratedComponent {
  id: string;
  prompt: string;
  componentCode: string;
  description: string;
  category: string;
  timestamp: Date;
  status: 'success' | 'error' | 'generating';
  errorMessage?: string;
  actualComponent?: React.ReactElement;
  generationResult?: GenerationResult;
}

interface PromptSuggestion {
  category: string;
  title: string;
  description: string;
  prompt: string;
  complexity: 'simple' | 'medium' | 'complex';
}

const promptSuggestions: PromptSuggestion[] = [
  {
    category: 'Dashboard',
    title: 'Flight Status Dashboard',
    description: 'Create a comprehensive flight status dashboard with real-time updates',
    prompt: 'Create a flight status dashboard showing departures, arrivals, delays, and gate information with color-coded status indicators',
    complexity: 'complex'
  },
  {
    category: 'Forms',
    title: 'Flight Booking Form',
    description: 'Generate a multi-step flight booking form',
    prompt: 'Create a flight booking form with origin/destination selection, date picker, passenger count, and seat class options',
    complexity: 'medium'
  },
  {
    category: 'Cards',
    title: 'Aircraft Info Card',
    description: 'Display aircraft details in a card format',
    prompt: 'Create an aircraft information card showing model, registration, capacity, and current status with an image placeholder',
    complexity: 'simple'
  },
  {
    category: 'Alerts',
    title: 'Weather Alert Panel',
    description: 'Show critical weather alerts for aviation',
    prompt: 'Create a weather alert panel for aviation with severity levels, affected airports, and recommended actions',
    complexity: 'medium'
  },
  {
    category: 'Navigation',
    title: 'Aviation Control Sidebar',
    description: 'Create a navigation sidebar for aviation control systems',
    prompt: 'Create a sidebar navigation for aviation control with sections for flights, aircraft, weather, alerts, and settings',
    complexity: 'medium'
  },
  {
    category: 'Data Visualization',
    title: 'Flight Route Map',
    description: 'Generate a flight route visualization component',
    prompt: 'Create a flight route map component showing departure/arrival airports, flight path, and current aircraft position',
    complexity: 'complex'
  },
  {
    category: 'Maintenance',
    title: 'Aircraft Maintenance Tracker',
    description: 'Track aircraft maintenance schedules and status',
    prompt: 'Create an aircraft maintenance tracker showing scheduled maintenance, overdue items, and maintenance history',
    complexity: 'complex'
  },
  {
    category: 'Emergency',
    title: 'Emergency Response Panel',
    description: 'Emergency response interface for aviation incidents',
    prompt: 'Create an emergency response panel with incident types, priority levels, response teams, and communication tools',
    complexity: 'complex'
  }
];

export default function AIPromptInterface() {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [generatedComponents, setGeneratedComponents] = useState<GeneratedComponent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState<'interface' | 'gallery'>('interface');

  const categories = ['all', ...Array.from(new Set(promptSuggestions.map(s => s.category)))];
  
  const filteredSuggestions = selectedCategory === 'all' 
    ? promptSuggestions 
    : promptSuggestions.filter(s => s.category === selectedCategory);

  const handlePromptGeneration = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const newComponent: GeneratedComponent = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      componentCode: '',
      description: '',
      category: 'Custom',
      timestamp: new Date(),
      status: 'generating'
    };

    setGeneratedComponents(prev => [newComponent, ...prev]);

    try {
      // Use the real component generation system
      const generationResult = generateAviationComponent(prompt.trim());
      
      if (generationResult.success) {
        // Update the component with generated result
        setGeneratedComponents(prev => 
          prev.map(comp => 
            comp.id === newComponent.id 
              ? {
                  ...comp,
                  status: 'success' as const,
                  componentCode: generationResult.code || 'Generated component code',
                  description: `Generated ${generationResult.pattern?.name || 'component'} based on prompt analysis`,
                  category: generationResult.pattern?.category || 'Custom',
                  actualComponent: generationResult.component,
                  generationResult
                }
              : comp
          )
        );
      } else {
        // Handle generation failure
        setGeneratedComponents(prev => 
          prev.map(comp => 
            comp.id === newComponent.id 
              ? {
                  ...comp,
                  status: 'error' as const,
                  errorMessage: generationResult.error || 'Failed to generate component. Please try again.'
                }
              : comp
          )
        );
      }

      setPrompt('');
    } catch (error) {
      setGeneratedComponents(prev => 
        prev.map(comp => 
          comp.id === newComponent.id 
            ? {
                ...comp,
                status: 'error' as const,
                errorMessage: 'Unexpected error during generation. Please try again.'
              }
            : comp
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: PromptSuggestion) => {
    setPrompt(suggestion.prompt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'complex': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Component Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate aviation-specific UI components using natural language prompts powered by shadcn/ui
          </p>
          
          {/* View Toggle */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant={currentView === 'interface' ? 'default' : 'outline'}
              onClick={() => setCurrentView('interface')}
              className="flex items-center space-x-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Generator</span>
            </Button>
            <Button
              variant={currentView === 'gallery' ? 'default' : 'outline'}
              onClick={() => setCurrentView('gallery')}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Gallery ({generatedComponents.length})</span>
            </Button>
          </div>
        </div>

        {currentView === 'interface' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Prompt Interface */}
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Component Generator</span>
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Describe the aviation UI component you want to create
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-sm font-semibold text-gray-700">
                    Natural Language Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Example: Create a flight status card showing flight number, departure/arrival times, gate info, and delay status with color-coded indicators..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-32 text-base"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <p className="text-sm text-gray-500">
                    Be specific about functionality, styling, and data requirements
                  </p>
                </div>

                <Button 
                  onClick={handlePromptGeneration}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Generating Component...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Generate Component</span>
                    </>
                  )}
                </Button>

                {prompt.trim() && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Pro Tip:</strong> Include details about colors, layout, interactive elements, 
                      and specific aviation data you want to display for best results.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Prompt Suggestions */}
            <Card className="border-2 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Prompt Suggestions</span>
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Aviation-specific component ideas to get you started
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Filter by Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredSuggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {suggestion.title}
                          </h4>
                          <Badge className={`text-xs ${getComplexityColor(suggestion.complexity)} border`}>
                            {suggestion.complexity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {suggestion.description}
                        </p>
                        <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                          "{suggestion.prompt}"
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Gallery View */
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Generated Components Gallery</span>
              </CardTitle>
              <CardDescription className="text-green-100">
                View and manage your AI-generated components
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {generatedComponents.length === 0 ? (
                <div className="text-center py-12">
                  <Plane className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Components Generated Yet</h3>
                  <p className="text-gray-500">Start generating components to see them here</p>
                  <Button 
                    onClick={() => setCurrentView('interface')}
                    className="mt-4"
                  >
                    Generate Your First Component
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {generatedComponents.map((component) => (
                      <Card key={component.id} className="border shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center space-x-2">
                              {component.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                              {component.status === 'error' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                              {component.status === 'generating' && <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />}
                              <span>Generated Component</span>
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{component.category}</Badge>
                              <Badge 
                                className={
                                  component.status === 'success' ? 'bg-green-100 text-green-800' :
                                  component.status === 'error' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }
                              >
                                {component.status}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>
                            Created: {component.timestamp.toLocaleString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">Original Prompt:</p>
                            <p className="text-sm text-gray-600 italic">"{component.prompt}"</p>
                          </div>
                          
                          {component.status === 'success' && (
                            <div className="space-y-3">
                              {/* Rendered Component Preview */}
                              {component.actualComponent && (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Eye className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Live Preview:</span>
                                  </div>
                                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                                    {component.actualComponent}
                                  </div>
                                </div>
                              )}
                              
                              {/* Generation Details */}
                              {component.generationResult?.debugInfo && (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Brain className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium text-gray-700">AI Analysis:</span>
                                  </div>
                                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="font-medium">Intent:</span> {component.generationResult.debugInfo.parsedPrompt.intent}
                                      </div>
                                      <div>
                                        <span className="font-medium">Complexity:</span> {component.generationResult.debugInfo.parsedPrompt.complexity}
                                      </div>
                                      <div>
                                        <span className="font-medium">Pattern:</span> {component.generationResult.pattern?.name}
                                      </div>
                                      <div>
                                        <span className="font-medium">Confidence:</span> {Math.round((component.generationResult.confidence || 0) * 100)}%
                                      </div>
                                    </div>
                                    {component.generationResult.debugInfo.parsedPrompt.dataFields.length > 0 && (
                                      <div className="mt-2">
                                        <span className="font-medium">Aviation Entities:</span> {component.generationResult.debugInfo.parsedPrompt.dataFields.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center space-x-2">
                                <Code className="h-4 w-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Generated Code:</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(component.componentCode)}
                                  className="flex items-center space-x-1"
                                >
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </Button>
                              </div>
                              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-40 overflow-y-auto">
                                <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                  {component.componentCode}
                                </code>
                              </pre>
                            </div>
                          )}
                          
                          {component.status === 'error' && (
                            <Alert className="border-red-200 bg-red-50">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-800">
                                {component.errorMessage || 'An error occurred during generation'}
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="p-3 bg-blue-500 rounded-full mx-auto mb-3 w-fit">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{generatedComponents.length}</h3>
            <p className="text-sm text-gray-600">Components Generated</p>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="p-3 bg-green-500 rounded-full mx-auto mb-3 w-fit">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {generatedComponents.filter(c => c.status === 'success').length}
            </h3>
            <p className="text-sm text-gray-600">Successful Generations</p>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="p-3 bg-purple-500 rounded-full mx-auto mb-3 w-fit">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{promptSuggestions.length}</h3>
            <p className="text-sm text-gray-600">Prompt Suggestions</p>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="p-3 bg-orange-500 rounded-full mx-auto mb-3 w-fit">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{categories.length - 1}</h3>
            <p className="text-sm text-gray-600">Component Categories</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
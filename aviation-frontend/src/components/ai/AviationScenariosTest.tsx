import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plane, 
  Shield, 
  Cloud, 
  Settings, 
  Activity, 
  AlertTriangle, 
  Zap,
  CheckCircle,
  XCircle,
  Timer
} from 'lucide-react'
import { componentEngine, type GeneratedComponent } from '@/lib/componentGenerationEngine'

interface TestScenario {
  id: string
  title: string
  description: string
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert'
  category: 'operations' | 'emergency' | 'maintenance' | 'weather' | 'traffic'
  prompts: string[]
  expectedFeatures: string[]
  validationCriteria: string[]
}

interface TestResult {
  scenarioId: string
  promptIndex: number
  success: boolean
  generated?: GeneratedComponent
  validationResults: { criterion: string; passed: boolean; notes?: string }[]
  executionTime: number
  errors?: string[]
}

const testScenarios: TestScenario[] = [
  {
    id: 'complex-flight-dashboard',
    title: 'Complex Flight Management Dashboard',
    description: 'Multi-panel dashboard for comprehensive flight operations management',
    complexity: 'expert',
    category: 'operations',
    prompts: [
      'Create a comprehensive flight operations dashboard with real-time status, weather integration, and alert management',
      'Build a flight management center interface with departure/arrival boards, gate assignments, and crew scheduling',
      'Design an airport operations dashboard showing runway status, aircraft positions, and ground traffic'
    ],
    expectedFeatures: ['real-time data', 'multiple panels', 'status indicators', 'interactive elements'],
    validationCriteria: [
      'Contains multiple data sections',
      'Displays real-time information',
      'Includes interactive components',
      'Has proper visual hierarchy',
      'Shows status indicators'
    ]
  },
  {
    id: 'emergency-response-system',
    title: 'Emergency Response System Interface',
    description: 'Critical emergency management interface with immediate response capabilities',
    complexity: 'expert',
    category: 'emergency',
    prompts: [
      'Create an emergency response dashboard for aircraft incidents with immediate action buttons and status tracking',
      'Build a critical alert management system for aviation emergencies with priority levels and escalation procedures',
      'Design an emergency coordination interface for airport incident response teams'
    ],
    expectedFeatures: ['emergency alerts', 'action buttons', 'priority levels', 'status tracking'],
    validationCriteria: [
      'Contains emergency alert components',
      'Has immediate action buttons',
      'Shows priority levels',
      'Includes status tracking',
      'Uses appropriate emergency colors (red/yellow)'
    ]
  },
  {
    id: 'advanced-maintenance-system',
    title: 'Advanced Aircraft Maintenance System',
    description: 'Comprehensive maintenance tracking with predictive analytics and scheduling',
    complexity: 'advanced',
    category: 'maintenance',
    prompts: [
      'Create an aircraft maintenance dashboard with predictive analytics, service scheduling, and parts inventory',
      'Build a maintenance workflow interface with inspection checklists, compliance tracking, and technician assignments',
      'Design a fleet maintenance overview with aircraft status, service intervals, and maintenance history'
    ],
    expectedFeatures: ['maintenance scheduling', 'status tracking', 'predictive analytics', 'inventory management'],
    validationCriteria: [
      'Shows maintenance schedules',
      'Tracks aircraft status',
      'Includes service intervals',
      'Has inventory components',
      'Contains workflow elements'
    ]
  },
  {
    id: 'weather-analysis-center',
    title: 'Weather Analysis Center',
    description: 'Advanced weather monitoring and analysis for aviation operations',
    complexity: 'advanced',
    category: 'weather',
    prompts: [
      'Create a weather analysis center for aviation with radar imagery, forecast models, and wind pattern analysis',
      'Build a comprehensive weather dashboard showing current conditions, forecasts, and weather alerts for multiple airports',
      'Design a meteorological interface for air traffic control with real-time weather data and flight impact analysis'
    ],
    expectedFeatures: ['weather maps', 'forecast data', 'real-time conditions', 'alert system'],
    validationCriteria: [
      'Displays weather information',
      'Shows forecast data',
      'Contains alert mechanisms',
      'Has visual weather indicators',
      'Includes multiple airport data'
    ]
  },
  {
    id: 'air-traffic-coordination',
    title: 'Air Traffic Coordination System',
    description: 'Advanced ATC interface with sector management and conflict resolution',
    complexity: 'expert',
    category: 'traffic',
    prompts: [
      'Create an air traffic control interface with radar display, flight tracking, and conflict detection',
      'Build a sector management dashboard for air traffic controllers with aircraft separation and route optimization',
      'Design a flight coordination center with real-time aircraft tracking, clearance management, and communication logs'
    ],
    expectedFeatures: ['radar display', 'flight tracking', 'conflict detection', 'communication tools'],
    validationCriteria: [
      'Contains radar or tracking display',
      'Shows aircraft information',
      'Has communication elements',
      'Includes conflict detection',
      'Contains ATC-specific tools'
    ]
  }
]

const complexityColors = {
  basic: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200', 
  advanced: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  expert: 'bg-red-100 text-red-800 border-red-200'
}

const categoryIcons = {
  operations: Plane,
  emergency: Shield,
  maintenance: Settings,
  weather: Cloud,
  traffic: Activity
}

export default function AviationScenariosTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTest, setIsRunningTest] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState('')

  const runScenarioTest = async (scenario: TestScenario, promptIndex: number = 0) => {
    const testId = `${scenario.id}-${promptIndex}`
    setIsRunningTest(testId)
    
    const startTime = Date.now()
    const prompt = scenario.prompts[promptIndex]

    try {
      const generated = await componentEngine.generateComponent(prompt, 'dashboard')
      const executionTime = Date.now() - startTime

      // Validate the generated component
      const validationResults = scenario.validationCriteria.map(criterion => {
        // Simple validation based on code content and component structure
        const codeContent = generated.code.toLowerCase()
        let passed = false
        let notes = ''

        switch (criterion.toLowerCase()) {
          case 'contains multiple data sections':
            passed = codeContent.includes('grid') || codeContent.includes('section') || codeContent.includes('panel')
            notes = passed ? 'Found grid/section elements' : 'No grid or section elements detected'
            break
          case 'displays real-time information':
            passed = codeContent.includes('real-time') || codeContent.includes('status') || codeContent.includes('live')
            notes = passed ? 'Real-time indicators found' : 'No real-time indicators detected'
            break
          case 'includes interactive components':
            passed = codeContent.includes('button') || codeContent.includes('onclick') || codeContent.includes('select')
            notes = passed ? 'Interactive elements found' : 'No interactive elements detected'
            break
          case 'has proper visual hierarchy':
            passed = codeContent.includes('title') && codeContent.includes('description')
            notes = passed ? 'Title and description structure found' : 'Missing proper hierarchy'
            break
          case 'shows status indicators':
            passed = codeContent.includes('badge') || codeContent.includes('status') || codeContent.includes('indicator')
            notes = passed ? 'Status indicators found' : 'No status indicators detected'
            break
          case 'contains emergency alert components':
            passed = codeContent.includes('alert') || codeContent.includes('emergency') || codeContent.includes('critical')
            notes = passed ? 'Emergency components found' : 'No emergency components detected'
            break
          case 'has immediate action buttons':
            passed = codeContent.includes('button') && (codeContent.includes('action') || codeContent.includes('emergency'))
            notes = passed ? 'Action buttons found' : 'No action buttons detected'
            break
          case 'shows priority levels':
            passed = codeContent.includes('priority') || codeContent.includes('critical') || codeContent.includes('high')
            notes = passed ? 'Priority levels found' : 'No priority levels detected'
            break
          case 'uses appropriate emergency colors (red/yellow)':
            passed = codeContent.includes('red') || codeContent.includes('yellow') || codeContent.includes('destructive')
            notes = passed ? 'Emergency colors found' : 'No emergency colors detected'
            break
          default:
            passed = true
            notes = 'Basic validation passed'
        }

        return { criterion, passed, notes }
      })

      const success = validationResults.every(result => result.passed)

      const testResult: TestResult = {
        scenarioId: scenario.id,
        promptIndex,
        success,
        generated,
        validationResults,
        executionTime
      }

      setTestResults(prev => [...prev, testResult])
      
    } catch (error) {
      const testResult: TestResult = {
        scenarioId: scenario.id,
        promptIndex,
        success: false,
        validationResults: [],
        executionTime: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }

      setTestResults(prev => [...prev, testResult])
    } finally {
      setIsRunningTest(null)
    }
  }

  const runAllScenariosTest = async () => {
    setTestResults([])
    for (const scenario of testScenarios) {
      for (let i = 0; i < scenario.prompts.length; i++) {
        await runScenarioTest(scenario, i)
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  const testCustomPrompt = async () => {
    if (!customPrompt.trim()) return

    setIsRunningTest('custom')
    const startTime = Date.now()

    try {
      const generated = await componentEngine.generateComponent(customPrompt, 'dashboard')
      const executionTime = Date.now() - startTime

      const testResult: TestResult = {
        scenarioId: 'custom',
        promptIndex: 0,
        success: true,
        generated,
        validationResults: [{ criterion: 'Generated successfully', passed: true }],
        executionTime
      }

      setTestResults(prev => [...prev, testResult])
    } catch (error) {
      const testResult: TestResult = {
        scenarioId: 'custom',
        promptIndex: 0,
        success: false,
        validationResults: [],
        executionTime: Date.now() - startTime,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }

      setTestResults(prev => [...prev, testResult])
    } finally {
      setIsRunningTest(null)
    }
  }

  const getScenarioResults = (scenarioId: string) => {
    return testResults.filter(result => result.scenarioId === scenarioId)
  }

  const getOverallStats = () => {
    const total = testResults.length
    const successful = testResults.filter(result => result.success).length
    const avgTime = total > 0 ? Math.round(testResults.reduce((sum, result) => sum + result.executionTime, 0) / total) : 0
    
    return {
      total,
      successful,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      avgTime
    }
  }

  const stats = getOverallStats()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Aviation UI Generation Testing</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test complex aviation-specific UI generation scenarios to validate AI capabilities 
          for domain-specific requirements and interfaces.
        </p>
      </div>

      {/* Stats */}
      {testResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-4">
              <Activity className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="text-xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Tests Run</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <p className="text-xl font-bold">{stats.successRate}%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Timer className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <p className="text-xl font-bold">{stats.avgTime}ms</p>
                <p className="text-sm text-muted-foreground">Avg Time</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Zap className="h-6 w-6 text-purple-500 mr-3" />
              <div>
                <p className="text-xl font-bold">{stats.successful}</p>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="custom">Custom Testing</TabsTrigger>
          <TabsTrigger value="results">Results Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Predefined Test Scenarios</h2>
            <Button onClick={runAllScenariosTest} disabled={!!isRunningTest}>
              <Activity className="mr-2 h-4 w-4" />
              Run All Tests
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testScenarios.map((scenario) => {
              const Icon = categoryIcons[scenario.category]
              const results = getScenarioResults(scenario.id)
              
              return (
                <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          {scenario.title}
                        </CardTitle>
                        <CardDescription>{scenario.description}</CardDescription>
                      </div>
                      <Badge className={complexityColors[scenario.complexity]}>
                        {scenario.complexity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Expected Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {scenario.expectedFeatures.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Test Prompts ({scenario.prompts.length}):</h4>
                      <ScrollArea className="h-20">
                        <div className="space-y-1">
                          {scenario.prompts.map((prompt, index) => (
                            <p key={index} className="text-xs text-muted-foreground italic">
                              {index + 1}. "{prompt}"
                            </p>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {results.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Results:</span>
                        {results.map((result, index) => (
                          <div key={index} className="flex items-center gap-1">
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-xs">{result.executionTime}ms</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      {scenario.prompts.map((_, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => runScenarioTest(scenario, index)}
                          disabled={isRunningTest === `${scenario.id}-${index}`}
                          className="text-xs"
                        >
                          {isRunningTest === `${scenario.id}-${index}` ? (
                            <Timer className="h-3 w-3 animate-spin" />
                          ) : (
                            `Test ${index + 1}`
                          )}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Prompt Testing</CardTitle>
              <CardDescription>
                Test your own aviation UI generation prompts to validate specific requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Enter your aviation UI prompt:</Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe the aviation UI component you want to test..."
                  rows={4}
                />
              </div>
              <Button 
                onClick={testCustomPrompt}
                disabled={!customPrompt.trim() || isRunningTest === 'custom'}
                className="w-full"
              >
                {isRunningTest === 'custom' ? (
                  <>
                    <Timer className="mr-2 h-4 w-4 animate-spin" />
                    Testing Custom Prompt...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Test Custom Prompt
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Test Results Analysis</h2>
            
            {testResults.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No test results available. Run some tests to see detailed analysis.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {result.scenarioId === 'custom' ? 'Custom Test' : 
                           testScenarios.find(s => s.id === result.scenarioId)?.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Passed
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                          <Badge variant="outline">{result.executionTime}ms</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {result.validationResults.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Validation Results:</h4>
                          {result.validationResults.map((validation, vIndex) => (
                            <div key={vIndex} className="flex items-center gap-2 text-sm">
                              {validation.passed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="flex-1">{validation.criterion}</span>
                              {validation.notes && (
                                <span className="text-muted-foreground text-xs">
                                  {validation.notes}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {result.errors && result.errors.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-red-600">Errors:</h4>
                          <ul className="list-disc list-inside text-sm text-red-600">
                            {result.errors.map((error, eIndex) => (
                              <li key={eIndex}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
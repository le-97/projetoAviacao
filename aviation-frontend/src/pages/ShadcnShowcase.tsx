import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Plane, Users, Calendar as CalendarIcon, Settings, Zap, Shield, BarChart3, Globe, AlertTriangle, CheckCircle } from 'lucide-react';

const ShadcnShowcase: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(65);
  const [selectedFramework, setSelectedFramework] = useState('');

  const aircraftData = [
    { id: 'AC001', model: 'Boeing 737', status: 'Active', compliance: 98 },
    { id: 'AC002', model: 'Airbus A320', status: 'Maintenance', compliance: 95 },
    { id: 'AC003', model: 'Boeing 787', status: 'Active', compliance: 99 },
    { id: 'AC004', model: 'Airbus A350', status: 'Active', compliance: 97 },
  ];

  const frameworks = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <Plane className="h-10 w-10 text-blue-600" />
              Aviation Control System - shadcn/ui Showcase
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Demonstração completa dos componentes shadcn/ui integrados ao sistema de controle de aviação
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">React 19</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">shadcn/ui</Badge>
              <Badge variant="secondary">Azure Cloud</Badge>
            </div>
          </div>

          {/* Alert Banner */}
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Sistema Operacional</AlertTitle>
            <AlertDescription className="text-green-700">
              Frontend e Backend deployados com sucesso na Azure. Todos os componentes shadcn/ui funcionando perfeitamente.
            </AlertDescription>
          </Alert>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aeronaves Ativas</CardTitle>
                <Plane className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <Progress value={80} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress}%</div>
                <Progress value={progress} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operadores</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <Progress value={60} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <Progress value={94} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Demonstração de Componentes shadcn/ui
              </CardTitle>
              <CardDescription>
                Explore todos os componentes shadcn/ui integrados ao sistema de aviação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="components" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="components">Componentes</TabsTrigger>
                  <TabsTrigger value="data">Dados</TabsTrigger>
                  <TabsTrigger value="forms">Formulários</TabsTrigger>
                  <TabsTrigger value="navigation">Navegação</TabsTrigger>
                </TabsList>

                <TabsContent value="components" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Avatar & Progress Demo */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Avatar & Progress</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="/api/placeholder/40/40" />
                            <AvatarFallback>CP</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Capitão Piloto</p>
                            <Progress value={progress} className="mt-1" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => setProgress(Math.min(100, progress + 10))}
                          >
                            +10%
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setProgress(Math.max(0, progress - 10))}
                          >
                            -10%
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Calendar & Popover Demo */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Calendar & Popover</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date?.toLocaleDateString() || "Selecionar data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Accordion Demo */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Regulamentações e Compliance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Regulamentações ANAC</AccordionTrigger>
                          <AccordionContent>
                            Conformidade com as regulamentações da Agência Nacional de Aviação Civil.
                            Inclui verificações de manutenção, certificações e auditorias regulares.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Padrões Internacionais ICAO</AccordionTrigger>
                          <AccordionContent>
                            Aderência aos padrões da Organização de Aviação Civil Internacional.
                            Procedimentos operacionais e protocolos de segurança globais.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>Certificações de Segurança</AccordionTrigger>
                          <AccordionContent>
                            Monitoramento contínuo de certificações de segurança e treinamentos
                            obrigatórios para toda a tripulação e equipe técnica.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="data" className="space-y-6">
                  {/* Table Demo */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Frota de Aeronaves</CardTitle>
                      <CardDescription>
                        Lista completa das aeronaves com status e compliance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Modelo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Compliance</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {aircraftData.map((aircraft) => (
                            <TableRow key={aircraft.id}>
                              <TableCell className="font-medium">{aircraft.id}</TableCell>
                              <TableCell>{aircraft.model}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={aircraft.status === 'Active' ? 'default' : 'secondary'}
                                >
                                  {aircraft.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={aircraft.compliance} className="w-16" />
                                  <span className="text-sm">{aircraft.compliance}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <Settings className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Configurações da aeronave</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Sheet>
                                    <SheetTrigger asChild>
                                      <Button size="sm">Detalhes</Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                      <SheetHeader>
                                        <SheetTitle>Detalhes: {aircraft.model}</SheetTitle>
                                        <SheetDescription>
                                          Informações completas da aeronave {aircraft.id}
                                        </SheetDescription>
                                      </SheetHeader>
                                      <div className="mt-6 space-y-4">
                                        <div>
                                          <Label>Status Operacional</Label>
                                          <p className="text-sm text-gray-600">{aircraft.status}</p>
                                        </div>
                                        <div>
                                          <Label>Nível de Compliance</Label>
                                          <Progress value={aircraft.compliance} className="mt-2" />
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                          <div className="flex items-center space-x-2">
                                            <Checkbox id="maintenance" />
                                            <Label htmlFor="maintenance">Manutenção em dia</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox id="certification" />
                                            <Label htmlFor="certification">Certificação válida</Label>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox id="crew" />
                                            <Label htmlFor="crew">Tripulação certificada</Label>
                                          </div>
                                        </div>
                                      </div>
                                    </SheetContent>
                                  </Sheet>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="forms" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form Demo */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Cadastro de Operador</CardTitle>
                        <CardDescription>
                          Formulário com componentes shadcn/ui
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input id="name" placeholder="Digite o nome do operador" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="license">Licença</Label>
                          <Input id="license" placeholder="Número da licença" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="framework">Framework Preferido</Label>
                          <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um framework" />
                            </SelectTrigger>
                            <SelectContent>
                              {frameworks.map((framework) => (
                                <SelectItem key={framework.value} value={framework.value}>
                                  {framework.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Observações</Label>
                          <Textarea id="notes" placeholder="Notas adicionais..." />
                        </div>
                        <Button className="w-full">Cadastrar Operador</Button>
                      </CardContent>
                    </Card>

                    {/* Command Demo */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Command Palette</CardTitle>
                        <CardDescription>
                          Busca rápida de aeronaves e operações
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Command className="rounded-lg border shadow-md">
                          <CommandInput placeholder="Buscar aeronaves, operadores..." />
                          <CommandList>
                            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                            <CommandGroup heading="Aeronaves">
                              <CommandItem>
                                <Plane className="mr-2 h-4 w-4" />
                                Boeing 737-800
                              </CommandItem>
                              <CommandItem>
                                <Plane className="mr-2 h-4 w-4" />
                                Airbus A320neo
                              </CommandItem>
                              <CommandItem>
                                <Plane className="mr-2 h-4 w-4" />
                                Boeing 787 Dreamliner
                              </CommandItem>
                            </CommandGroup>
                            <CommandGroup heading="Operações">
                              <CommandItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Verificar Compliance
                              </CommandItem>
                              <CommandItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Gerar Relatório
                              </CommandItem>
                              <CommandItem>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Alertas Ativos
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="navigation" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sistema de Navegação</CardTitle>
                      <CardDescription>
                        Demonstração dos componentes de navegação e layout
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Alert>
                          <Globe className="h-4 w-4" />
                          <AlertTitle>Sistema Online</AlertTitle>
                          <AlertDescription>
                            Conectado aos serviços Azure. Todos os sistemas operacionais.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button variant="default">Dashboard</Button>
                          <Button variant="outline">Aeronaves</Button>
                          <Button variant="secondary">Relatórios</Button>
                          <Button variant="ghost">Configurações</Button>
                          <Button variant="link">Ajuda</Button>
                        </div>
                        
                        <Separator />
                        
                        <div className="text-center py-8">
                          <Zap className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                          <h3 className="text-2xl font-bold mb-2">Sistema Completo</h3>
                          <p className="text-gray-600 mb-4">
                            Frontend React com 24 componentes shadcn/ui integrados
                          </p>
                          <div className="flex justify-center gap-2 flex-wrap">
                            <Badge>Azure Container Apps</Badge>
                            <Badge>Azure Static Web Apps</Badge>
                            <Badge>React 19</Badge>
                            <Badge>TypeScript</Badge>
                            <Badge>TailwindCSS v4</Badge>
                            <Badge>shadcn/ui</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Sistema de Controle de Aviação - Powered by shadcn/ui
                </p>
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <span>Frontend: React 19 + TypeScript</span>
                  <span>•</span>
                  <span>UI: shadcn/ui + TailwindCSS v4</span>
                  <span>•</span>
                  <span>Cloud: Azure</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ShadcnShowcase;
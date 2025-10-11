import { useParams, Link } from 'react-router-dom';
import { useAircraftDetails } from '../hooks/useAircraft';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Gauge,
  Settings,
  Ruler,
  CheckCircle2,
  Sparkles,
  FileText,
  Share2,
  ChevronRight,
} from 'lucide-react';

export default function AircraftDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: aircraft, isLoading } = useAircraftDetails(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-embraer-blue-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!aircraft) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-900">Aeronave não encontrada</h2>
        <p className="text-neutral-600 mt-2">A aeronave solicitada não existe no catálogo.</p>
        <Button asChild className="mt-4">
          <Link to="/aeronaves">Voltar ao Catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-embraer-blue-primary to-embraer-blue-dark overflow-hidden rounded-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-6 h-full flex items-center relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Information */}
            <div className="text-white space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Link to="/aeronaves" className="hover:text-white">Aeronaves</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{aircraft.model}</span>
              </div>
              
              {/* Title */}
              <div>
                <Badge className="bg-white/20 text-white mb-4">
                  {aircraft.categoryLabel}
                </Badge>
                <h1 className="text-5xl font-bold mb-3">Embraer {aircraft.model}</h1>
                <p className="text-xl text-white/80">{aircraft.description}</p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold">{aircraft.specs.capacity.split(' ')[0]}</div>
                  <div className="text-sm text-white/70">Passageiros</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{aircraft.specs.range.split(' ')[0]}</div>
                  <div className="text-sm text-white/70">km Alcance</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{aircraft.specs.speed.split(' ')[1]}</div>
                  <div className="text-sm text-white/70">Velocidade</div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-4">
                <Button size="lg" variant="secondary">
                  <FileText className="mr-2 w-5 h-5" />
                  Download Specs
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  <Share2 className="mr-2 w-5 h-5" />
                  Compartilhar
                </Button>
              </div>
            </div>
            
            {/* Image Placeholder */}
            <div className="relative">
              <div className="w-full h-80 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-32 h-32 text-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Content */}
      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="specs">Especificações</TabsTrigger>
          <TabsTrigger value="regulations">Regulamentações</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="docs">Documentação</TabsTrigger>
        </TabsList>

        {/* Tab: Specifications */}
        <TabsContent value="specs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas Completas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Capacity */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-embraer-blue-primary" />
                    Capacidade
                  </h4>
                  <dl className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <dt className="text-neutral-600">Configuração típica</dt>
                      <dd className="font-semibold">{aircraft.specs.capacity}</dd>
                    </div>
                  </dl>
                </div>

                {/* Performance */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-embraer-blue-primary" />
                    Performance
                  </h4>
                  <dl className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <dt className="text-neutral-600">Velocidade de cruzeiro</dt>
                      <dd className="font-semibold">{aircraft.specs.speed}</dd>
                    </div>
                    {aircraft.specs.maxAltitude && (
                      <div className="flex justify-between border-b pb-2">
                        <dt className="text-neutral-600">Altitude máxima</dt>
                        <dd className="font-semibold">{aircraft.specs.maxAltitude}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-b pb-2">
                      <dt className="text-neutral-600">Alcance máximo</dt>
                      <dd className="font-semibold">{aircraft.specs.range}</dd>
                    </div>
                  </dl>
                </div>

                {/* Dimensions */}
                {aircraft.specs.length && (
                  <div>
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-embraer-blue-primary" />
                      Dimensões
                    </h4>
                    <dl className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <dt className="text-neutral-600">Comprimento</dt>
                        <dd className="font-semibold">{aircraft.specs.length}</dd>
                      </div>
                      {aircraft.specs.wingspan && (
                        <div className="flex justify-between border-b pb-2">
                          <dt className="text-neutral-600">Envergadura</dt>
                          <dd className="font-semibold">{aircraft.specs.wingspan}</dd>
                        </div>
                      )}
                      {aircraft.specs.height && (
                        <div className="flex justify-between border-b pb-2">
                          <dt className="text-neutral-600">Altura</dt>
                          <dd className="font-semibold">{aircraft.specs.height}</dd>
                        </div>
                      )}
                      {aircraft.specs.maxWeight && (
                        <div className="flex justify-between border-b pb-2">
                          <dt className="text-neutral-600">Peso máximo</dt>
                          <dd className="font-semibold">{aircraft.specs.maxWeight}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Engines */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-embraer-blue-primary" />
                    Propulsão
                  </h4>
                  <dl className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <dt className="text-neutral-600">Motores</dt>
                      <dd className="font-semibold">{aircraft.specs.engines}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Technological Features */}
              {aircraft.technologicalFeatures && aircraft.technologicalFeatures.length > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    Destaques Tecnológicos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {aircraft.technologicalFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <div className="font-semibold">{feature.title}</div>
                          <div className="text-sm text-neutral-600">{feature.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs */}
        <TabsContent value="regulations">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-600">Regulamentações aplicáveis serão exibidas aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-600">Status de compliance será exibido aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-neutral-600">Documentação técnica será exibida aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
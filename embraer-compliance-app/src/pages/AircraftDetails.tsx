import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { embraerAircraft } from '@/lib/mockData';
import { getCategoryLabel, getStatusColor, getStatusLabel } from '@/lib/utils';

export function AircraftDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const aircraft = embraerAircraft.find((a) => a.id === id);

  if (!aircraft) {
    return (
      <div className="text-center py-12">
        <h2 className="heading-2 text-muted-foreground">Aeronave não encontrada</h2>
        <Button onClick={() => navigate('/aeronaves')} className="mt-4">
          Voltar ao Catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/aeronaves')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar ao Catálogo
      </Button>

      {/* Hero Section */}
      <Card>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            {aircraft.image ? (
              <div className="w-full h-80 rounded-lg overflow-hidden">
                <img
                  src={aircraft.image}
                  alt={`${aircraft.model} - ${aircraft.manufacturer} aircraft`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-embraer-blue/10 to-embraer-dark/10 rounded-lg flex items-center justify-center">
                <Plane className="w-32 h-32 text-embraer-blue/40" />
              </div>
            )}

            {/* Info */}
            <div className="space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="heading-1 text-embraer-dark">{aircraft.model}</h1>
                    <p className="body-large text-muted-foreground mt-1">
                      {aircraft.manufacturer}
                    </p>
                  </div>
                  <Badge className={getStatusColor(aircraft.status)}>
                    {getStatusLabel(aircraft.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="caption text-muted-foreground">CATEGORIA</p>
                  <p className="body-normal font-semibold mt-1">
                    {getCategoryLabel(aircraft.category)}
                  </p>
                </div>
                {aircraft.capacity.passengers && (
                  <div>
                    <p className="caption text-muted-foreground">PASSAGEIROS</p>
                    <p className="body-normal font-semibold mt-1">
                      {aircraft.capacity.passengers}
                    </p>
                  </div>
                )}
                <div>
                  <p className="caption text-muted-foreground">ALCANCE</p>
                  <p className="body-normal font-semibold mt-1">
                    {aircraft.range.value.toLocaleString()} {aircraft.range.unit}
                  </p>
                </div>
                <div>
                  <p className="caption text-muted-foreground">VELOCIDADE</p>
                  <p className="body-normal font-semibold mt-1">
                    {typeof aircraft.speed.cruise === 'number' && aircraft.speed.cruise < 2
                      ? `Mach ${aircraft.speed.cruise}`
                      : `${aircraft.speed.cruise} ${aircraft.speed.unit}`}
                  </p>
                </div>
              </div>

              {aircraft.features && aircraft.features.length > 0 && (
                <div className="pt-4">
                  <p className="caption text-muted-foreground mb-2">CARACTERÍSTICAS</p>
                  <div className="flex flex-wrap gap-2">
                    {aircraft.features.map((feature, index) => (
                      <Badge key={index} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <Button className="flex-1">
                  Verificar Compliance
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Documentação
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="specs">Especificações</TabsTrigger>
          <TabsTrigger value="regulations">Regulamentações</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="docs">Documentação</TabsTrigger>
        </TabsList>

        <TabsContent value="specs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas Completas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="caption text-muted-foreground">MOTORES</p>
                    <p className="body-normal font-medium mt-1">
                      {aircraft.engines.count}x {aircraft.engines.type}
                    </p>
                  </div>
                  {aircraft.specs.altitude && (
                    <div>
                      <p className="caption text-muted-foreground">ALTITUDE MÁXIMA</p>
                      <p className="body-normal font-medium mt-1">
                        {aircraft.specs.altitude.toLocaleString()} ft
                      </p>
                    </div>
                  )}
                  {aircraft.specs.wingspan && (
                    <div>
                      <p className="caption text-muted-foreground">ENVERGADURA</p>
                      <p className="body-normal font-medium mt-1">
                        {aircraft.specs.wingspan} m
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {aircraft.specs.length && (
                    <div>
                      <p className="caption text-muted-foreground">COMPRIMENTO</p>
                      <p className="body-normal font-medium mt-1">
                        {aircraft.specs.length} m
                      </p>
                    </div>
                  )}
                  {aircraft.specs.mtow && (
                    <div>
                      <p className="caption text-muted-foreground">PESO MÁXIMO DE DECOLAGEM</p>
                      <p className="body-normal font-medium mt-1">
                        {aircraft.specs.mtow.toLocaleString()} kg
                      </p>
                    </div>
                  )}
                  {aircraft.certifications && (
                    <div>
                      <p className="caption text-muted-foreground">CERTIFICAÇÕES</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {aircraft.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Regulamentações Aplicáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Regulamentações específicas para {aircraft.model} serão exibidas aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Histórico de verificações de compliance para {aircraft.model}.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentação Técnica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Documentos técnicos disponíveis para download.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
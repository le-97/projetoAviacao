import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function History() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1 text-embraer-dark">Histórico e Relatórios</h1>
          <p className="body-normal text-muted-foreground mt-2">
            Visualize e exporte verificações anteriores
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Verificações Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tabela de histórico será implementada aqui
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
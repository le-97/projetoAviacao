import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Regulations() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="heading-1 text-embraer-dark">Regulamentações</h1>
        <p className="body-normal text-muted-foreground mt-2">
          Base de conhecimento de regulamentações aeronáuticas
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Buscar regulamentações..."
          className="pl-10"
        />
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Regulamentações Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Lista de regulamentações será implementada aqui
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
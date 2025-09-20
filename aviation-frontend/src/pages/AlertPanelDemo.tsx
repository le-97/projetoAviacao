import { useState } from 'react';
import { AlertPanel, type Alert } from '@/components/aviation';
import { Button } from '@/components/ui/button';

// Mock data for testing
const initialAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'critical',
    status: 'active',
    title: 'Falha no Sistema de Navegação',
    description: 'Perda de comunicação com o sistema de navegação primário da aeronave PR-GTD. Sistema secundário ativado automaticamente.',
    location: 'Aeronave PR-GTD - Em rota GRU-BSB',
    timestamp: '2025-09-20T16:30:00',
    category: 'Sistema Crítico',
    priority: 1
  },
  {
    id: 'alert-002',
    type: 'warning',
    status: 'active',
    title: 'Nível de Combustível Baixo',
    description: 'Aeronave PR-CRG com nível de combustível abaixo de 20%. Reabastecimento necessário antes do próximo voo.',
    location: 'VCP - Hangar 2',
    timestamp: '2025-09-20T15:45:00',
    category: 'Operacional',
    priority: 2
  },
  {
    id: 'alert-003',
    type: 'info',
    status: 'active',
    title: 'Manutenção Programada Hoje',
    description: 'Manutenção preventiva programada para a aeronave PT-MSB às 18:00. Estimativa de 4 horas de duração.',
    location: 'CGH - Hangar 3',
    timestamp: '2025-09-20T14:20:00',
    category: 'Manutenção',
    priority: 3
  },
  {
    id: 'alert-004',
    type: 'warning',
    status: 'acknowledged',
    title: 'Condições Meteorológicas Adversas',
    description: 'Ventos fortes de 45 kt no aeroporto de destino SDU. Possível atraso nos pousos e decolagens.',
    location: 'SDU - Santos Dumont',
    timestamp: '2025-09-20T13:15:00',
    acknowledgedBy: 'Carlos Silva',
    acknowledgedAt: '2025-09-20T13:20:00',
    category: 'Meteorologia',
    priority: 2
  },
  {
    id: 'alert-005',
    type: 'critical',
    status: 'active',
    title: 'Emergência Médica a Bordo',
    description: 'Solicitação de emergência médica no voo GOL 1829. Preparação para pouso de emergência em BSB.',
    location: 'Voo GOL 1829 - Aproximação BSB',
    timestamp: '2025-09-20T16:45:00',
    category: 'Emergência',
    priority: 1
  },
  {
    id: 'alert-006',
    type: 'success',
    status: 'resolved',
    title: 'Sistema de Backup Restaurado',
    description: 'Sistema de backup de comunicações restaurado com sucesso após manutenção corretiva.',
    location: 'Torre de Controle GRU',
    timestamp: '2025-09-20T12:30:00',
    resolvedBy: 'Ana Santos',
    resolvedAt: '2025-09-20T13:45:00',
    category: 'Sistema',
    priority: 3
  },
  {
    id: 'alert-007',
    type: 'warning',
    status: 'active',
    title: 'Pista 09R Temporariamente Fechada',
    description: 'Pista 09R no aeroporto GRU fechada para manutenção do sistema de iluminação. Uso das pistas 09L e 27L apenas.',
    location: 'GRU - Guarulhos',
    timestamp: '2025-09-20T11:00:00',
    category: 'Infraestrutura',
    priority: 2
  },
  {
    id: 'alert-008',
    type: 'info',
    status: 'active',
    title: 'Novo Regulamento ANAC',
    description: 'Nova regulamentação ANAC sobre procedimentos de segurança entra em vigor na próxima semana. Treinamento obrigatório para toda a equipe.',
    location: 'Sistema Corporativo',
    timestamp: '2025-09-20T10:15:00',
    category: 'Regulamentação',
    priority: 4
  }
];

export function AlertPanelDemo() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [showResolved, setShowResolved] = useState(false);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'acknowledged' as const,
              acknowledgedBy: 'Usuário Demo',
              acknowledgedAt: new Date().toISOString()
            }
          : alert
      )
    );
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'resolved' as const,
              resolvedBy: 'Usuário Demo',
              resolvedAt: new Date().toISOString()
            }
          : alert
      )
    );
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  const addNewAlert = () => {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      type: 'warning',
      status: 'active',
      title: 'Novo Alerta de Teste',
      description: 'Este é um alerta de teste criado dinamicamente para demonstrar a funcionalidade.',
      location: 'Sistema de Testes',
      timestamp: new Date().toISOString(),
      category: 'Teste',
      priority: 3
    };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const restoreAlerts = () => {
    setAlerts(initialAlerts);
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalCount = activeAlerts.filter(a => a.type === 'critical').length;
  const warningCount = activeAlerts.filter(a => a.type === 'warning').length;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Alert Panel Components</h1>
        <p className="text-muted-foreground mb-6">
          Demonstração dos componentes de painel de alertas personalizados para aviação
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold mb-3">Controles de Demonstração</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={addNewAlert} variant="outline">
            Adicionar Alerta de Teste
          </Button>
          <Button 
            onClick={() => setShowResolved(!showResolved)} 
            variant="outline"
          >
            {showResolved ? 'Ocultar' : 'Mostrar'} Resolvidos
          </Button>
          <Button onClick={clearAllAlerts} variant="outline">
            Limpar Todos
          </Button>
          <Button onClick={restoreAlerts} variant="outline">
            Restaurar Alertas
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-900">Total de Alertas</h3>
          <p className="text-2xl font-bold text-blue-600">{alerts.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-900">Críticos Ativos</h3>
          <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-900">Avisos Ativos</h3>
          <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-semibold text-gray-900">Ativos Total</h3>
          <p className="text-2xl font-bold text-green-600">{activeAlerts.length}</p>
        </div>
      </div>

      {/* Default Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variant: Default</h2>
        <AlertPanel
          alerts={alerts}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
          onDismiss={handleDismiss}
          variant="default"
          showResolved={showResolved}
          maxHeight="500px"
        />
      </section>

      {/* Compact Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variant: Compact</h2>
        <AlertPanel
          alerts={alerts.slice(0, 3)}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
          variant="compact"
          showResolved={showResolved}
          maxHeight="300px"
        />
      </section>

      {/* Detailed Variant */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variant: Detailed</h2>
        <AlertPanel
          alerts={alerts.slice(0, 2)}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
          onDismiss={handleDismiss}
          variant="detailed"
          showResolved={showResolved}
          maxHeight="400px"
        />
      </section>

      {/* Read-only Panel */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Read-only Panel (No Actions)</h2>
        <AlertPanel
          alerts={alerts.slice(0, 4)}
          variant="default"
          showResolved={showResolved}
          maxHeight="350px"
        />
      </section>
    </div>
  );
}
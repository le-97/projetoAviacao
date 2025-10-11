import { Plane, ClipboardCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceStatusBadge } from '@/components/shared/ComplianceStatusBadge';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { embraerAircraft } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';

// Mock data for charts
const complianceTrend = [
  { month: 'Jan', rate: 92 },
  { month: 'Fev', rate: 94 },
  { month: 'Mar', rate: 91 },
  { month: 'Abr', rate: 95 },
  { month: 'Mai', rate: 96 },
  { month: 'Jun', rate: 94 },
  { month: 'Jul', rate: 97 },
  { month: 'Ago', rate: 98 },
  { month: 'Set', rate: 96 },
  { month: 'Out', rate: 97 },
  { month: 'Nov', rate: 98 },
  { month: 'Dez', rate: 99 },
];

const categoryDistribution = [
  { category: 'Comercial', count: 7, color: '#003DA5' },
  { category: 'Executivo', count: 4, color: '#10B981' },
  { category: 'Defesa', count: 3, color: '#F59E0B' },
  { category: 'Agrícola', count: 1, color: '#EF4444' },
];

const recentChecks = [
  {
    id: '1',
    aircraft: 'E195-E2',
    country: 'Brasil',
    status: 'compliant' as const,
    date: new Date().toISOString(),
  },
  {
    id: '2',
    aircraft: 'Phenom 300E',
    country: 'EUA',
    status: 'compliant' as const,
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    aircraft: 'KC-390',
    country: 'Portugal',
    status: 'partial' as const,
    date: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    aircraft: 'E175',
    country: 'México',
    status: 'pending' as const,
    date: new Date(Date.now() - 259200000).toISOString(),
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="heading-1 text-embraer-dark">Dashboard</h1>
        <p className="body-normal text-muted-foreground mt-2">
          Visão geral do sistema de compliance aeronáutica
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Aeronaves"
          value={embraerAircraft.length}
          icon={Plane}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Checks Pendentes"
          value={12}
          icon={ClipboardCheck}
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard
          title="Taxa de Compliance"
          value="98.5%"
          icon={TrendingUp}
          trend={{ value: 1.2, isPositive: true }}
        />
        <StatCard
          title="Alertas Ativos"
          value={3}
          icon={AlertTriangle}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Compliance (12 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" domain={[85, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Taxa (%)"
                    stroke="#003DA5"
                    strokeWidth={2}
                    dot={{ fill: '#003DA5', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Checks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Verificações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 body-small text-muted-foreground font-semibold">
                    Aeronave
                  </th>
                  <th className="text-left py-3 px-4 body-small text-muted-foreground font-semibold">
                    País
                  </th>
                  <th className="text-left py-3 px-4 body-small text-muted-foreground font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 body-small text-muted-foreground font-semibold">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentChecks.map((check) => (
                  <tr key={check.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 body-normal font-medium">{check.aircraft}</td>
                    <td className="py-3 px-4 body-normal">{check.country}</td>
                    <td className="py-3 px-4">
                      <ComplianceStatusBadge status={check.status} />
                    </td>
                    <td className="py-3 px-4 body-small text-muted-foreground">
                      {formatDate(check.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
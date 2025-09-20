import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TrendData {
  date: string;
  compliant: number;
  warning: number;
  nonCompliant: number;
  total: number;
}

interface TrendChartProps {
  data: TrendData[];
  title?: string;
  height?: number;
  type?: 'line' | 'area';
}

const TrendChart = ({ 
  data, 
  title = "Tendência de Compliance", 
  height = 300,
  type = 'area'
}: TrendChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">
            {format(new Date(label), 'dd MMM yyyy', { locale: ptBR })}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} aeronaves
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (tickItem: string) => {
    return format(new Date(tickItem), 'dd/MM', { locale: ptBR });
  };

  if (type === 'area') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              className="text-sm"
            />
            <YAxis className="text-sm" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="compliant"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.8}
              name="Conforme"
            />
            <Area
              type="monotone"
              dataKey="warning"
              stackId="1"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.8}
              name="Atenção"
            />
            <Area
              type="monotone"
              dataKey="nonCompliant"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.8}
              name="Não Conforme"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxisLabel}
            className="text-sm"
          />
          <YAxis className="text-sm" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="compliant"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            name="Conforme"
          />
          <Line
            type="monotone"
            dataKey="warning"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            name="Atenção"
          />
          <Line
            type="monotone"
            dataKey="nonCompliant"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            name="Não Conforme"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#6b7280"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
            name="Total"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  GitCommit,
  Code2,
  Users,
  FolderGit2,
  Star,
  GitBranch,
} from "lucide-react";

export function GitHubMetrics() {
  const metrics = [
    {
      title: "Total de Commits",
      value: "49",
      description: "Histórico completo",
      icon: GitCommit,
      trend: "+5 esta semana",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Linhas de Código",
      value: "511,810",
      description: "TypeScript + JSON",
      icon: Code2,
      trend: "Alta qualidade",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Contribuidores",
      value: "1",
      description: "Desenvolvedora ativa",
      icon: Users,
      trend: "Desenvolvimento solo",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total de Arquivos",
      value: "11,646",
      description: "Arquivos no projeto",
      icon: FolderGit2,
      trend: "Bem organizado",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Branches",
      value: "2",
      description: "main + desenvolvimento",
      icon: GitBranch,
      trend: "CI/CD ativo",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Qualidade",
      value: "5.0★",
      description: "Código limpo",
      icon: Star,
      trend: "TypeScript strict",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.title}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`text-3xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                <p className="text-sm text-gray-500">{metric.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {metric.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

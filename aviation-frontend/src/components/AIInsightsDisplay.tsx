import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target,
  Lightbulb,
  BarChart3,
  Zap
} from 'lucide-react';
import { AIComplianceReport } from '@/services/ComplianceService';

interface AIInsightsDisplayProps {
  report: AIComplianceReport;
}

export const AIInsightsDisplay: React.FC<AIInsightsDisplayProps> = ({ report }) => {
  const { aiAnalysis, aiEnhanced, successProbability, estimatedTimeline } = report;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'non-compliant': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const confidencePercentage = Math.round((aiAnalysis.classification.confidence || 0) * 100);
  const successPercentage = Math.round(successProbability * 100);

  return (
    <div className=\"space-y-6\">
      {/* Header AI Status */}
      <Card className=\"border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50\">
        <CardHeader className=\"pb-4\">
          <CardTitle className=\"flex items-center gap-2 text-blue-900\">
            {aiEnhanced ? (
              <>
                <Brain className=\"h-5 w-5\" />
                Análise AI Aprimorada
              </>
            ) : (
              <>
                <Zap className=\"h-5 w-5\" />
                Análise Tradicional (Fallback)
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
            <div className=\"flex items-center gap-2\">
              <Target className=\"h-4 w-4 text-blue-600\" />
              <div>
                <p className=\"text-sm text-gray-600\">Confiança da Análise</p>
                <div className=\"flex items-center gap-2\">
                  <Progress value={confidencePercentage} className=\"w-20\" />
                  <span className=\"text-sm font-semibold\">{confidencePercentage}%</span>
                </div>
              </div>
            </div>
            
            <div className=\"flex items-center gap-2\">
              <TrendingUp className=\"h-4 w-4 text-green-600\" />
              <div>
                <p className=\"text-sm text-gray-600\">Probabilidade de Sucesso</p>
                <div className=\"flex items-center gap-2\">
                  <Progress value={successPercentage} className=\"w-20\" />
                  <span className=\"text-sm font-semibold text-green-600\">{successPercentage}%</span>
                </div>
              </div>
            </div>
            
            <div className=\"flex items-center gap-2\">
              <Clock className=\"h-4 w-4 text-orange-600\" />
              <div>
                <p className=\"text-sm text-gray-600\">Estimativa de Tempo</p>
                <p className=\"text-sm font-semibold\">{estimatedTimeline}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Classification */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            <BarChart3 className=\"h-5 w-5\" />
            Classificação AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=\"flex items-center justify-between mb-4\">
            <div className=\"flex items-center gap-3\">
              <Badge className={getStatusColor(aiAnalysis.classification.prediction)}>
                {aiAnalysis.classification.prediction}
              </Badge>
              <span className=\"text-sm text-gray-600\">
                Método: {aiAnalysis.classification.method.replace('_', ' ')}
              </span>
            </div>
            {aiAnalysis.fallback_used && (
              <Badge variant=\"outline\" className=\"text-orange-600 border-orange-300\">
                Fallback Mode
              </Badge>
            )}
          </div>
          
          {aiAnalysis.insights.generated_text && (
            <Alert className=\"bg-blue-50 border-blue-200\">
              <Lightbulb className=\"h-4 w-4\" />
              <AlertDescription className=\"text-blue-800\">
                {aiAnalysis.insights.generated_text}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Risk Factors */}
      {aiAnalysis.insights.risk_factors && aiAnalysis.insights.risk_factors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2 text-red-700\">
              <AlertTriangle className=\"h-5 w-5\" />
              Fatores de Risco Identificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-2\">
              {aiAnalysis.insights.risk_factors.map((factor, index) => (
                <div key={index} className=\"flex items-start gap-2 p-2 bg-red-50 rounded-lg\">
                  <AlertTriangle className=\"h-4 w-4 text-red-500 mt-0.5 flex-shrink-0\" />
                  <span className=\"text-sm text-red-800\">{factor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {aiAnalysis.insights.recommendations && aiAnalysis.insights.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2 text-green-700\">
              <CheckCircle className=\"h-5 w-5\" />
              Recomendações AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-2\">
              {aiAnalysis.insights.recommendations.map((recommendation, index) => (
                <div key={index} className=\"flex items-start gap-2 p-2 bg-green-50 rounded-lg\">
                  <CheckCircle className=\"h-4 w-4 text-green-500 mt-0.5 flex-shrink-0\" />
                  <span className=\"text-sm text-green-800\">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Similarity Analysis */}
      {aiAnalysis.similarities && aiAnalysis.similarities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <TrendingUp className=\"h-5 w-5\" />
              Análise de Similaridade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-4\">
              {aiAnalysis.similarities.slice(0, 3).map((similarity, index) => (
                <div key={index} className=\"border rounded-lg p-4 bg-gray-50\">
                  <div className=\"flex items-center justify-between mb-2\">
                    <h4 className=\"font-medium text-sm\">{similarity.pattern}</h4>
                    <Badge variant=\"outline\">
                      {Math.round(similarity.similarity * 100)}% similar
                    </Badge>
                  </div>
                  <div className=\"grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600\">
                    <div>
                      <span className=\"font-medium\">Processo:</span> {similarity.typical_process}
                    </div>
                    <div>
                      <span className=\"font-medium\">Timeline:</span> {similarity.timeline}
                    </div>
                    <div>
                      <span className=\"font-medium\">Taxa de Sucesso:</span> {Math.round(similarity.success_rate * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model Information */}
      {aiEnhanced && (
        <Card className=\"bg-gray-50\">
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2 text-gray-700\">
              <Brain className=\"h-5 w-5\" />
              Modelos AI Utilizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4 text-xs\">
              <div>
                <p className=\"font-medium text-gray-600\">Classificador</p>
                <p className=\"text-gray-800\">{aiAnalysis.model_info.compliance_classifier}</p>
              </div>
              <div>
                <p className=\"font-medium text-gray-600\">Similaridade</p>
                <p className=\"text-gray-800\">{aiAnalysis.model_info.similarity_model}</p>
              </div>
              <div>
                <p className=\"font-medium text-gray-600\">Insights</p>
                <p className=\"text-gray-800\">{aiAnalysis.model_info.insight_generator}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error/Fallback Notice */}
      {report.error && (
        <Alert className=\"border-yellow-300 bg-yellow-50\">
          <AlertTriangle className=\"h-4 w-4\" />
          <AlertDescription className=\"text-yellow-800\">
            <strong>Aviso:</strong> {report.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
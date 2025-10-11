import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function ComplianceCheck() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="heading-1 text-embraer-dark">Verificação de Compliance</h1>
        <p className="body-normal text-muted-foreground mt-2">
          Verifique a conformidade regulatória em 3 etapas simples
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Etapa {step} de {totalSteps}</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && 'Selecione a Aeronave'}
            {step === 2 && 'Selecione os Países'}
            {step === 3 && 'Tipo de Voo'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-96 flex items-center justify-center">
            <p className="text-muted-foreground">
              Formulário de verificação será implementado aqui
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Anterior
            </Button>
            <Button
              onClick={() => setStep(Math.min(totalSteps, step + 1))}
              disabled={step === totalSteps}
            >
              Próximo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
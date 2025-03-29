import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

export default function ProbabilityAnalysis({ probabilidades, proximas_velas }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Probabilidades por Padrão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {probabilidades?.map((prob, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {prob.tipo.replace(/_/g, ' ')}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={prob.probabilidade > 70 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                  >
                    {prob.probabilidade}%
                  </Badge>
                </div>
                <Progress 
                  value={prob.probabilidade} 
                  className="h-2"
                  indicatorClassName={prob.probabilidade > 70 ? 'bg-green-500' : 'bg-blue-500'}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Previsão Próximas Velas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {proximas_velas?.map((vela, idx) => (
              <div key={idx} className="flex-shrink-0 w-36 p-4 bg-gray-50 rounded-lg border">
                <div className="text-center mb-3">
                  <span className="text-sm text-gray-500">Vela {vela.numero_vela}</span>
                  <Badge 
                    className={`mt-1 ${
                      vela.tendencia_dominante === 'ALTA' 
                        ? 'bg-green-100 text-green-800' 
                        : vela.tendencia_dominante === 'BAIXA'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {vela.tendencia_dominante}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Alta</span>
                      <span>{vela.prob_alta}%</span>
                    </div>
                    <Progress value={vela.prob_alta} className="h-1" indicatorClassName="bg-green-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Baixa</span>
                      <span>{vela.prob_baixa}%</span>
                    </div>
                    <Progress value={vela.prob_baixa} className="h-1" indicatorClassName="bg-red-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
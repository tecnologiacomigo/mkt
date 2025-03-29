import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowUp, ArrowDown, Sparkles, Timer, TrendingUp, TrendingDown } from "lucide-react";

export default function TimeframeAnalysis({ timeframes }) {
  if (!timeframes) return null;

  const getTimeframeRecommendation = (tf) => {
    const data = timeframes[tf];
    if (data.probabilidade >= 80) return { text: "Altamente Recomendado", color: "bg-green-100 text-green-800 border-green-200" };
    if (data.probabilidade >= 65) return { text: "Recomendado", color: "bg-blue-100 text-blue-800 border-blue-200" };
    if (data.probabilidade >= 50) return { text: "Neutro", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    return { text: "Não Recomendado", color: "bg-red-100 text-red-800 border-red-200" };
  };

  const bestTimeframe = Object.entries(timeframes).reduce((best, [tf, data]) => {
    return (!best || data.probabilidade > timeframes[best].probabilidade) ? tf : best;
  }, null);

  return (
    <div className="space-y-6">
      {/* Best Timeframe Recommendation */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Timer className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold">Melhor Timeframe</h2>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
              {bestTimeframe}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(timeframes).map(([tf, data]) => (
              <div 
                key={tf}
                className={`rounded-lg p-4 ${
                  tf === bestTimeframe ? 'bg-white shadow-md ring-2 ring-blue-500' : 'bg-white/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{tf}</span>
                  <Badge className={getTimeframeRecommendation(tf).color}>
                    {data.probabilidade}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-green-700">
                      <TrendingUp className="w-4 h-4" />
                      Alta
                    </span>
                    <span>{data.prob_alta}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-red-700">
                      <TrendingDown className="w-4 h-4" />
                      Baixa
                    </span>
                    <span>{data.prob_baixa}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis per Timeframe */}
      {Object.entries(timeframes).map(([tf, data]) => (
        <Card key={tf} className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>Análise {tf}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getTimeframeRecommendation(tf).color}>
                  {getTimeframeRecommendation(tf).text}
                </Badge>
                <Badge variant="outline" className="bg-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {data.probabilidade}%
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Probability Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-1 font-medium text-green-700">
                    <ArrowUp className="w-4 h-4" />
                    Probabilidade de Alta
                  </span>
                  <span className="font-semibold">{data.prob_alta}%</span>
                </div>
                <Progress 
                  value={data.prob_alta} 
                  className="h-3"
                  indicatorClassName="bg-gradient-to-r from-green-400 to-green-600"
                />
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-1 font-medium text-red-700">
                    <ArrowDown className="w-4 h-4" />
                    Probabilidade de Baixa
                  </span>
                  <span className="font-semibold">{data.prob_baixa}%</span>
                </div>
                <Progress 
                  value={data.prob_baixa} 
                  className="h-3"
                  indicatorClassName="bg-gradient-to-r from-red-400 to-red-600"
                />
              </div>
            </div>

            {/* Candle Predictions */}
            <div>
              <h3 className="text-md font-medium mb-4 flex items-center gap-2">
                <Timer className="w-4 h-4 text-blue-500" />
                Previsão das Próximas 5 Velas
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {data.proximas_velas?.map((vela, idx) => (
                  <div key={idx} className="relative">
                    <div 
                      className={`h-40 rounded-lg border relative overflow-hidden ${
                        vela.tendencia === 'ALTA' 
                          ? 'bg-white border-green-200' 
                          : 'bg-white border-red-200'
                      }`}
                    >
                      <div 
                        className={`absolute bottom-0 left-0 right-0 h-${Math.round(vela.probabilidade)}% transition-all duration-300 ${
                          vela.tendencia === 'ALTA'
                            ? 'bg-gradient-to-t from-green-100 to-green-50'
                            : 'bg-gradient-to-t from-red-100 to-red-50'
                        }`}
                      />
                      
                      <div className="relative p-3 h-full flex flex-col justify-between">
                        <div className="text-center">
                          <Badge variant="outline" className="bg-white">
                            Vela {idx + 1}
                          </Badge>
                        </div>
                        
                        <div className="text-center">
                          {vela.tendencia === 'ALTA' ? (
                            <ArrowUp className={`w-6 h-6 mx-auto ${
                              vela.probabilidade > 65 ? 'text-green-600' : 'text-green-400'
                            }`} />
                          ) : (
                            <ArrowDown className={`w-6 h-6 mx-auto ${
                              vela.probabilidade > 65 ? 'text-red-600' : 'text-red-400'
                            }`} />
                          )}
                        </div>
                        
                        <div className="text-center">
                          <Badge className={`
                            ${vela.tendencia === 'ALTA'
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                            }
                          `}>
                            {vela.probabilidade}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
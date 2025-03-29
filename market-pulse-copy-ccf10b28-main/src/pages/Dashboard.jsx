
import React, { useState, useEffect } from 'react';
import { TradingSignal } from '@/api/entities';
import { LLMConfig } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import { Image as ImageIcon, Bell, Upload, Loader2, X, ArrowUp, ArrowDown, Sparkles, AreaChart, Clock, Zap, Brain } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SignalHeader from '../components/trading/SignalHeader';
import PricePoints from '../components/trading/PricePoints';
import MarketPressure from '../components/trading/MarketPressure';
import PatternIdentified from '../components/trading/PatternIdentified';
import Scenarios from '../components/trading/Scenarios';
import ProbabilityAnalysis from '../components/trading/ProbabilityAnalysis';
import TimeframeAnalysis from '../components/trading/TimeframeAnalysis';
import Timer from '../components/trading/Timer';
import ExecuteTradeExplanation from '../components/trading/ExecuteTradeExplanation';
import QuotexIntegration from '../components/trading/QuotexIntegration';

function Dashboard() {
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("chart");
  const [analysisType, setAnalysisType] = useState("simple");
  const dragCounter = React.useRef(0);

  useEffect(() => {
    loadLatestSignal();
    const interval = setInterval(loadLatestSignal, 30000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const loadLatestSignal = async () => {
    try {
      const signals = await TradingSignal.list('-created_date', 1);
      if (signals.length > 0) {
        const newSignal = signals[0];
        if (signal?.id !== newSignal.id) {
          setSignal(newSignal);
          toast({
            title: "Novo Sinal!",
            description: newSignal.frase_operacional,
            icon: <Bell className="w-4 h-4" />,
          });
        }
      }
    } catch (error) {
      console.error("Error loading signal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        handleFile(droppedFile);
      }
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      setFile(file);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          handleFile(file);
          break;
        }
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime); 
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.2); 
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Sound playback failed:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });

      let modelEndpoint, modelName;
      
      if (analysisType === "simple") {
        modelEndpoint = "openai";
        modelName = "gpt-4o-2024-08-06";
      } else {
        modelEndpoint = "openai";
        modelName = "gpt-4.5-preview-2025-02-27";
      }

      const promptDetail = analysisType === "advanced" 
        ? `Forneça uma análise extremamente detalhada e profunda do gráfico, com múltiplas perspectivas e alta precisão nas probabilidades.`
        : `Forneça uma análise objetiva e prática do gráfico.`;

      const result = await InvokeLLM({
        prompt: `Analise este gráfico de trading e forneça uma análise ${analysisType === "advanced" ? "avançada" : "simples"}:

1. Identifique o par de moedas mostrado no gráfico (se visível)
2. Identifique o padrão gráfico presente (como Engolfo, Pin Bar, Inside Bar, etc.)
3. Determine se é uma operação de COMPRA ou VENDA
4. Forneça uma explicação detalhada do padrão identificado, o que ele significa e porque é importante
5. Analise a pressão compradora e vendedora
6. Calcule a probabilidade de sucesso para diferentes timeframes (M1, M2, M5, M15)
7. Projete a tendência das próximas 5 velas para cada timeframe
8. Defina pontos de entrada, stop e alvo
9. Determine o melhor tempo de expiração

${promptDetail}

Use o endpoint ${modelEndpoint} com o modelo ${modelName}.`,
        response_json_schema: TradingSignal.schema(),
        file_urls: [file_url]
      });

      const signalData = {
        ...result,
        chart_image_url: file_url
      };
      
      await TradingSignal.create(signalData);
      await loadLatestSignal();
      removeFile();
      
      playNotificationSound();
      
      toast({
        title: "Sucesso!",
        description: `Análise ${analysisType === "advanced" ? "avançada" : "simples"} concluída com sucesso`,
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erro",
        description: "Erro ao analisar o gráfico",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
          </div>
          <p className="mt-4 text-blue-800 font-medium">Carregando análise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <Card className="border-none shadow-lg bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="w-5 h-5 text-blue-500" />
                Análise de Gráfico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium mb-1 text-gray-700">Tipo de Análise:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={analysisType === "simple" ? "default" : "outline"}
                      onClick={() => setAnalysisType("simple")}
                      className={`flex items-center gap-2 ${analysisType === "simple" ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    >
                      <Zap className="w-4 h-4" />
                      Simples
                    </Button>
                    <Button
                      variant={analysisType === "advanced" ? "default" : "outline"}
                      onClick={() => setAnalysisType("advanced")}
                      className={`flex items-center gap-2 ${analysisType === "advanced" ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    >
                      <Brain className="w-4 h-4" />
                      Avançada
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {analysisType === "simple" 
                      ? "Análise básica com gpt-4o (mais rápida)" 
                      : "Análise aprofundada com gpt-4.5 (mais precisa)"}
                  </div>
                </div>
                
                <div 
                  onDragEnter={handleDragIn}
                  onDragLeave={handleDragOut}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : file
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {file ? (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 z-10"
                        onClick={removeFile}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-32 object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="p-4 text-center h-full flex flex-col items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Arraste ou cole um print
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 justify-center">
                  <Button 
                    onClick={handleUpload} 
                    disabled={!file || isUploading}
                    className={`w-full ${
                      analysisType === "simple" 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        {analysisType === "simple" ? (
                          <Zap className="w-4 h-4 mr-2" />
                        ) : (
                          <Brain className="w-4 h-4 mr-2" />
                        )}
                        Analisar Gráfico
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-center text-gray-500">
                    {isUploading ? (
                      <Clock className="w-3 h-3 inline mr-1" /> 
                    ) : null}
                    {isUploading ? (
                      analysisType === "simple" 
                        ? "Tempo estimado: 10-15 segundos" 
                        : "Tempo estimado: 20-30 segundos"
                    ) : "Paste (CTRL+V) ou arraste um print"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {signal && (
            <>
              <Card className="border-none shadow-lg bg-gradient-to-br from-blue-700 to-blue-900 text-white overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
                    <div className="md:col-span-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-500/30 text-white border-blue-400/30 py-1 px-3">
                            {signal.moeda || "FOREX"}
                          </Badge>
                          <Badge className={`
                            ${signal.acao === "COMPRA" 
                              ? "bg-green-500/30 text-white border-green-400/30" 
                              : "bg-red-500/30 text-white border-red-400/30"
                            } py-1 px-3`}
                          >
                            {signal.acao === "COMPRA" ? (
                              <ArrowUp className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowDown className="w-4 h-4 mr-1" />
                            )}
                            {signal.acao}
                          </Badge>
                          <Timer expiracao={signal.expiracao} />
                        </div>
                        <div className="flex items-baseline gap-3 mb-3">
                          <h2 className="text-2xl font-bold text-blue-100">ENTRE AGORA EM:</h2>
                          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                            {signal.entrada_ideal}
                          </h1>
                        </div>
                        <p className="text-blue-100 text-sm md:text-base">
                          {signal.frase_operacional}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2 justify-between text-sm">
                      <div className="bg-white/10 rounded-lg p-3 flex-1">
                        <div className="text-blue-100">Stop Loss</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-bold text-white text-lg">{signal.stop}</span>
                          <Badge className="bg-red-500/30 text-white border-red-400/30">
                            {Math.abs(((parseFloat(signal.stop) - parseFloat(signal.entrada_ideal)) / parseFloat(signal.entrada_ideal)) * 100).toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-3 flex-1">
                        <div className="text-blue-100">Take Profit</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="font-bold text-white text-lg">{signal.alvo}</span>
                          <Badge className="bg-green-500/30 text-white border-green-400/30">
                            {Math.abs(((parseFloat(signal.alvo) - parseFloat(signal.entrada_ideal)) / parseFloat(signal.entrada_ideal)) * 100).toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TimeframeAnalysis timeframes={signal.timeframes} />
                </div>

                <div className="space-y-6">
                  <Card className="border-none shadow-lg">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <AreaChart className="w-5 h-5 text-blue-500" />
                        Gráfico
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      {signal.chart_image_url ? (
                        <img 
                          src={signal.chart_image_url} 
                          alt="Trading Chart" 
                          className="w-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="p-6 flex flex-col items-center justify-center text-gray-500">
                          <ImageIcon className="w-8 h-8 mb-2" />
                          <p>Imagem não disponível</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end pt-2 pb-4 px-4">
                      <Button variant="outline" size="sm">
                        Ver em tela cheia
                      </Button>
                    </CardFooter>
                  </Card>

                  <PatternIdentified padrao={signal.padrao_identificado} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MarketPressure pressao={signal.pressao_mercado} />
                <Scenarios cenarios={signal.cenarios} />
              </div>
              
              <QuotexIntegration signal={signal} />
              
              <ExecuteTradeExplanation />
            </>
          )}
          
          {!signal && (
            <Card className="border-none shadow-lg">
              <CardContent className="p-12 flex flex-col items-center justify-center text-gray-500">
                <AreaChart className="w-12 h-12 mb-2" />
                <p className="text-lg font-medium">Nenhuma análise disponível</p>
                <p className="text-sm mt-2">Faça upload de um gráfico para iniciar</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

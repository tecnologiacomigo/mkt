import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Code, ExternalLink, Github } from "lucide-react";

export default function ExecuteTradeExplanation() {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code className="w-5 h-5 text-blue-500" />
          Integração com PyQuoteX
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="info" className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Sobre a integração com PyQuoteX</AlertTitle>
          <AlertDescription className="text-blue-700">
            O PyQuoteX é uma biblioteca Python para automação de operações. Devido às limitações de segurança dos navegadores,
            a execução direta de operações de trading não é possível através desta aplicação web.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 mt-4">
          <h3 className="font-medium text-lg">Como conectar com PyQuoteX:</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline" className="mr-1">Passo 1</Badge>
              Instale o PyQuoteX localmente
            </h4>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
              git clone https://github.com/tecnologiacomigo/pyquotex.git<br />
              cd pyquotex<br />
              pip install -r requirements.txt
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Isso clonará o repositório e instalará todas as dependências necessárias.
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline" className="mr-1">Passo 2</Badge>
              Configure suas credenciais
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              Edite o arquivo <code className="bg-gray-100 px-1 py-0.5 rounded">config.py</code> com suas credenciais de corretora.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline" className="mr-1">Passo 3</Badge>
              Execute operações manualmente
            </h4>
            <p className="text-sm text-gray-600">
              Você pode executar operações utilizando os sinais gerados por esta aplicação:
            </p>
            <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm mt-2 overflow-x-auto">
              python execute_trade.py --symbol EUR/USD --action BUY --entry 1.0525 --stop 1.0500 --target 1.0575 --expiry 00:15
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline" className="mr-1">Recomendação</Badge>
              Desenvolvimento futuro
            </h4>
            <p className="text-sm text-gray-600">
              Para integração completa, seria necessário desenvolver uma API REST para o PyQuoteX e um backend para esta aplicação web
              que possa se comunicar com o serviço PyQuoteX.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="gap-2" onClick={() => window.open("https://github.com/tecnologiacomigo/pyquotex", "_blank")}>
            <Github className="h-4 w-4" />
            Ver no Github
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => window.open("https://github.com/tecnologiacomigo/pyquotex/blob/master/README.md", "_blank")}>
            <ExternalLink className="h-4 w-4" />
            Ver Documentação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
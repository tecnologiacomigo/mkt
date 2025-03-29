import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { InvokeLLM } from "@/api/integrations";
import { QuotexCredentials } from '@/api/entities';
import { Loader2, AlertCircle, DollarSign, Lock, Unlock, ArrowUp, ArrowDown, RefreshCcw } from "lucide-react";

export default function QuotexIntegration({ signal }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [amount, setAmount] = useState(10);
  const [mode, setMode] = useState('PRACTICE'); // PRACTICE or REAL
  const [error, setError] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedCreds = await QuotexCredentials.list('-created_date', 1);
      if (savedCreds.length > 0 && savedCreds[0].active) {
        setCredentials({
          email: savedCreds[0].email,
          password: savedCreds[0].password
        });
        await handleConnect();
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await InvokeLLM({
        prompt: `
        Execute o seguinte código Python e retorne o resultado:
        
        from quotexapi.stable_api import Quotex
        
        cliente = Quotex(
            email="${credentials.email}",
            password="${credentials.password}",
            lang="pt"
        )
        
        check_connect, mensagem = await cliente.connect()
        balance = await cliente.get_balance() if check_connect else None
        
        return {"success": check_connect, "balance": balance, "message": mensagem}
        `,
        response_json_schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            balance: { type: "number" },
            message: { type: "string" }
          }
        }
      });

      if (result.success) {
        setIsAuthenticated(true);
        setBalance(result.balance);
        
        // Save credentials if connection successful
        await QuotexCredentials.create({
          email: credentials.email,
          password: credentials.password,
          active: true
        });

      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Erro ao conectar com a Quotex");
      console.error("Connection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeTrade = async () => {
    if (!isAuthenticated || !signal) return;
    
    setOperationStatus("loading");
    
    try {
      const result = await InvokeLLM({
        prompt: `
        Execute a seguinte operação no Quotex:
        
        await cliente.change_account("${mode}")
        
        success = await cliente.buy(
            price=${amount},
            asset="${signal.moeda}",
            direction="${signal.acao === "COMPRA" ? "call" : "put"}",
            expired=${signal.expiracao.split(":").reduce((acc, time) => (60 * acc) + +time, 0)}
        )
        
        return {"success": success, "message": "Operação realizada com sucesso" if success else "Falha na operação"}
        `,
        response_json_schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" }
          }
        }
      });

      if (result.success) {
        setOperationStatus("success");
        setTimeout(() => setOperationStatus(null), 3000);
      } else {
        setOperationStatus("error");
        setError(result.message);
      }
    } catch (error) {
      setOperationStatus("error");
      setError("Erro ao executar operação");
      console.error("Trade execution error:", error);
    }
  };

  const handleDisconnect = async () => {
    setIsAuthenticated(false);
    setBalance(null);
    const savedCreds = await QuotexCredentials.list('-created_date', 1);
    if (savedCreds.length > 0) {
      await QuotexCredentials.update(savedCreds[0].id, { active: false });
    }
  };

  if (!signal) return null;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            Executar Operação
          </div>
          {isAuthenticated && (
            <Badge className="bg-green-100 text-green-800">
              Saldo: ${balance?.toFixed(2)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isAuthenticated ? (
          <div className="space-y-4">
            <Alert variant="info" className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Autenticação Necessária</AlertTitle>
              <AlertDescription className="text-blue-700">
                Entre com suas credenciais da Quotex para executar operações.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
                  placeholder="seu@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                className="w-full" 
                onClick={handleConnect}
                disabled={isLoading || !credentials.email || !credentials.password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Conectar
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label>Modo:</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant={mode === 'PRACTICE' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('PRACTICE')}
                  >
                    Demo
                  </Button>
                  <Button
                    variant={mode === 'REAL' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode('REAL')}
                  >
                    Real
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDisconnect}>
                <Unlock className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Valor da Operação ($)</Label>
              <div className="flex gap-2">
                {[5, 10, 25, 50, 100].map((value) => (
                  <Button
                    key={value}
                    variant={amount === value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAmount(value)}
                  >
                    ${value}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={executeTrade}
              disabled={operationStatus === 'loading'}
            >
              {operationStatus === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Executando...
                </>
              ) : operationStatus === 'success' ? (
                <>
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Operação Realizada!
                </>
              ) : operationStatus === 'error' ? (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Tentar Novamente
                </>
              ) : (
                <>
                  {signal.acao === "COMPRA" ? (
                    <ArrowUp className="w-4 h-4 mr-2" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-2" />
                  )}
                  Executar {signal.acao}
                </>
              )}
            </Button>

            {error && operationStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
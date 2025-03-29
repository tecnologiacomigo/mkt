import React, { useState, useEffect } from 'react';
import { LLMConfig } from '@/api/entities';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function Admin() {
  const [configs, setConfigs] = useState([]);
  const [newConfig, setNewConfig] = useState({
    name: '',
    api_endpoint: '',
    model: '',
    active: true
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    const data = await LLMConfig.list();
    setConfigs(data);
  };

  const handleAdd = async () => {
    if (!newConfig.name || !newConfig.api_endpoint || !newConfig.model) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    await LLMConfig.create(newConfig);
    setNewConfig({ name: '', api_endpoint: '', model: '', active: true });
    loadConfigs();
    toast({
      title: "Sucesso",
      description: "Configuração adicionada com sucesso"
    });
  };

  const handleDelete = async (id) => {
    await LLMConfig.delete(id);
    loadConfigs();
    toast({
      title: "Sucesso",
      description: "Configuração removida com sucesso"
    });
  };

  const handleToggle = async (config) => {
    await LLMConfig.update(config.id, { ...config, active: !config.active });
    loadConfigs();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Configurações dos Modelos LLM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Add new config */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                <Input
                  placeholder="Nome"
                  value={newConfig.name}
                  onChange={(e) => setNewConfig({...newConfig, name: e.target.value})}
                />
                <Input
                  placeholder="API Endpoint"
                  value={newConfig.api_endpoint}
                  onChange={(e) => setNewConfig({...newConfig, api_endpoint: e.target.value})}
                />
                <Input
                  placeholder="Model"
                  value={newConfig.model}
                  onChange={(e) => setNewConfig({...newConfig, model: e.target.value})}
                />
                <Button onClick={handleAdd} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Adicionar
                </Button>
              </div>

              {/* List configs */}
              <div className="space-y-4">
                {configs.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="grid grid-cols-3 gap-4 flex-1">
                      <div>
                        <div className="font-medium">{config.name}</div>
                        <div className="text-sm text-gray-500">Nome</div>
                      </div>
                      <div>
                        <div className="font-medium">{config.api_endpoint}</div>
                        <div className="text-sm text-gray-500">API Endpoint</div>
                      </div>
                      <div>
                        <div className="font-medium">{config.model}</div>
                        <div className="text-sm text-gray-500">Model</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={config.active}
                        onCheckedChange={() => handleToggle(config)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(config.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
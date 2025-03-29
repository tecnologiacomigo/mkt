import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gauge } from "lucide-react";

export default function MarketPressure({ pressao }) {
  if (!pressao) return null;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-500" />
          Pressão do Mercado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-green-700">Compradora</div>
              <div className="text-sm font-semibold text-green-700">{pressao.compradora}%</div>
            </div>
            <Progress 
              value={pressao.compradora} 
              className="h-3 bg-gray-100"
              indicatorClassName="bg-gradient-to-r from-green-400 to-green-600"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-red-700">Vendedora</div>
              <div className="text-sm font-semibold text-red-700">{pressao.vendedora}%</div>
            </div>
            <Progress 
              value={pressao.vendedora} 
              className="h-3 bg-gray-100"
              indicatorClassName="bg-gradient-to-r from-red-400 to-red-600"
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg mt-4 flex justify-between items-center">
            <span className="font-medium">Pressão Dominante:</span>
            <span className={`font-semibold ${
              pressao.dominante === 'COMPRADORA' 
                ? 'text-green-700'
                : 'text-red-700'
            }`}>
              {pressao.dominante}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
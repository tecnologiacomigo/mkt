import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

export default function PricePoints({ entrada, stop, alvo }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Entrada Ideal</p>
              <p className="text-2xl font-bold mt-1">{entrada}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Stop Loss</p>
              <p className="text-2xl font-bold mt-1">{stop}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Alvo</p>
              <p className="text-2xl font-bold mt-1">{alvo}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
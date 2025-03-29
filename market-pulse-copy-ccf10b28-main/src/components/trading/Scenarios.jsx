import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function Scenarios({ cenarios }) {
  if (!cenarios) return null;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>Possíveis Cenários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-2 text-green-800 font-medium">
              <ArrowUpCircle className="w-5 h-5 text-green-600" />
              Se Subir
            </div>
            <p className="text-green-800">{cenarios.se_subir}</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="flex items-center gap-2 mb-2 text-red-800 font-medium">
              <ArrowDownCircle className="w-5 h-5 text-red-600" />
              Se Cair
            </div>
            <p className="text-red-800">{cenarios.se_cair}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
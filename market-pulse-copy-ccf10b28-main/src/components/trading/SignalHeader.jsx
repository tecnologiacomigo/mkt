import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function SignalHeader({ signal }) {
  if (!signal) return null;

  return (
    <div>
      <h1 className="text-xl font-bold flex items-center gap-2">
        {signal.moeda && (
          <Badge variant="outline" className="font-normal bg-gray-100">
            {signal.moeda}
          </Badge>
        )}
        <div className="flex items-center gap-2">
          {signal.acao === "COMPRA" ? (
            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              COMPRA
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" />
              VENDA
            </Badge>
          )}
        </div>
      </h1>
      <p className="mt-1 text-gray-600">{signal.frase_operacional}</p>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart2, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PatternIdentified({ padrao }) {
  const [open, setOpen] = useState(false);
  
  if (!padrao) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-500" />
            <span>Padrão Identificado</span>
          </div>
          {padrao.explicacao && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{padrao.nome}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 text-sm">
                  {padrao.explicacao}
                </div>
                <DialogClose asChild>
                  <Button className="mt-4">Entendi</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-lg">{padrao.nome}</h3>
            <Badge className="bg-purple-100 text-purple-800">
              {padrao.confiabilidade}% confiável
            </Badge>
          </div>
          <Progress 
            value={padrao.confiabilidade} 
            className="h-2 mb-3"
            indicatorClassName="bg-purple-500"
          />
          <p className="text-purple-800 mt-2">
            {padrao.indicacao}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
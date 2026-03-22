'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, AlertTriangle, Activity } from 'lucide-react';

export default function Home() {
  // Dados simulados para as métricas
  const metrics = {
    totalProducts: 1247,
    lowStock: 23,
    recentMovements: 15,
    totalCategories: 18
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Visão geral do sistema de estoque</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.totalProducts}</div>
            <p className="text-xs text-gray-400 mt-1">+20.1% do mês passado</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.lowStock}</div>
            <p className="text-xs text-gray-400 mt-1">Produtos com estoque abaixo do mínimo</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Movimentações</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.recentMovements}</div>
            <p className="text-xs text-gray-400 mt-1">Movimentações recentes</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Categorias</CardTitle>
            <Badge className="bg-cyan-500/20 text-cyan-400">Categorias</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.totalCategories}</div>
            <p className="text-xs text-gray-400 mt-1">Total de categorias cadastradas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Movimentações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Produto {item}</p>
                    <p className="text-gray-400 text-sm">Movimentação {item}</p>
                  </div>
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                    Entrada
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Produto {item}</p>
                    <p className="text-gray-400 text-sm">Estoque: 5 unidades</p>
                  </div>
                  <Badge variant="destructive" className="bg-amber-500/20 text-amber-400">
                    Baixo
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
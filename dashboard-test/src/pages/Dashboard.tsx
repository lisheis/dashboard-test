import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { StatCard } from '../components/ui/StatCard';
import { CashFlowAreaChart } from '../components/charts/AreaChart';
import { ExpensesDonutChart } from '../components/charts/DonutChart';
import { RecentTransactions } from '../components/ui/RecentTransactions';
import { Wallet, PiggyBank, ReceiptText, Loader2 } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
};

export const Dashboard: React.FC = () => {
  const { isLoading, kpis, areaChart, donutChart, recentActivity } = useDashboardData();

  if (isLoading || !kpis || !areaChart || !donutChart) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-bold font-sans tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-pulse">
          Carregando Dados...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
              Visão Geral
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Seu dashboard ETL financeiro</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
              <div className="w-full h-full bg-background rounded-full border-2 border-transparent"></div>
            </div>
            <span className="font-semibold text-lg">Olá, Livia</span>
          </div>
        </header>

        {/* KPIs Padrão */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Saldo Líquido" 
            value={formatCurrency(kpis.monthlyBalance)} 
            icon={<Wallet className="w-6 h-6" />}
            colorClass="text-primary"
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard 
            title="Total de Despesas" 
            value={formatCurrency(kpis.totalExpenses)} 
            icon={<ReceiptText className="w-6 h-6" />}
            colorClass="text-secondary"
          />
          <StatCard 
            title="Taxa de Poupança" 
            value={`${kpis.savingsRate.toFixed(1)}%`} 
            icon={<PiggyBank className="w-6 h-6" />}
            colorClass="text-accent"
            trend={{ value: 2.1, isPositive: true }}
          />
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CashFlowAreaChart data={areaChart} />
          </div>
          <div className="lg:col-span-1">
            <ExpensesDonutChart data={donutChart} />
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="grid grid-cols-1">
          <div className="w-full">
            <RecentTransactions transactions={recentActivity} />
          </div>
        </div>

      </div>
    </div>
  );
};

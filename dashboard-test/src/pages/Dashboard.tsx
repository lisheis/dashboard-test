import React from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { MiniSparkline } from '../components/charts/MiniSparkline';
import { DonutDespesas } from '../components/charts/DonutDespesas';
import { MensalBarChart } from '../components/charts/MensalBarChart';
import { ParticipacaoAnual } from '../components/charts/ParticipacaoAnual';
import { DetalhamentoDespesas } from '../components/charts/DetalhamentoDespesas';
import { ReceitasDespesasLine } from '../components/charts/ReceitasDespesasLine';
import { ListaTransacoes } from '../components/ui/ListaTransacoes';
import { Card } from '../components/ui/Card';
import { Loader2, PieChart } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export const Dashboard: React.FC = () => {
  const { 
    isLoading, kpis, sparklineIncome, sparklineExpense, 
    monthCategories, yearCategories, monthlyAnalysis, recentActivity,
    year, setYear, month, setMonth 
  } = useDashboardData();

  if (isLoading || !kpis || !monthlyAnalysis) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#3B82F6] mb-4" />
        <h2 className="text-xl font-bold font-sans tracking-widest text-[#9CA3AF] animate-pulse">Carregando Instância...</h2>
      </div>
    );
  }

  const monthsList = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="min-h-screen bg-[#0B0C10] flex text-white font-sans overflow-hidden">
      
      {/* Sidebar - Fixa à esquerda */}
      <aside className="w-[260px] bg-[#0B0C10] border-r border-[rgba(255,255,255,0.02)] hidden md:flex flex-col flex-shrink-0 h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-[#4F46E5] text-white p-2 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]">
               <PieChart className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h1 className="font-bold text-lg leading-tight tracking-tight mt-1 text-gray-100">
               Dashboard <br/> Finanças Pessoais
            </h1>
          </div>

          <div className="mb-8">
             <ul className="flex flex-col gap-1">
                {[2023, 2024, 2025].map(y => (
                  <li 
                     key={y} 
                     onClick={() => setYear(y)}
                     className={`px-4 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                       year === y ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#9CA3AF] hover:text-white'
                     }`}
                  >
                     {y}
                  </li>
                ))}
             </ul>
          </div>

          <div>
             <ul className="flex flex-col gap-1">
                {monthsList.map((m, i) => (
                  <li 
                     key={m} 
                     onClick={() => setMonth(i + 1)}
                     className={`px-4 py-1.5 rounded text-sm cursor-pointer transition-colors ${
                       month === (i + 1) ? 'bg-[#4F46E5] text-white font-semibold' : 'text-[#9CA3AF] hover:text-white'
                     }`}
                  >
                     {m}
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:px-8 bg-[#0B0C10] overflow-y-auto h-screen custom-scrollbar">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-5 pb-8">
          
          {/* Row 1: Top Cards */}
          <div className="col-span-12 xl:col-span-3">
            <MiniSparkline title="Saldo do mês" value={`R$ ${formatCurrency(kpis.netBalance)}`} color="#4F46E5" series={sparklineIncome} />
          </div>
          <div className="col-span-12 xl:col-span-3">
            <MiniSparkline title="Despesas do mês" value={`R$ ${formatCurrency(kpis.totalExpenses)}`} color="#D946EF" series={sparklineExpense} />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
             <DonutDespesas title="Despesas no Mês" labels={monthCategories.labels} series={monthCategories.series} percentages={monthCategories.percentages} centerLabel={monthCategories.percentages[0] || '0%'} />
          </div>
          <div className="col-span-12 md:col-span-6 xl:col-span-3">
             <DonutDespesas title="Despesas no Ano" labels={yearCategories.labels} series={yearCategories.series} percentages={yearCategories.percentages} centerLabel={yearCategories.percentages[0] || '0%'} />
          </div>

          {/* Row 2: Mensal Bars & Participação Anual Radials */}
          <div className="col-span-12 xl:col-span-7">
             <MensalBarChart categories={monthlyAnalysis.categories} salarySeries={monthlyAnalysis.salarySeries} otherIncomeSeries={monthlyAnalysis.otherIncomeSeries} />
          </div>
          <div className="col-span-12 xl:col-span-5">
             <ParticipacaoAnual categories={yearCategories} />
          </div>

          {/* Row 3: Detalhamento de Despesas & Receitas e Despesas */}
          <div className="col-span-12 xl:col-span-7">
             <DetalhamentoDespesas categories={monthCategories} />
          </div>
          <div className="col-span-12 xl:col-span-5">
             <ReceitasDespesasLine categories={monthlyAnalysis.categories} incomeData={monthlyAnalysis.incomeSeries} expenseData={monthlyAnalysis.expenseSeries} />
          </div>

          {/* Row 4: Complementos (Lista de transações mantida do layout original como feature) */}
          <div className="col-span-12 xl:col-span-4">
            <Card className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-[#9CA3AF] text-sm mb-2 uppercase tracking-wide">Taxa de Poupança Anual</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#D946EF]">
                       {kpis.savingsRate.toFixed(1)}%
                    </p>
                </div>
            </Card>
          </div>
          <div className="col-span-12 xl:col-span-8">
             <ListaTransacoes transactions={recentActivity} />
          </div>

        </div>
      </main>
    </div>
  );
};

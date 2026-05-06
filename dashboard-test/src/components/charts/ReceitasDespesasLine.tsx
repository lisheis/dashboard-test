import React from 'react';
import Chart from 'react-apexcharts';
import { Card } from '../ui/Card';

interface ReceitasDespesasLineProps {
  categories: string[];
  incomeData: number[];
  expenseData: number[];
}

export const ReceitasDespesasLine: React.FC<ReceitasDespesasLineProps> = ({ categories, incomeData, expenseData }) => {
  const options: ApexCharts.ApexOptions = {
    chart: { type: 'line', background: 'transparent', toolbar: { show: false }, dropShadow: { enabled: true, top: 2, left: 0, blur: 4, opacity: 0.15 } },
    colors: ['#3B82F6', '#D946EF'],
    stroke: { curve: 'smooth', width: 3 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories.map(c => c.toLowerCase()),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#9CA3AF', fontSize: '10px' } }
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF', fontSize: '10px' },
        formatter: (val) => `R$ ${(val / 1000).toFixed(0)}k`
      }
    },
    grid: { show: false }, // No grid lines exactly like image
    legend: { show: false },
    theme: { mode: 'dark' },
    tooltip: { theme: 'dark', y: { formatter: val => `R$ ${val.toLocaleString('pt-BR')}` } }
  };

  const series = [
    { name: 'Receita', data: incomeData },
    { name: 'Despesa', data: expenseData }
  ];

  return (
    <Card className="p-5 h-full">
        <h3 className="text-[#9CA3AF] text-sm mb-2">Receitas e Despesas</h3>
        <div className="flex items-center gap-6 mt-1 mb-2 pl-4">
           <div className="flex items-center gap-2">
             <div className="w-6 h-0.5 bg-[#3B82F6]"></div>
             <span className="text-xs text-[#9CA3AF]">Receita -</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-6 h-0.5 bg-[#D946EF]"></div>
             <span className="text-xs text-[#9CA3AF]">Despesa -</span>
           </div>
        </div>
        <div className="-ml-3">
           <Chart options={options} series={series} type="line" height={180} width="100%" />
        </div>
    </Card>
  );
};

import React from 'react';
import Chart from 'react-apexcharts';
import { Card } from '../ui/Card';

interface MensalBarChartProps {
  categories: string[];
  salarySeries: number[];
  otherIncomeSeries: number[];
}

export const MensalBarChart: React.FC<MensalBarChartProps> = ({ categories, salarySeries, otherIncomeSeries }) => {
  const options: ApexCharts.ApexOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    colors: ['#3B82F6', '#D946EF'], // Matches image blue and pinkish/magenta
    plotOptions: {
      bar: { columnWidth: '40%', borderRadius: 3 }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: categories.map(c => c.toLowerCase()), // jan, fev...
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
    grid: { show: true, borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 0, position: 'back', xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    legend: { show: false },
    theme: { mode: 'dark' },
    tooltip: { theme: 'dark', y: { formatter: val => `R$ ${val.toLocaleString('pt-BR')}` } }
  };

  const series = [
    { name: 'Salário', data: salarySeries },
    { name: 'Outras Receitas', data: otherIncomeSeries }
  ];

  return (
    <Card className="p-5 h-full">
      <div className="flex flex-col mb-2">
        <h3 className="text-[#9CA3AF] text-sm">Análise Mensal</h3>
        <div className="flex items-center gap-4 mt-2">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-[#3B82F6] rounded-sm"></div>
             <span className="text-xs text-[#9CA3AF]">Salário</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-[#D946EF] rounded-sm"></div>
             <span className="text-xs text-[#9CA3AF]">Outras Receitas</span>
           </div>
        </div>
      </div>
      <div className="mt-4 -ml-2">
        <Chart options={options} series={series} type="bar" height={220} width="100%" />
      </div>
    </Card>
  );
};

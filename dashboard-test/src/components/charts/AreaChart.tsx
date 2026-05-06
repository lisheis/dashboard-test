import React from 'react';
import Chart from 'react-apexcharts';
import { AreaChartData } from '../../services/transformers/transformers';
import { Card } from '../ui/Card';

interface CashFlowAreaChartProps {
  data: AreaChartData;
}

export const CashFlowAreaChart: React.FC<CashFlowAreaChartProps> = ({ data }) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#00E5FF', '#FF007A'], // Neon Blue, Neon Magenta
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    xaxis: {
      categories: data.categories,
      labels: { style: { colors: '#9CA3AF' } }, // Tailwind gray-400
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF' },
        formatter: (val) => `$${val.toLocaleString()}`
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.05)',
      strokeDashArray: 4,
    },
    theme: { mode: 'dark' },
    tooltip: { theme: 'dark' },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.0,
        stops: [0, 100]
      }
    },
    legend: { show: false }
  };

  const series = [
    { name: 'Receitas', data: data.incomeSeries.map(s => s.y) },
    { name: 'Despesas', data: data.expenseSeries.map(s => s.y) }
  ];

  return (
    <Card className="h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-sans">Fluxo de Caixa (12 Meses)</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_#00E5FF]"></div>
            <span className="text-sm text-gray-400">Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_#FF007A]"></div>
            <span className="text-sm text-gray-400">Despesas</span>
          </div>
        </div>
      </div>
      <Chart options={options} series={series} type="area" height={320} />
    </Card>
  );
};

import React from 'react';
import Chart from 'react-apexcharts';
import { DonutChartData } from '../../services/transformers/transformers';
import { Card } from '../ui/Card';

interface ExpensesDonutChartProps {
  data: DonutChartData;
}

export const ExpensesDonutChart: React.FC<ExpensesDonutChartProps> = ({ data }) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      background: 'transparent',
    },
    labels: data.labels,
    colors: [
      '#FF007A', '#7000FF', '#00E5FF', '#F59E0B', '#10B981', '#6366F1'
    ],
    theme: { mode: 'dark' },
    stroke: { show: false }, // removes borders between slices
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { color: '#9CA3AF' },
            value: { 
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 700,
              formatter: (val) => `$${Number(val).toLocaleString()}`
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total de Despesas',
              color: '#9CA3AF',
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return `$${total.toLocaleString()}`;
              }
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      labels: { colors: '#FFFFFF' }
    },
    tooltip: { theme: 'dark' },
  };

  return (
    <Card className="h-full min-h-[400px]">
      <h3 className="text-xl font-bold font-sans mb-4">Gastos por Categoria</h3>
      <div className="flex items-center justify-center h-[320px]">
        {data.series.length > 0 ? (
          <Chart options={options} series={data.series} type="donut" height={320} width="100%" />
        ) : (
          <div className="text-gray-500 italic">Sem dados de despesa disponíveis</div>
        )}
      </div>
    </Card>
  );
};

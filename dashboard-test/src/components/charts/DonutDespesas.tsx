import React from 'react';
import Chart from 'react-apexcharts';
import { Card } from '../ui/Card';

interface DonutDespesasProps {
  title: string;
  labels: string[];
  series: number[];
  percentages: string[];
  centerLabel: string;
}

export const DonutDespesas: React.FC<DonutDespesasProps> = ({ title, labels, series, centerLabel }) => {
  const customColors = ['#FBBF24', '#10B981', '#3B82F6', '#8B5CF6', '#F43F5E', '#06B6D4'];

  const options: ApexCharts.ApexOptions = {
    chart: { type: 'donut', background: 'transparent' },
    labels: labels,
    colors: customColors,
    stroke: { colors: ['#161922'], width: 4 }, // Matches the card background for seamless dark gaps
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: {
            show: true,
            name: { show: false },
            value: { 
              show: true,
              fontSize: '24px',
              fontFamily: 'inherit',
              fontWeight: 700,
              color: '#FFFFFF',
              offsetY: -4,
              formatter: () => centerLabel
            },
            total: {
              show: true,
              showAlways: true,
              label: '',
              formatter: () => centerLabel
            }
          }
        }
      }
    },
    legend: { show: false },
    tooltip: { theme: 'dark', y: { formatter: val => `R$ ${val.toLocaleString('pt-BR')}` } },
  };

  return (
    <Card className="p-5 h-full relative">
      <h3 className="text-[#9CA3AF] text-sm mb-4">{title}</h3>
      <div className="flex items-center h-full gap-4">
        <div className="w-1/2 relative flex items-center justify-center -top-2">
          {series.length > 0 ? (
            <Chart options={options} series={series} type="donut" width="160" />
          ) : (
            <div className="text-gray-500 text-xs">Sem dados</div>
          )}
          {/* Custom text inside donut below value */}
          {(series.length > 0) && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-2 text-[8px] text-[#9CA3AF] text-center uppercase tracking-wider leading-tight">
               Participação no<br/>Bolo Total
             </div>
          )}
        </div>
        <div className="w-1/2 flex flex-col justify-center gap-2 pl-2">
          {labels.map((lbl, idx) => (
             <div key={lbl} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: customColors[idx % customColors.length] }}></div>
                <span className="text-[#9CA3AF] text-xs truncate">{lbl}</span>
             </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

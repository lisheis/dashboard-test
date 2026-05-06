import React from 'react';
import Chart from 'react-apexcharts';
import { Card } from '../ui/Card';

interface ParticipacaoAnualProps {
  categories: { labels: string[], series: number[], percentages: string[], total: number };
}

export const ParticipacaoAnual: React.FC<ParticipacaoAnualProps> = ({ categories }) => {
  // We want to draw up to 6 small individual radial bars based on top categories from the image
  // Image mentions: Moradia, Subsistência, Transporte, Saúde, Lazer, Vestuário
  const orderedLabels = ['Moradia', 'Subsistência', 'Transporte', 'Saúde', 'Lazer', 'Vestuário'];
  const colors = ['#6B7280', '#FBBF24', '#D946EF', '#10B981', '#6B7280', '#6B7280']; // Matches the tiny arc colors approximately
  
  const getPercentageFor = (lbl: string) => {
     const idx = categories.labels.findIndex(l => l.toLowerCase() === lbl.toLowerCase());
     if (idx === -1) return 0;
     const amt = categories.series[idx];
     return categories.total > 0 ? (amt / categories.total) * 100 : 0;
  };

  return (
    <Card className="p-5 text-white flex flex-col h-[180px]">
      <h3 className="text-[#9CA3AF] text-sm mb-4">Participação na base anual</h3>
      <div className="flex flex-row justify-between items-center w-full px-2 mt-2">
         {orderedLabels.map((lbl, i) => {
            const perc = getPercentageFor(lbl);
            const apexOpt: ApexCharts.ApexOptions = {
              chart: { type: 'radialBar', sparkline: { enabled: true } },
              plotOptions: {
                radialBar: {
                  hollow: { size: '65%' },
                  track: { background: '#1F2937', strokeWidth: '100%' },
                  dataLabels: {
                     name: { show: false },
                     value: { show: true, fontSize: '10px', color: '#FFF', offsetY: 4, formatter: val => `${val.toFixed(0)}%` }
                  }
                }
              },
              colors: perc === 0 ? ['#374151'] : [colors[i]], // grayed out if 0
              stroke: { lineCap: 'round' }
            };

            return (
              <div key={lbl} className="flex flex-col items-center justify-center gap-2">
                 <div className="w-16 h-16">
                    <Chart options={apexOpt} series={[perc]} type="radialBar" width="100%" height="100%" />
                 </div>
                 <span className="text-[9px] text-[#9CA3AF]">{lbl}</span>
              </div>
            );
         })}
      </div>
    </Card>
  );
};

import React from 'react';
import Chart from 'react-apexcharts';
import { Card } from '../ui/Card';

interface MiniSparklineProps {
  title: string;
  value: string;
  color: string;
  series: number[];
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({ title, value, color, series }) => {
  const options: ApexCharts.ApexOptions = {
    chart: { type: 'area', sparkline: { enabled: true }, animations: { enabled: false } },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] }
    },
    colors: [color],
    tooltip: { fixed: { enabled: false }, x: { show: false }, y: { title: { formatter: () => '' } }, marker: { show: false } }
  };

  return (
    <Card className="flex items-center justify-between p-6">
      <div className="flex flex-col gap-1 w-1/3">
        <span className="text-[#9CA3AF] text-sm">{title}</span>
        <span className="text-white text-2xl font-bold mt-1">{value}</span>
      </div>
      <div className="w-2/3 h-16 relative top-2">
         {series && series.length > 0 && <Chart options={options} series={[{ data: series }]} type="area" width="100%" height="80" />}
      </div>
    </Card>
  );
};

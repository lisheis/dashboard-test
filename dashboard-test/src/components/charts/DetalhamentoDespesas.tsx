import React from 'react';
import { Card } from '../ui/Card';

interface DetalhamentoDespesasProps {
  categories: { labels: string[], series: number[], percentages: string[], total: number };
}

export const DetalhamentoDespesas: React.FC<DetalhamentoDespesasProps> = ({ categories }) => {
  // Sort descending by value to show the highest bars first
  const sorted = categories.labels.map((lbl, idx) => ({
     label: lbl,
     amount: categories.series[idx],
  })).sort((a,b) => b.amount - a.amount).slice(0, 5); // top 5

  const maxAmount = sorted.length > 0 ? sorted[0].amount : 1;

  // The right side has a list of standard categories.
  const sideCategories = ['Lazer', 'Moradia', 'Saúde', 'Subsistência', 'Transporte', 'Vestuário'];

  return (
    <Card className="p-5 h-full flex flex-col">
      <h3 className="text-[#9CA3AF] text-sm mb-6">Detalhamento de Despesas</h3>
      <div className="flex gap-4 flex-1">
        <div className="w-3/4 flex flex-col justify-around pr-4 border-r border-white/5">
           {sorted.map(item => {
             const wPerc = (item.amount / maxAmount) * 100;
             return (
               <div key={item.label} className="flex items-center gap-4">
                  <span className="text-[#9CA3AF] text-xs w-20 text-right truncate">{item.label}</span>
                  <div className="flex-1 bg-[#1F2937] h-3 rounded-full overflow-hidden relative">
                     <div className="bg-[#4F46E5] h-full rounded-full transition-all duration-500" style={{ width: `${wPerc}%` }}></div>
                  </div>
                  <span className="text-[#9CA3AF] text-xs">R$ {item.amount.toLocaleString('pt-BR')}</span>
               </div>
             );
           })}
           {sorted.length === 0 && <span className="text-gray-500 text-xs italic">Sem detalhes no momento</span>}
        </div>
        <div className="w-1/4 flex flex-col gap-3 pl-2 justify-center">
           {sideCategories.map((lbl, i) => (
             <div 
               key={lbl} 
               className={`text-xs px-2 py-1 rounded-md text-center cursor-default ${i === 0 ? 'bg-[#4F46E5] text-white' : 'text-[#9CA3AF]'}`}
             >
               {lbl}
             </div>
           ))}
        </div>
      </div>
    </Card>
  );
};

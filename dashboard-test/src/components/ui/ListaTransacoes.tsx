import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RawTransaction } from '../../services/extractor/extractor';
import { Card } from './Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const ListaTransacoes: React.FC<{ transactions: RawTransaction[] }> = ({ transactions }) => {
  return (
    <Card className="h-[280px] overflow-y-auto w-full border-[rgba(255,255,255,0.05)] custom-scrollbar p-0">
      <div className="p-4 bg-[#161922] sticky top-0 border-b border-white/5 z-10">
         <h3 className="text-[#9CA3AF] text-sm">Lista de Transações</h3>
      </div>
      <ul className="p-4 space-y-4">
         {transactions.map(tx => {
           const isIncome = tx.type === 'income';
           return (
             <li key={tx.id} className="flex justify-between items-center group">
               <div className="flex gap-4 items-center">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 ${isIncome ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#FF007A]/10 text-[#FF007A]'}`}>
                   {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                 </div>
                 <div>
                   <p className="text-sm text-gray-200 group-hover:text-white transition-colors">{tx.category}</p>
                   <p className="text-xs text-gray-500">{format(parseISO(tx.date), 'dd MMM', { locale: ptBR })} - {tx.description}</p>
                 </div>
               </div>
               <span className={`text-sm font-semibold ${isIncome ? 'text-[#10B981]' : 'text-gray-300'}`}>
                 {isIncome ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
               </span>
             </li>
           )
         })}
      </ul>
    </Card>
  );
};

import React from 'react';
import { format, parseISO } from 'date-fns';
import { RawTransaction } from '../../services/extractor/extractor';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { cn } from './Card';

interface RecentTransactionsProps {
  transactions: RawTransaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
  };

  return (
    <Card className="h-full">
      <div className="flex items-center gap-2 mb-6 text-xl font-bold font-sans">
        <Clock className="w-6 h-6 text-accent" />
        <h3>Transações Recentes</h3>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-gray-500 italic py-8 text-center bg-white/5 rounded-lg border border-dashed border-white/10">
          Nenhuma transação recente.
        </div>
      ) : (
        <ul className="space-y-4">
          {transactions.map(tx => (
            <li key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-full flex items-center justify-center shadow-lg",
                  tx.type === 'income' 
                    ? "bg-primary/10 text-primary shadow-primary/20" 
                    : "bg-secondary/10 text-secondary shadow-secondary/20"
                )}>
                  {tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-white tracking-wide">{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span className="bg-white/10 px-2 py-0.5 rounded-full">{tx.category}</span>
                    <span>•</span>
                    <span>{format(parseISO(tx.date), 'dd/MM/yyyy, HH:mm')}</span>
                  </div>
                </div>
              </div>
              <div className={cn(
                "font-mono font-bold text-lg",
                tx.type === 'income' ? "text-primary" : "text-secondary"
              )}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

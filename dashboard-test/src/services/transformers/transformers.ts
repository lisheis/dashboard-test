import { RawTransaction, groupExpensesByCategory, calculateTotalAmount } from '../extractor/extractor';
import { setDefaultOptions } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { format, parseISO, startOfMonth, isValid } from 'date-fns';

setDefaultOptions({ locale: ptBR });

export interface ChartSeriesData {
  x: string | number;
  y: number;
}

export interface KPIStats {
  totalIncome: number;
  totalExpenses: number;
  monthlyBalance: number;
  savingsRate: number;
}

export interface DonutChartData {
  series: number[];
  labels: string[];
}

export interface AreaChartData {
  categories: string[];
  incomeSeries: ChartSeriesData[];
  expenseSeries: ChartSeriesData[];
}

/**
 * Transformers Layer (Camada de Transformadores)
 * 
 * Contém funções puras destinadas exclusivamente a modificar a estrutura e topologia
 * dos dados do Extractor, adequando-os exatamente aos pacotes `{ x, y }` e arrays isolados
 * lidos pelas bibliotecas UI, como ApexCharts e cartões estatísticos.
 */

/**
 * Extrai e normaliza os KPIs estatísticos do Dashboard em uma única passagem de varredura.
 * @param transactions Matriz de RawTransaction.
 * @returns KPIs financeiros brutos (Receita e Despesas).
 * @complexity O(N) amortizado ao calcular receitas e despesas instantaneamente usando a camada Extractor.
 */
export const calculateKPIs = (transactions: RawTransaction[]): KPIStats => {
  const incomeTx = transactions.filter(t => t.type === 'income');
  const expenseTx = transactions.filter(t => t.type === 'expense');

  const totalIncome = calculateTotalAmount(incomeTx);
  const totalExpenses = calculateTotalAmount(expenseTx);

  const monthlyBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((monthlyBalance) / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpenses,
    monthlyBalance,
    savingsRate: Math.max(0, savingsRate),
  };
};

/**
 * Transforma a base qualificada na tipologia isolada do Gráfico de Donut do Apex.
 * @param transactions A Matriz de RawTransaction principal.
 * @returns Array fatiado: `series` (Volumetria) e `labels` (Categorias explícitas).
 * @complexity O(N) devido ao uso da função delegada `groupExpensesByCategory`.
 */
export const transformToDonutChart = (transactions: RawTransaction[]): DonutChartData => {
  const categoryTotals = groupExpensesByCategory(transactions);
  return { 
    labels: Object.keys(categoryTotals), 
    series: Object.values(categoryTotals) 
  };
};

/**
 * Redução complexa temporal. Agrupa todas as informações no ciclo de 12 meses, separando
 * duas linhas vertoriais (despesas e lucros) em Y atreladas a uma nomenclatura X de meses cronológicos.
 * @param transactions Transações limpas
 * @returns Chaves geográficas separadas prontas para renderizar a malha do AreaChart.
 * @complexity O(N log N) agrupa itens, cria datas via `date-fns` e em seguida as ordena pelo valor temporal absoluto subjacente.
 */
export const transformToAreaChart = (transactions: RawTransaction[]): AreaChartData => {
  const monthlyData = transactions.reduce((acc, curr) => {
    const dateObj = parseISO(curr.date);
    if (!isValid(dateObj)) return acc;

    const monthKey = format(startOfMonth(dateObj), 'MMM yyyy'); 
    
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expense: 0, dateObj };
    }

    if (curr.type === 'income') acc[monthKey].income += curr.amount;
    else acc[monthKey].expense += curr.amount;

    return acc;
  }, {} as Record<string, { income: number; expense: number; dateObj: Date }>);

  // Remonta a matriz e ordena (Cronologia temporal).
  const sortedMonths = Object.entries(monthlyData).sort((a, b) => a[1].dateObj.getTime() - b[1].dateObj.getTime());
  const recent12Months = sortedMonths.slice(-12);

  const categories = recent12Months.map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
  const incomeSeries = recent12Months.map(([key, data]) => ({ x: key, y: data.income }));
  const expenseSeries = recent12Months.map(([key, data]) => ({ x: key, y: data.expense }));

  return { categories, incomeSeries, expenseSeries };
};

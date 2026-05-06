import { useState, useEffect } from 'react';
import mockData from '../data/raw/transactions.json';
import { 
  extractAllTransactions, 
  filterTransactionsByPeriod,
  filterTransactionsByYear,
  extractRecentTransactions
} from '../services/extractor/extractor';
import { 
  calculateKPIs,
  transformToMonthlySeries,
  transformToSparkline,
  transformCategoryDistribution,
  type DashboardKPIs
} from '../services/transformers/transformers';

export const useDashboardData = () => {
  const [year, setYear] = useState<number>(2025);
  const [month, setMonth] = useState<number>(1); // Janeiro
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // States
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [sparklineIncome, setSparklineIncome] = useState<number[]>([]);
  const [sparklineExpense, setSparklineExpense] = useState<number[]>([]);
  
  // Categorias Mês e Ano
  const [monthCategories, setMonthCategories] = useState<any>(null);
  const [yearCategories, setYearCategories] = useState<any>(null);

  // Análise Mensal (Barras) e Receitas x Despesas
  const [monthlyAnalysis, setMonthlyAnalysis] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allTx = extractAllTransactions(mockData);
        
        // Aplicafiltros base do SideBar
        const monthTx = filterTransactionsByPeriod(allTx, year, month);
        const yearTx = filterTransactionsByYear(allTx, year);

        // Processa
        setKpis(calculateKPIs(monthTx));
        
        setSparklineIncome(transformToSparkline(monthTx, 'income'));
        setSparklineExpense(transformToSparkline(monthTx, 'expense'));
        
        setMonthCategories(transformCategoryDistribution(monthTx));
        setYearCategories(transformCategoryDistribution(yearTx));
        
        setMonthlyAnalysis(transformToMonthlySeries(yearTx));
        setRecentActivity(extractRecentTransactions(allTx, 8));

      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simula carregamento
    const timer = setTimeout(fetchData, 400); 
    return () => clearTimeout(timer);
  }, [year, month]);

  return { isLoading, kpis, sparklineIncome, sparklineExpense, monthCategories, yearCategories, monthlyAnalysis, recentActivity, year, setYear, month, setMonth };
};

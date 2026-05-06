import { useState, useEffect } from 'react';
import mockData from '../data/raw/transactions.json';
import { 
  extractAllTransactions, 
  extractRecentTransactions 
} from '../services/extractor/extractor';
import { 
  calculateKPIs, 
  transformToAreaChart, 
  transformToDonutChart,
  type KPIStats,
  type AreaChartData,
  type DonutChartData,
} from '../services/transformers/transformers';
import { RawTransaction } from '../services/extractor/extractor';

export interface DashboardData {
  isLoading: boolean;
  kpis: KPIStats | null;
  areaChart: AreaChartData | null;
  donutChart: DonutChartData | null;
  recentActivity: RawTransaction[];
}

export const useDashboardData = (): DashboardData => {
  const [data, setData] = useState<DashboardData>({
    isLoading: true,
    kpis: null,
    areaChart: null,
    donutChart: null,
    recentActivity: [],
  });

  useEffect(() => {
    // Simulate API fetch delay
    const fetchData = async () => {
      try {
        // Extraction
        const allTx = extractAllTransactions(mockData);
        // Load recent 10 transactions
        const recentTx = extractRecentTransactions(allTx, 10);

        // Transformation
        const kpis = calculateKPIs(allTx);
        const areaChart = transformToAreaChart(allTx);
        const donutChart = transformToDonutChart(allTx);

        // State update
        setData({
          isLoading: false,
          kpis,
          areaChart,
          donutChart,
          recentActivity: recentTx,
        });
      } catch (error) {
        console.error("Error loading dashboard data", error);
        // Error state handling could be added here
        setData(prev => ({ ...prev, isLoading: false }));
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 800); // UI Loading state simulation

    return () => clearTimeout(timer);
  }, []);

  return data;
};

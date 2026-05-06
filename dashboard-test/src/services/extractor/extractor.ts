export type TransactionType = 'income' | 'expense';

export interface RawTransaction {
  id: string;
  date: string; // ISO String (ex: 2023-10-05T10:00:00Z)
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
}

/**
 * Camada de Extrator (Service/Extractor Layer)
 * 
 * Centraliza as regras de negócio puras (Extrações, Validações, Filtros Temporais e Cálculos Base).
 * Garantimos tipagem forte usando TypeScript e funções puramente funcionais (sem efeitos colaterais).
 */

/**
 * Filtra as transações para um Ano e Mês específicos.
 * @param transactions Array bruto de transações.
 * @param year Ano a ser filtrado (ex: 2024).
 * @param month Mês numérico (1 a 12).
 * @returns Array de transações restrito àquele mês/ano.
 * @description Utilizamos a extração UTC das datas para evitar distorções de fuso horário. Complexidade O(N).
 */
export const filterTransactionsByPeriod = (transactions: RawTransaction[], year: number, month: number): RawTransaction[] => {
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
  });
};

/**
 * Filtra as transações apenas para um Ano específico.
 * @param transactions Array bruto.
 * @param year Ano a ser filtrado.
 * @returns Array restrito ao ano.
 */
export const filterTransactionsByYear = (transactions: RawTransaction[], year: number): RawTransaction[] => {
  return transactions.filter(t => new Date(t.date).getUTCFullYear() === year);
};

/**
 * Redutor genérico para soma total de montantes.
 * @param transactions Array previamente filtrado.
 * @returns Número representando o valor financeiro total.
 * @description O `reduce` consolida os valores iterando apenas uma vez pelo array (O(N)).
 */
export const calculateTotalAmount = (transactions: RawTransaction[]): number => {
  return transactions.reduce((acc, curr) => acc + curr.amount, 0);
};

/**
 * Agrupa transações por categoria e soma os seus montantes totais.
 * @param transactions Matriz contendo despesas ou receitas.
 * @returns Dicionário (Record<string, number>) mapeando Categoria -> Valor.
 * @description Cria buckets de agregação ideais para montar gráficos de Pizza (Donuts).
 */
export const aggregateByCategory = (transactions: RawTransaction[]): Record<string, number> => {
  return transactions.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Ordena as transações de forma cronológica decrescente e limita a quantidade.
 * @param transactions Array a ser ordenado.
 * @param limit Quantidade máxima a retornar.
 * @returns Últimos registros inseridos.
 * @description Complexidade O(N log N) por utilizar `sort()`.
 */
export const extractRecentTransactions = (transactions: RawTransaction[], limit: number = 5): RawTransaction[] => {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted.slice(0, limit);
};

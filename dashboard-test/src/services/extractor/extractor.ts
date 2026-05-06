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
 * Contém funções puras projetadas para processar e extrair recortes 
 * específicos dos grandes blocos de dados JSON brutos (Raw Data).
 * O objetivo fundamental desta camada é purificar a entrada de dados.
 */

/**
 * Extrai e normaliza transações brutas de um payload tipado genérico.
 * @param rawData O array contendo JSON recebido da API.
 * @returns Array seguro de `RawTransaction`.
 * @complexity O(1) conversão de tipos (na vida real O(N) com validação de scheme Zod).
 */
export const extractAllTransactions = (rawData: unknown[]): RawTransaction[] => {
  return rawData as RawTransaction[];
};

/**
 * Filtra a massa de dados mantendo unicamente registros de um mês e ano específicos.
 * @param transactions Array bruto
 * @param year Ano (ex: 2023)
 * @param month Mês (1-12)
 * @returns Array de `RawTransaction` correspondente
 * @complexity O(N) operando validação de string temporal.
 */
export const filterTransactionsByDate = (transactions: RawTransaction[], year: number, month: number): RawTransaction[] => {
  return transactions.filter(t => {
    const d = new Date(t.date);
    return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month;
  });
};

/**
 * Redutor simples para calcular a soma total de qualquer agrupamento de transações.
 * Muito útil logo após extrair uma lista filtrada.
 * @param transactions Lista extraída/refinada.
 * @returns Total monetário.
 * @complexity O(N) no reduce do array.
 */
export const calculateTotalAmount = (transactions: RawTransaction[]): number => {
  return transactions.reduce((acc, curr) => acc + curr.amount, 0);
};

/**
 * Cria um grupo de despesas por categoria iterando a massa principal.
 * @param transactions Matriz contendo despesas e receitas.
 * @returns Dicionário combinando NomeDaCategoria -> ValorTotal.
 * @complexity O(N) combinando filtragem e agrupamento de chaves via reduce.
 */
export const groupExpensesByCategory = (transactions: RawTransaction[]): Record<string, number> => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
};

/**
 * Recupera os itens inseridos visualmente mais recentemente baseados estritamente na data temporal em milissegundos.
 * @param transactions A lista global
 * @param limit A volumetria a ser extraída
 * @returns Lista em ordem Top C to Bottom de transações Recentes
 * @complexity O(N log N) porque invoca o método Sort() para ordenar decrescente.
 */
export const extractRecentTransactions = (transactions: RawTransaction[], limit: number = 5): RawTransaction[] => {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted.slice(0, limit);
};

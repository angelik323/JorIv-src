import { useAccountingBalanceMovements } from './checking-balances-and-transactions-by-account'
export const useAccountingBalanceMovementsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAccountingBalanceMovements()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

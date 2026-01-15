import { useBudgetCancellationBalancesStoreV1 } from './cancellation-balances-v1'

export const useBudgetCancellationBalancesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetCancellationBalancesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

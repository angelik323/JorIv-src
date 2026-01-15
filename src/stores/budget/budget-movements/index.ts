import { useBudgetMovementsStoreV1 } from './budget-movements-v1'

export const useBudgetMovementsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetMovementsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

export const useBudgetMovements = (version: 'v1' | 'v2') =>
  useBudgetMovementsStore(version)

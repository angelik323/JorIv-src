import { useBudgetLevelsStoreV1 } from './budget-levels-v1'

export const useBudgetLevelsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetLevelsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

export const useBudgetLevels = (version: 'v1' | 'v2') =>
  useBudgetLevelsStore(version)

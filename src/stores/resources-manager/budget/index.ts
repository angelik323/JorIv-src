import { useBudgetResourcesV1 } from './budget-resources-v1'

export const useBudgetResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

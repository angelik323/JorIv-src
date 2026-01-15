import { useBudgetAreasResponsibilityStoreV1 } from './areas-responsibility-v1'

export const useBudgetAreasResponsibilityStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetAreasResponsibilityStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

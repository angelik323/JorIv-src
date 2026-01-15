import { useClosureValidationsStoreV1 } from '@/stores/budget/closure-validations/closure-validations-v1'

export const useClosureValidationsModuleStore = (version: 'v1' = 'v1') => {
  switch (version) {
    case 'v1':
      return useClosureValidationsStoreV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}


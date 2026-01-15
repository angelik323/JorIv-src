import { useTypesCoverageStoreV1 } from './types-coverage-v1'

export const useTypesCoverageStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTypesCoverageStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
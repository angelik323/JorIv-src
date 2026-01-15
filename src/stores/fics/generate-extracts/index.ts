import { useGenerateExtractsStoreV1 } from './generate-extracts-v1'

export const useGenerateExtractsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useGenerateExtractsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

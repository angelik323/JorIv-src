import { useGenerateBallotCollectionStoreV1 } from './generate-ballot-v1'

export const useGenerateBallotStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useGenerateBallotCollectionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

import { usePortfolioClassificationStoreV1 } from './portfolio-classification-v1'
import { usePortfolioClassificationStoreV2 } from './portfolio-classification-v2'

type StoreVersion = 'v1' | 'v2' | 'v3'

type StoreMap = {
  v1: ReturnType<typeof usePortfolioClassificationStoreV1>
  v2: ReturnType<typeof usePortfolioClassificationStoreV2>
  v3: never
}

export const usePortfolioClassificationStore = <V extends StoreVersion>(
  version: V
): StoreMap[V] => {
  switch (version) {
    case 'v1':
      return usePortfolioClassificationStoreV1() as StoreMap[V]
    case 'v2':
      return usePortfolioClassificationStoreV2() as StoreMap[V]
    case 'v3':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

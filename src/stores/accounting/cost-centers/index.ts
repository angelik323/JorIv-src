import { useCostCenterV1 } from './cost-center-v1'
import { useCostCenterStoreV2 } from './cost-center-v2'

const storeMap = {
  v1: useCostCenterV1,
  v2: useCostCenterStoreV2,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useCostCenterStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]
  if (!store) throw new Error(`Versión de store no disponible: ${version}`)
  return store() as ExtractStore<K>
}

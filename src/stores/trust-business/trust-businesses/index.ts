import { useTrustBusinessStoreV1 } from './trust-business-v1'
import { useTrustBusinessManagementStoreV2 } from './trust-business-management-v2'

const storeMap = {
  v1: useTrustBusinessStoreV1,
  v2: useTrustBusinessManagementStoreV2,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useTrustBusinessStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]
  if (!store) throw new Error(`Versión de store no disponible: ${version}`)
  return store() as ExtractStore<K>
}

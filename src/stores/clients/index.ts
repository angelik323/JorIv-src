import { useClientsStoreV1 } from './clients-v1'
import { useClientsStoreV2 } from './clients-v2'

const storeMap = {
  v1: useClientsStoreV1,
  v2: useClientsStoreV2,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useClientsStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]
  if (!store) throw new Error(`Versión de store no disponible: ${version}`)
  return store() as ExtractStore<K>
}

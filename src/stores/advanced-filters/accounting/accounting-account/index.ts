import { useAccountingAccountFilterStoreV1 } from './accounting-account-filter-v1'

const storeMap = {
  v1: useAccountingAccountFilterStoreV1,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useAccountingAccountFilterStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as ExtractStore<K>
}

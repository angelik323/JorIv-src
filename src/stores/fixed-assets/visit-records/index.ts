import { useVisitRecordsV1 } from '@/stores/fixed-assets/visit-records/visit-records-v1'

const storeMap = {
  v1: useVisitRecordsV1,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useVisitRecordsStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]
  if (!store) throw new Error(`Versión de store no disponible: ${version}`)
  return store() as ExtractStore<K>
}

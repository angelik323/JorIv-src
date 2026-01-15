import { useOpeningRecordV1 } from './opening-record-v1'
import { useOpeningRecordV2 } from './opening-record-v2'

const storeMap = {
  v1: useOpeningRecordV1,
  v2: useOpeningRecordV2,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useOpeningRecordStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as ExtractStore<K>
}

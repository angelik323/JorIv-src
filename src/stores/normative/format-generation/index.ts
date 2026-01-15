import { useFormatGenerationStoreV1 } from './format-generation-v1'

const storeMap = {
  v1: useFormatGenerationStoreV1,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useFormatGenerationStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]
  if (!store) throw new Error(`Versión de store no disponible: ${version}`)
  return store() as ExtractStore<K>
}

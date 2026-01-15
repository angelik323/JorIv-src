import { useGenerationCertificateStoreV1 } from './generation-certificate-v1'

const storeMap = {
  v1: useGenerationCertificateStoreV1,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useGenerationCertificateStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]
  if (!store) throw new Error(`Versión de store no disponible: ${version}`)
  return store() as ExtractStore<K>
}

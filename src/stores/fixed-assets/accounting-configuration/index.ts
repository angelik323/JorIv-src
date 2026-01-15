import { useAccountingConfigurationV1 } from '@/stores/fixed-assets/accounting-configuration/accounting-configuration-v1'

const storeMap = {
  v1: useAccountingConfigurationV1,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useAccountingConfigurationStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]
  if (!store) throw new Error(`Versión de store no disponible: ${version}`)
  return store() as ExtractStore<K>
}

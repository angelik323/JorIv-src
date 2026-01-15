import { useDesactivateDailyClousingVouchersV1 } from './desactivate-daily-clousing-vouchers'
import { useDesactivateDailyClousingVouchersStoreV2 } from './desactivate-daily-clousing-vouchers-v2'

const storeMap = {
  v1: useDesactivateDailyClousingVouchersV1,
  v2: useDesactivateDailyClousingVouchersStoreV2,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useDesactivateDailyClousingVouchersStore = <
  K extends keyof StoreMap
>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]
  if (!store) throw new Error(`Versión de store no disponible: ${version}`)
  return store() as ExtractStore<K>
}

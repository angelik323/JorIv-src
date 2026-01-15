import { useAccountingReceiptsV1 } from './accounting-receipt-v1'
import { useAccountingReceiptsV2 } from './accounting-receipt-v2'

const storeMap = {
  v1: useAccountingReceiptsV1,
  v2: useAccountingReceiptsV2,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export const useAccountingReceiptsStore = <K extends keyof StoreMap>(
  version: K
): ExtractStore<K> => {
  const store = storeMap[version]
  if (!store) throw new Error(`Versión de store no disponible: ${version}`)
  return store() as ExtractStore<K>
}

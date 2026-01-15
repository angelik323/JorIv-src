import { useUploadAccountingVouchersStoreV1 } from './upload-accounting-vouchers-v1'
import { useUploadAccountingVouchersStoreV2 } from './upload-accounting-vouchers-v2'

const storeMap = {
  v1: useUploadAccountingVouchersStoreV1,
  v2: useUploadAccountingVouchersStoreV2,
}

type StoreVersion = keyof typeof storeMap

// Tipos específicos para cada versión del store
type StoreType<V extends StoreVersion> = V extends 'v1'
  ? ReturnType<typeof useUploadAccountingVouchersStoreV1>
  : V extends 'v2'
  ? ReturnType<typeof useUploadAccountingVouchersStoreV2>
  : never

export const useUploadAccountingVouchersStore = <V extends StoreVersion>(
  version: V
): StoreType<V> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as StoreType<V>
}

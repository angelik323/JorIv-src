import { usePaymentMethodsStoreV1 } from './payment-methods-v1'
import { usePaymentMethodsStoreV2 } from './payment-methods-v2'

const storeMap = {
  v1: usePaymentMethodsStoreV1,
  v2: usePaymentMethodsStoreV2,
}

type StoreVersion = keyof typeof storeMap

type StoreType<V extends StoreVersion> = V extends 'v1'
  ? ReturnType<typeof usePaymentMethodsStoreV1>
  : V extends 'v2'
    ? ReturnType<typeof usePaymentMethodsStoreV2>
    : never

export const usePaymentMethodsStore = <V extends StoreVersion>(
  version: V
): StoreType<V> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as StoreType<V>
}

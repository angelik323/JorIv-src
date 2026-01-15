import { useThirdPartyBillingStoreV1 } from './third-party-billing-v1'
import { useThirdPartyBillingStoreV2 } from './third-party-billing-v2'

type StoreVersion = 'v1' | 'v2' | 'v3'

type StoreMap = {
  v1: ReturnType<typeof useThirdPartyBillingStoreV1>
  v2: ReturnType<typeof useThirdPartyBillingStoreV2>
  v3: never
}

export const useThirdPartyBillingStore = <V extends StoreVersion>(
  version: V
): StoreMap[V] => {
  switch (version) {
    case 'v1':
      return useThirdPartyBillingStoreV1() as StoreMap[V]
    case 'v2':
      return useThirdPartyBillingStoreV2() as StoreMap[V]
    case 'v3':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

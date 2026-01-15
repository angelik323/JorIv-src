import { useFiduciaryCommissionsStoreV1 } from './fiduciary-commission-v1'
import { useFiduciaryCommissionsStoreV2 } from './fiduciary-commission-v2'

type StoreVersion = 'v1' | 'v2' | 'v3'

type StoreMap = {
  v1: ReturnType<typeof useFiduciaryCommissionsStoreV1>
  v2: ReturnType<typeof useFiduciaryCommissionsStoreV2>
  v3: never
}

export const useFiduciaryCommissionsStore = <V extends StoreVersion>(
  version: V
): StoreMap[V] => {
  switch (version) {
    case 'v1':
      return useFiduciaryCommissionsStoreV1() as StoreMap[V]
    case 'v2':
      return useFiduciaryCommissionsStoreV2() as StoreMap[V]
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

import { useFiduciaryBusinessCommissionsV1 } from './fiduciary-business-commissions-v1'
import { useFiduciaryBusinessCommissionsV2 } from './fiduciary-business-commissions-v2'

type StoreVersion = 'v1' | 'v2' | 'v3'

type StoreMap = {
  v1: ReturnType<typeof useFiduciaryBusinessCommissionsV1>
  v2: ReturnType<typeof useFiduciaryBusinessCommissionsV2>
  v3: never
}

export const useFiduciaryBusinessCommissionsStore = <V extends StoreVersion>(
  version: V
): StoreMap[V] => {
  switch (version) {
    case 'v1':
      return useFiduciaryBusinessCommissionsV1() as StoreMap[V]
    case 'v2':
      return useFiduciaryBusinessCommissionsV2() as StoreMap[V]
    case 'v3':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

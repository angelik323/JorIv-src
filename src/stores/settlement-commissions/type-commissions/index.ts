import { useTypeCommissionsStoreV1 } from './type-commissions-v1'
import { useTypeCommissionsStoreV2 } from './type-commissions-v2'

type StoreVersion = 'v1' | 'v2' | 'v3'

type StoreMap = {
  v1: ReturnType<typeof useTypeCommissionsStoreV1>
  v2: ReturnType<typeof useTypeCommissionsStoreV2>
  v3: never
}

export const useTypeCommissionsStore = <V extends StoreVersion>(
  version: V
): StoreMap[V] => {
  switch (version) {
    case 'v1':
      return useTypeCommissionsStoreV1() as StoreMap[V]
    case 'v2':
      return useTypeCommissionsStoreV2() as StoreMap[V]
    case 'v3':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

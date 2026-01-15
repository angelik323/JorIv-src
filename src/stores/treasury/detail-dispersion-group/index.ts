import { useDetailDispersionGroupStoreV1 } from './detail-dispersion-group-v1'
import { useDetailDispersionGroupStoreV2 } from './detail-dispersion-group-v2'

const storeMap = {
  v1: useDetailDispersionGroupStoreV1,
  v2: useDetailDispersionGroupStoreV2,
}

type StoreVersion = keyof typeof storeMap

// Tipos específicos para cada versión del store
type StoreType<V extends StoreVersion> = V extends 'v1'
  ? ReturnType<typeof useDetailDispersionGroupStoreV1>
  : V extends 'v2'
  ? ReturnType<typeof useDetailDispersionGroupStoreV2>
  : never

export const useDetailDispersionGroupStore = <V extends StoreVersion>(
  version: V
): StoreType<V> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as StoreType<V>
}

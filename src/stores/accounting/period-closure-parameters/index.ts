import { usePeriodClosureParametersV1 } from './period-closure-parameters-v1'
import { usePeriodClosureParametersV2 } from './period-closure-parameters-v2'

const storeMap = {
  v1: usePeriodClosureParametersV1,
  v2: usePeriodClosureParametersV2,
}

type StoreVersion = keyof typeof storeMap

// Tipos específicos para cada versión del store
type StoreType<V extends StoreVersion> = V extends 'v1'
  ? ReturnType<typeof usePeriodClosureParametersV1>
  : V extends 'v2'
  ? ReturnType<typeof usePeriodClosureParametersV2>
  : never

export const usePeriodClosureParametersStore = <V extends StoreVersion>(
  version: V
): StoreType<V> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as StoreType<V>
}

import { usePeriodClosureV1 } from './period-closure-v1'
import { usePeriodClosureV2 } from './period-closure-v2'

const storeMap = {
  v1: usePeriodClosureV1,
  v2: usePeriodClosureV2,
}

type StoreVersion = keyof typeof storeMap

// Tipos específicos para cada versión del store
type StoreType<V extends StoreVersion> = V extends 'v1'
  ? ReturnType<typeof usePeriodClosureV1>
  : V extends 'v2'
  ? ReturnType<typeof usePeriodClosureV2>
  : never

export const usePeriodClosureStore = <V extends StoreVersion>(
  version: V
): StoreType<V> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as StoreType<V>
}

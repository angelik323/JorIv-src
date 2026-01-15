import { useCommissionCalculationV2 } from './commission-calculation-v2'

type StoreVersion = 'v1' | 'v2' | 'v3'

type StoreMap = {
  v1: never
  v2: ReturnType<typeof useCommissionCalculationV2>
  v3: never
}

export const useCommissionCalculationStore = <V extends StoreVersion>(
  version: V
): StoreMap[V] => {
  switch (version) {
    case 'v1':
      throw new Error(`Versión de store no disponible: ${version}`)
    case 'v2':
      return useCommissionCalculationV2() as StoreMap[V]
    case 'v3':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

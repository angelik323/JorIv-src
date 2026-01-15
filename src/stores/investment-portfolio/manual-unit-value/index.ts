import { useManualUnitValueStoreV1 } from "@/stores/investment-portfolio/manual-unit-value/manual-unit-value-v1"

export const useManualUnitValueStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useManualUnitValueStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

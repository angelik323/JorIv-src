import { useSettlementFormulasStoreV1 } from './settlement-formulas-v1'

export const useSettlementFormulasStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useSettlementFormulasStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

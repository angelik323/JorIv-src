import { useSettlementCommissionsResourcesV1 } from './settlement-commissions-resources-v1'

export const useSettlementCommissionsResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useSettlementCommissionsResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

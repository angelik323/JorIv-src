import { useBankingEntitiesAccountingParametersCommissionsStoreV1 } from './banking-entities-v1'

export const useBankingEntitiesAccountingParametersCommissionsStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useBankingEntitiesAccountingParametersCommissionsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

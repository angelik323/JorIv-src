import { useDefinitionQuotaCounterpartPermitStoreV1 } from './definition-quotas-counterpart-permits-v1'

export const useDefinitionQuotaCounterpartPermitStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useDefinitionQuotaCounterpartPermitStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

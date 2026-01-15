import { useFiscalChargeManagementStoreV1 } from './fiscal-charge-management-v1'

export const useFiscalChargeManagementStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useFiscalChargeManagementStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

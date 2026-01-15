import { usePaymentMilestonesModificationStoreV1 } from './payment-milestones-modification-v1'

export const usePaymentMilestonesModificationStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return usePaymentMilestonesModificationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no soportada: ${version}`)
  }
}

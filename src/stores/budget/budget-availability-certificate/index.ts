import { useBudgetAvailabilityCertificateStoreV1 } from './budget-availability-certificate-v1'

export const useBudgetAvailabilityCertificateStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetAvailabilityCertificateStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

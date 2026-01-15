import { useBudgetRegistrationCertificateStoreV1 } from './budget-registration-certificate'

export const useBudgetRegistrationCertificateStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetRegistrationCertificateStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

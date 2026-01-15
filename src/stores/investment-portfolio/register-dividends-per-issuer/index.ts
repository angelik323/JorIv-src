import { useRegisterDividendsPerIssuerStoreV1 } from './register-dividends-per-issuer-v1'

export const useRegisterDividendsPerIssuerStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useRegisterDividendsPerIssuerStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

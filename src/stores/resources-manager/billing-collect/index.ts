import { useBillingCollectV1 } from './billing-resources-v1'

export const useBillingCollectStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBillingCollectV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

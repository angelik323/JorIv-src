import { useCausationWithoutPaymentInstructionsStoreV1 } from './causation-without-payment-instructions-v1'

export const useCausationWithoutPaymentInstructionsStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useCausationWithoutPaymentInstructionsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

import { useValidationFicsClosingStoreV1 } from './validation-fics-closing-v1'

export const useValidationFicsClosingStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useValidationFicsClosingStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

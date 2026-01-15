import { useRegisterAdditionsStoreV1 } from './register-additions-v1'

export const useRegisterAdditionsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useRegisterAdditionsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

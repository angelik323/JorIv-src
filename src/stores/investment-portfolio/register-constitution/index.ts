import { useRegisterConstitutionStoreV1 } from './register-constitution-v1'

export const useRegisterConstitutionFicStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useRegisterConstitutionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

import { useFixedAssetsNoveltiesStoreV1 } from './register-authorization-changes-v1'

export const useFixedAssetsNoveltiesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFixedAssetsNoveltiesStoreV1()

    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

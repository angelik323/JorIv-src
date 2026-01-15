import { useEquivalentVaucherStoreV1 } from './equivalent-vaucher-v1'

export const useEquivalentVaucherStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useEquivalentVaucherStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

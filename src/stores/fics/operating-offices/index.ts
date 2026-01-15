import { useOperatingOfficesStoreV1 } from './operating-offices-v1'

export const useOperatingOfficesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useOperatingOfficesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

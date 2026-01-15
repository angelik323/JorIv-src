import { useDispersionGroupStoreV1 } from '@/stores/treasury/dispersion-group/dispersion-group-v1'

export const useDispersionGroupStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useDispersionGroupStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

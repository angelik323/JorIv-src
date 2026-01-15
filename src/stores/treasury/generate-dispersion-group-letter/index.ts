import { useDispersionLetterStoreV1 } from './generate-dispersion-group-letter-v1'

export const useDispersionLetterStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useDispersionLetterStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

import { useFractionationTitlesStorev1 } from './fractionation-titles-v1'

export const useFractionationTitlesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFractionationTitlesStorev1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

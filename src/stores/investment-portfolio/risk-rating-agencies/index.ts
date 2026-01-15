import { useRiskRatingAgenciesStoreV1 } from './risk-rating-agencies-v1'

export const useRiskRatingAgenciesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useRiskRatingAgenciesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

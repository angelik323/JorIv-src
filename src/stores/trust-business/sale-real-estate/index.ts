import { useSaleRealEstateStoreV1 } from './sale-real-estate-v1'

export const useSaleRealEstateStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useSaleRealEstateStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

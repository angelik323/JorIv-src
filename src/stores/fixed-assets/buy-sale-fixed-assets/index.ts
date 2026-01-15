import { useBuySaleFixedAssetsV1 } from '@/stores/fixed-assets/buy-sale-fixed-assets/buy-sale-fixed-assets-v1'

export const useBuySaleFixedAssetsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBuySaleFixedAssetsV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

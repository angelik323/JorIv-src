import { useBuyOrderFixedAssetsV1 } from '@/stores/fixed-assets/buy-order-fixed-assets/buy-order-fixed-assets-v1'

export const useBuyOrderFixedAssetsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBuyOrderFixedAssetsV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

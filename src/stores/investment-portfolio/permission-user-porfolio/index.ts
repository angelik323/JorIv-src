import { usePermissionUserPorfolioStoreV1 } from '@/stores/investment-portfolio/permission-user-porfolio/permission-user-porfolio-v1'

export const usePermissionUserPorfolioStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return usePermissionUserPorfolioStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

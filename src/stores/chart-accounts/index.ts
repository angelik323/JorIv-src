import { useChartAccountsStoreV1 } from '@/stores/chart-accounts/chart-accounts-v1'
import { useChartAccountsStoreV2 } from '@/stores/chart-accounts/chart-accounts-v2'

export const useChartAccountsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useChartAccountsStoreV1()
    case 'v2':
      return useChartAccountsStoreV2()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

import { useWithdrawalContributionLimitsStoreV1 } from './withdrawal-contribution-limits-v1'

export const useWithdrawalContributionLimitsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useWithdrawalContributionLimitsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

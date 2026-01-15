import { useAccountBalancesAndThirdPartiesStoreV1 } from './account-balances-and-third-parties-v1'

export const useAccountBalancesAndThirdPartiesStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useAccountBalancesAndThirdPartiesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

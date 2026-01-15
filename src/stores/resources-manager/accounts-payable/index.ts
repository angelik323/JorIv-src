import { useAccountsPayableResourcesV1 } from './accounts-payable-resources-v1'

export const useAccountsPayableResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAccountsPayableResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

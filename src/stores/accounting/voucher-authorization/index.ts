import { useVoucherAuthorizationStoreV1 } from './voucher-authorization-v1'

export const useVoucherAuthorizationStore = (version: string) => {
  switch (version) {
    case 'v1':
      return useVoucherAuthorizationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

import { useAccountsPayableNotificationsStoreV1 } from './accounts-payable-notifications-v1'

export const useAccountsPayableNotificationsStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useAccountsPayableNotificationsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

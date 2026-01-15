import { useAuthorizationAssignmentBankAccountsStoreV1 } from './authorization-asssignment-bank-accounts-v1'
import { useAuthorizationAssignmentBankAccountsStoreV2 } from './authorization-asssignment-bank-accounts-v2'

const storeMap = {
  v1: useAuthorizationAssignmentBankAccountsStoreV1,
  v2: useAuthorizationAssignmentBankAccountsStoreV2,
}

type StoreVersion = keyof typeof storeMap

// Tipos específicos para cada versión del store
type StoreType<V extends StoreVersion> = V extends 'v1'
  ? ReturnType<typeof useAuthorizationAssignmentBankAccountsStoreV1>
  : V extends 'v2'
  ? ReturnType<typeof useAuthorizationAssignmentBankAccountsStoreV2>
  : never

export const useAuthorizationAssignmentBankAccountsStore = <
  V extends StoreVersion
>(
  version: V
): StoreType<V> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as StoreType<V>
}

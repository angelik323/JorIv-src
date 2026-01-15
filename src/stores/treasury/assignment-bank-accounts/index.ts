import { useAssignmentBankAccountsStoreV1 } from './assignment-bank-accounts-v1'
import { useAssignmentBankAccountsStoreV2 } from './assignment-bank-accounts-v2'

const storeMap = {
  v1: useAssignmentBankAccountsStoreV1,
  v2: useAssignmentBankAccountsStoreV2,
}

type StoreVersion = keyof typeof storeMap

// Tipos específicos para cada versión del store
type StoreType<V extends StoreVersion> = V extends 'v1'
  ? ReturnType<typeof useAssignmentBankAccountsStoreV1>
  : V extends 'v2'
  ? ReturnType<typeof useAssignmentBankAccountsStoreV2>
  : never

export const useAssignmentBankAccountsStore = <V extends StoreVersion>(
  version: V
): StoreType<V> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as StoreType<V>
}

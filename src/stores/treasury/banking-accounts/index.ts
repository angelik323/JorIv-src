import { useBankingAccountsV1 } from './banking-accounts-v1'
import { useBankingAccountsV2 } from './banking-accounts-v2'

const storeMap = {
  v1: useBankingAccountsV1,
  v2: useBankingAccountsV2,
}

type StoreVersion = keyof typeof storeMap

// Tipos específicos para cada versión del store
type StoreType<V extends StoreVersion> = V extends 'v1'
  ? ReturnType<typeof useBankingAccountsV1>
  : V extends 'v2'
  ? ReturnType<typeof useBankingAccountsV2>
  : never

export const useBankingAccountsStore = <V extends StoreVersion>(
  version: V
): StoreType<V> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as StoreType<V>
}

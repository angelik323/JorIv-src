import { useFinancialObligationStoreV1 } from './financial-obligation-v1'
import { useFinancialObligationStoreV2 } from './financial-obligation-v2'

const storeMap = {
  v1: useFinancialObligationStoreV1,
  v2: useFinancialObligationStoreV2,
}

type StoreMap = typeof storeMap
type ExtractStore<K extends keyof StoreMap> = ReturnType<StoreMap[K]>

export function useFinancialObligationStore(): ReturnType<typeof useFinancialObligationStoreV1>
export function useFinancialObligationStore<K extends keyof StoreMap>(version: K): ExtractStore<K>
export function useFinancialObligationStore<K extends keyof StoreMap>(
  version?: K
) {
  const selectedVersion = version ?? 'v1'
  const store = storeMap[selectedVersion as keyof StoreMap]
  return store()
}
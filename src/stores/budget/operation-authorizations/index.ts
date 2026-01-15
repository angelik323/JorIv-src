import { useOperationAuthorizationsStoreV1 } from './operation-authorizations-v1'

export const useOperationAuthorizationsStore = (version: 'v1') => {
  const stores = {
    v1: useOperationAuthorizationsStoreV1,
  }

  const getStore = stores[version]
  if (!getStore) {
    throw new Error(`Store version "${version}" does not exist.`)
  }
  return getStore()
}





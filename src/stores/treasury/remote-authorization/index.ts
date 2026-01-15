import { useRemoteAuthorizationStoreV1 } from './remote-authorization-v1'
import { useRemoteAuthorizationStoreV2 } from './remote-authorization-v2'

const storeMap = {
  v1: useRemoteAuthorizationStoreV1,
  v2: useRemoteAuthorizationStoreV2,
}

type StoreVersion = keyof typeof storeMap

type StoreType<V extends StoreVersion> = V extends 'v1'
  ? ReturnType<typeof useRemoteAuthorizationStoreV1>
  : V extends 'v2'
    ? ReturnType<typeof useRemoteAuthorizationStoreV2>
    : never

export const useRemoteAuthorization = <V extends StoreVersion>(
  version: V
): StoreType<V> => {
  const store = storeMap[version]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store() as StoreType<V>
}

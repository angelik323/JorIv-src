import { useAccountStructuresV1 } from './account-structures-v1'

const storeMap = {
    v1: useAccountStructuresV1,
}

type StoreVersion = keyof typeof storeMap

export const useAccountStructuresStore = (version: string) => {

  const store = storeMap[version as StoreVersion]

  if(!store){
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store()
}

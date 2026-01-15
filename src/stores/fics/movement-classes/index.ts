import { useSettingMovementClassesV1 } from './setting-movement-classes-v1'

const storeMap = {
  v1: useSettingMovementClassesV1,
}

type StoreVersion = keyof typeof storeMap

export const useSettingMovementClassesStore = (version: string) => {
  const store = storeMap[version as StoreVersion]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store()
}

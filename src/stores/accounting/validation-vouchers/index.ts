import { useValidationVouchersV1 } from './validation-vouchers-v1'

const storeMap = {
  v1: useValidationVouchersV1,
}

type StoreVersion = keyof typeof storeMap

export const useValidationVouchersStore = (version: string) => {
  const store = storeMap[version as StoreVersion]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store()
}

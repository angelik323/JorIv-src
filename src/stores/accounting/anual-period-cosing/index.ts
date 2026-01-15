import { useAnnualPeriodClosingv1 } from './annual-period-closing-v1'

const storeMap = {
  v1: useAnnualPeriodClosingv1,
}

type StoreVersion = keyof typeof storeMap

export const useAnnualPeriodClosingStore = (version: string) => {
  const store = storeMap[version as StoreVersion]

  if (!store) {
    throw new Error(`Versión de store no disponible: ${version}`)
  }

  return store()
}

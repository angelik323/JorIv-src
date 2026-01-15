import { useUncheckDeliveryChecksStoreV1 } from "@/stores/treasury/uncheck-delivery-checks/uncheck-delivery-checks"

export const useUncheckDeliveryChecksStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useUncheckDeliveryChecksStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

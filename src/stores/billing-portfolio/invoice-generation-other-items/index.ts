import { useInvoiceGenerationOtherItemsStoreV1 } from './invoice-generation-other-items-v1'

export const useInvoiceGenerationOtherItemsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useInvoiceGenerationOtherItemsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

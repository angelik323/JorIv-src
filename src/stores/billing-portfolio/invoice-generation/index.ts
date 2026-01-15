import { useInvoiceGenerationStoreV1 } from './invoice-generation-v1'

export const useInvoiceGenerationStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useInvoiceGenerationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

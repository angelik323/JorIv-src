import { useSupportDocumentNumberingStoreV1 } from './support-document-numbering-v1'

export const useSupportDocumentNumberingStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useSupportDocumentNumberingStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

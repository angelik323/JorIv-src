import { useBulkUploadFicsStoreV1 } from "./bulk-upload"

export const useBulkUploadFicsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBulkUploadFicsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

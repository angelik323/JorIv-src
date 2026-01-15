import { useBulkUploadStoreV1 } from './bulk-upload-v1'

export const useBulkUploadStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBulkUploadStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

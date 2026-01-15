import { useBulkUploadTemplatesStoreV1 } from '@/stores/fics/bulk-upload-templates/bulk-upload-templates'

export const useBulkUploadTemplatesStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useBulkUploadTemplatesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

import { useUploadFilesInvestmentValuationStoreV1 } from './upload-files-investment-valuation-v1'

export const useUploadFilesInvestmentValuationStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useUploadFilesInvestmentValuationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

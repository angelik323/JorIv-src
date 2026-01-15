import { useConsecutiveQueriesOfReceiptv1 } from './consecutive-queries-of-receipts-v1'

export const useConsecutiveQueriesOfReceiptStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useConsecutiveQueriesOfReceiptv1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

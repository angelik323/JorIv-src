import { useBudgetOperationLogsStoreV1 } from './operation-logs-v1'

export const useBudgetOperationLogsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetOperationLogsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

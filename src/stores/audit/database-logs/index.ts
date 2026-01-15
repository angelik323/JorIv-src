
import { useDatabaseLogsStoreV1 } from "@/stores/audit/database-logs/database-logs-v1"

export const useDatabaseLogsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useDatabaseLogsStoreV1()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

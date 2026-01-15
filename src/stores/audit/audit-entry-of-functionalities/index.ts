import { useAuditEntryOfFunctionalitiesStoreV1 } from '@/stores/audit/audit-entry-of-functionalities/audit-entry-of-functionalities-v1'

export const useAuditEntryOfFunctionalitiesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAuditEntryOfFunctionalitiesStoreV1()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

import { useQuerySystemAccessAuditStoreV1 } from '@/stores/audit/query-system-access-audit/query-system-access-audit-v1'

export const useQuerySystemAccessAuditStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useQuerySystemAccessAuditStoreV1()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

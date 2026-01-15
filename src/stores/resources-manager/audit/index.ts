import { useAuditResourcesV1 } from '@/stores/resources-manager/audit/audit-resources-v1'

export const useAuditResourcesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAuditResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

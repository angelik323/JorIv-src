import { useReportingLimitsForChangesInEquityStoreV1 } from '././reporting-limits-for-changes-in-equity-v1'

export const useReportingLimitsForChangesInEquityStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useReportingLimitsForChangesInEquityStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

import { ReportTypes } from '@/interfaces/customs'
import { useAccoutingReportV1 } from './accouting-report-v1'

export const useAccoutingReportStore = (
  version: 'v1' | 'v2',
  type: keyof ReportTypes
): ReportTypes[keyof ReportTypes] => {
  switch (version) {
    case 'v1': {
      const store = useAccoutingReportV1()
      if (!(type in store)) {
        throw new Error(`Tipo de reporte no disponible: ${type}`)
      }
      return store[type as keyof ReportTypes]
    }
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

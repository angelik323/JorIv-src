import { useReportTemplatesStoreV1 } from './report-templates-v1'
import { useReportTemplateStoreV2 } from './report-templates-v2'

export function useReportTemplatesStore(
  version: 'v1'
): ReturnType<typeof useReportTemplatesStoreV1>
export function useReportTemplatesStore(
  version: 'v2'
): ReturnType<typeof useReportTemplateStoreV2>
export function useReportTemplatesStore(version: 'v1' | 'v2') {
  switch (version) {
    case 'v1':
      return useReportTemplatesStoreV1()
    case 'v2':
      return useReportTemplateStoreV2()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

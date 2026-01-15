// Interfaces
import { IReportFormProps } from '@/interfaces/customs/accounting/v2/AccountingReport'

// Composables
import { useAlert } from '@/composables/useAlert'

// Stores
import { useOpeningRecordStore } from '@/stores/accounting/opening-record'

const useReportForm = (props: IReportFormProps) => {
  const { _downloadReport } = useOpeningRecordStore('v2')
  const { showAlert } = useAlert()

  const getFileIdByType = (type: 'PDF' | 'EXCEL') => {
    return props.reportModels.find((model) => model.mime_type.type === type)
  }

  const downloadReport = (type: 'PDF' | 'EXCEL') => {
    const file = getFileIdByType(type)

    if (!file) {
      showAlert(
        'El archivo no se encuentra disponible',
        'error',
        undefined,
        3000
      )
      return
    }

    _downloadReport(file.id)
  }

  return {
    downloadReport,
  }
}

export default useReportForm

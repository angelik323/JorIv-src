// store
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError } from '@/composables'

// utils
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IAccountingReportListReceiptsForm,
  IAccountingReportListReceiptsTable,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const URL_PATH = `${URL_PATH_ACCOUNTING}/voucher-listing-report`

export const useAccountingReportListReceiptsReportV1 = defineStore(
  'accounting-report-list-receipts-store-v1',
  {
    state: () => ({
      version: 'v1',
      receipts_list: [] as IAccountingReportListReceiptsTable[],
      receipts_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IAccountingReportListReceiptsForm | null,
    }),

    actions: {
      async _reportListReceipts(params: string) {
        let success = false

        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              success = response.data.success

              this.receipts_list = response.data.data.data ?? []
              this.receipts_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      async _downloadPdf(params: string, ids: string) {
        let success = false
        await executeApi()
          .get(
            `${URL_PATH}/export-multiple-reports?${params}&paginate=1&${ids}&amount_type=Pesos`
          )
          .then((response) => {
            success = response.data.success

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      _downloadPdfIndividual(params: string, id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        const url = `${URL_PATH}/export-single-report/${id}?${params}`

        return executeApi()
          .get(url, {
            responseType: 'blob',
            headers: { Accept: 'application/pdf' },
          })
          .then((response) => {
            const { data, headers, status } = response
            const ct = String(headers['content-type'] || '').toLowerCase()

            if (ct.includes('application/json')) {
              return (data as Blob).text().then((text) => {
                try {
                  const json = JSON.parse(text)
                  showAlert(
                    json?.message || 'El reporte no está disponible aún',
                    'error',
                    undefined,
                    TIMEOUT_ALERT
                  )
                } catch {
                  showAlert(
                    'Error procesando la respuesta del servidor',
                    'error',
                    undefined,
                    TIMEOUT_ALERT
                  )
                }
              })
            }

            const cd = headers['content-disposition'] || ''
            let fileName = `reporte-${id}.pdf`
            const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)/i.exec(cd)
            if (match && match[1]) fileName = decodeURIComponent(match[1])

            const pdfBlob = ct.includes('application/pdf')
              ? data
              : new Blob([data], { type: 'application/pdf' })

            const href = URL.createObjectURL(pdfBlob)
            const a = document.createElement('a')
            a.href = href
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(href)

            showAlert(
              status === 200
                ? 'Descarga generada con éxito'
                : 'Error al generar la descarga',
              status === 200 ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _setDataInformationForm(
        data_to_set: IAccountingReportListReceiptsForm | null
      ) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _cleanData() {
        this.receipts_list = []
        this.receipts_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

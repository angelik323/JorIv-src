import { useAlert, useShowError, useUtils } from '@/composables'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'

const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useQueryMovementAccountStoreV1 = defineStore(
  'query-movement-account-store-v1',
  {
    state: () => ({
      query_movement_list: [],
      query_movement_account_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      excel_data_url: '' as string,
      url_file: '' as string,
    }),
    actions: {
      async _getQueryMovementAccounts(params: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/account-movements-report/generate-report?${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.query_movement_list = response.data?.data?.data ?? []
              this.query_movement_account_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.query_movement_account_pages.lastPage =
                response.data?.data?.last_page ?? 0
              this.excel_data_url =
                response.data?.data?.reportables?.report_excel_url
              return showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _getUrlReport(params: string | number) {
        let success = false
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/reportables/get-url-report/${params}`)
          .then((response) => {
            const { data } = response
            success = data.success
            this.url_file = data.data.report_url
            return showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message)
          })
        return success
      },
      async _downloadFile() {
        let success = false
        try {
          const urlParts = this.url_file.split('/')
          const fileNameFromUrl =
            urlParts.at(-1)?.split('?')[0] || 'reporte.xlsx'

          const file = await useUtils().getFileFromS3(
            this.url_file,
            fileNameFromUrl
          )

          if (!file) {
            showAlert(
              'Error al descargar el archivo',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
            return success
          }

          const blob = new Blob([file], { type: file.type })
          useUtils().downloadBlobXlxx(blob, file.name)
          success = true
          showAlert(
            'Archivo descargado exitosamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        } catch (e) {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        }
        return success
      },
    },
  }
)

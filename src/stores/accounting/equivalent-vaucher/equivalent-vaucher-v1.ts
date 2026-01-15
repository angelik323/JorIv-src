import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IEquivalentVaucherCreatePayload,
  IEquivalentVaucherList,
  IExportFailureItem,
  IFailureItem,
  IFileEquivalentVaucher,
  TValidateResponse,
} from '@/interfaces/customs/accounting'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTING}/equivalent-vouchers`

export const useEquivalentVaucherStoreV1 = defineStore(
  'equivalent-vaucher-store-v1',
  {
    state: () => ({
      version: 'v1',
      equivalent_vaucher_list: [] as IEquivalentVaucherList[],
      equivalent_vaucher_pages: {
        currentPage: 0,
        lastPage: 0,
        total: 0,
      },
      failures_list: [] as IFailureItem[],
      validate_result: null as TValidateResponse | null,
    }),

    actions: {
      async _createEquivalentVaucher(payload: IEquivalentVaucherCreatePayload) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _getListEquivalentVaucher(params = '') {
        await executeApi()
          .get(`${URL_PATH}?paginate=true${params}`)
          .then((response) => {
            const data = response.data
            if (data.success) {
              this.equivalent_vaucher_list = Array.isArray(data.data)
                ? data.data
                : data.data.data
              this.equivalent_vaucher_pages = {
                currentPage: data?.data?.current_page ?? 1,
                lastPage: data?.data?.last_page ?? 1,
                total: data?.data?.total ?? 0,
              }

              showAlert(data.message, 'success', undefined, TIMEOUT_ALERT)
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadTemplate() {
        await executeApi()
          .get(`${URL_PATH}/download-template`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)

            showAlert(
              'Archivo exportado exitosamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _validateTemplate(
        payload: IFileEquivalentVaucher
      ): Promise<TValidateResponse | null> {
        let result: TValidateResponse | null = null

        await executeApi()
          .post(`${URL_PATH}/validate`, payload, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            const data = response.data
            showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            this.validate_result = data
            this.failures_list = data.data.failures ?? []
            result = data
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return result
      },

      async _exportFailuresXlsx(failures: IExportFailureItem[]): Promise<void> {
        if (!failures.length) {
          showAlert('No hay errores para exportar.', 'warning')
          return
        }

        executeApi()
          .post(
            `${URL_PATH}/export-failures`,
            { failures },
            { responseType: 'blob' }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            showAlert(
              'Errores exportados correctamente.',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _deleteEquivalentVaucher(id: number): Promise<boolean> {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/${id}`)
          .then((response) => {
            const data = response.data
            showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            if (data.success) {
              this.equivalent_vaucher_list =
                this.equivalent_vaucher_list.filter((item) => item.id !== id)
              success = true
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },
    },
  }
)

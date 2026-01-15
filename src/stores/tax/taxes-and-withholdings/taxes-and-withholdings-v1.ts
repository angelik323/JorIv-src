import { defineStore } from 'pinia'

// APIs
import { executeApi } from '@/apis'

// Utils
import { URL_PATH_TAXES_AND_WITHHOLDINGS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Interfaces
import {
  ITaxesAndWithholdingsList,
  ITaxesAndWithholdingsForm,
  Validity,
} from '@/interfaces/customs/tax/TaxesAndWithholdings'

export const useTaxesAndWithholdingsV1 = defineStore(
  'taxes-and-withholdings-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _getTaxesAndWithholdings(params: string): Promise<{
        data: ITaxesAndWithholdingsList[]
        pages: { currentPage: number; lastPage: number }
      }> {
        let response_data: ITaxesAndWithholdingsList[] = []
        let response_pages = { currentPage: 1, lastPage: 1 }
        await executeApi()
          .get(
            `${URL_PATH_TAXES_AND_WITHHOLDINGS}${
              params ? params + '&' : '?'
            }paginate=true`
          )
          .then((response) => {
            response_data = response?.data?.data?.data ?? []
            response_pages = {
              currentPage: response?.data?.data?.current_page ?? 1,
              lastPage: response?.data?.data?.last_page ?? 1,
            }
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return { data: response_data, pages: response_pages }
      },

      async _createTaxAndWithholding(
        payload: ITaxesAndWithholdingsForm | null
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_TAXES_AND_WITHHOLDINGS}`, payload)
          .then((response) => {
            if (response.data.success) {
              success = true
            }

            useAlert().showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _getTaxAndWithholdingById(
        id: number
      ): Promise<ITaxesAndWithholdingsForm | null> {
        let response_data: ITaxesAndWithholdingsForm | null = null
        await executeApi()
          .get(`${URL_PATH_TAXES_AND_WITHHOLDINGS}/${id}`)
          .then((response) => {
            response_data = response?.data?.data ?? null

            useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return response_data
      },

      async _updateTaxAndWithholding(
        id: number,
        payload: ITaxesAndWithholdingsForm
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .put(`${URL_PATH_TAXES_AND_WITHHOLDINGS}/${id}`, payload)
          .then((response) => {
            if (response.data.success) {
              success = true
            }

            useAlert().showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _deleteTaxAndWithholding(id: number): Promise<boolean> {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_TAXES_AND_WITHHOLDINGS}/${id}`)
          .then((response) => {
            if (response.data.success) {
              success = true
            }

            useAlert().showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _changeStatus(id: number): Promise<boolean> {
        let success = false
        await executeApi()
          .patch(`${URL_PATH_TAXES_AND_WITHHOLDINGS}/${id}/status`)
          .then((response) => {
            if (response.data.success) {
              success = true
            }

            useAlert().showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _getValiditiesById(id: number): Promise<Validity[] | null> {
        let response_data: Validity[] | null = null
        await executeApi()
          .get(`${URL_PATH_TAXES_AND_WITHHOLDINGS}/${id}/periods`)
          .then((response) => {
            response_data = response?.data?.data ?? null

            useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return response_data
      },

      async _updateValidities(id: number, payload: Validity): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_TAXES_AND_WITHHOLDINGS}/${id}/periods`, payload)
          .then((response) => {
            if (response.data.success) {
              success = true
            }

            useAlert().showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _getDownloadExcel() {
        await executeApi()
          .get(`${URL_PATH_TAXES_AND_WITHHOLDINGS}/export}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const { data, message } = response.data
            const blob = new Blob([data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)
            if (response.status === 200) {
              return useAlert().showAlert(
                message || 'Archivo descargado con éxito',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },
    },
  }
)

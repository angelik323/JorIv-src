import { IAccountEquivalenceRequest } from '@/interfaces/customs'
import { useUtils, useAlert, useShowError } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePucAccountEquivalenceStoreV1 = defineStore(
  'puc-account-equivalence-v1',
  {
    state: () => ({
      version: 'v1',
      account_equivalence_list: [],
      account_equivalence_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _listAction(params: string) {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/account-equivalences?${params}`)
          .then((response) => {
            if (response.data.success) {
              this.account_equivalence_list = response.data.data ?? []
              this.account_equivalence_pages = {
                currentPage: response.data?.current_page ?? 1,
                lastPage: response.data?.last_page ?? 1,
              }
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createAction(data: IAccountEquivalenceRequest) {
        await executeApi()
          .post(`${URL_PATH_ACCOUNTING}/account-equivalences`, data)
          .then((response) => {
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _updateAction(data: IAccountEquivalenceRequest) {
        await executeApi()
          .put(
            `${URL_PATH_ACCOUNTING}/account-equivalences/${data.source_structure_id}`,
            data
          )
          .then((response) => {
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getByIdAction(id: string) {
        return await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/account-equivalences/${id}`)
          .then((response) => {
            if (response.data.success) {
              return response.data.data
            }

            showAlert(
              response.data.message || 'Error al obtener el balance',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _exportExcelAction(id: string) {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/account-equivalences/${id}/export`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              response.data.message,
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)

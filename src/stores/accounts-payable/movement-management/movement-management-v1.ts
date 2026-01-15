// core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import { IErrors } from '@/interfaces/global'
import {
  IMovementManagementFileErrorJson,
  IMovementManagementFileResponse,
  IMovementManagementCreateBulkPayload,
  IMovementManagementCreatePayload,
  IMovementManagementForm,
  IMovementManagementItem,
  IMovementManagementUpdatePayload,
} from '@/interfaces/customs/accounts-payable/MovementManagement'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// prepare composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useMovementManagementStoreV1 = defineStore(
  'movement-management-store-v1',
  {
    state: () => ({
      movement_management_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      movement_management_list: [] as IMovementManagementItem[],
    }),

    actions: {
      async _getMovementList(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.movement_management_list = items

            this.movement_management_pages = {
              currentPage: current_page,
              lastPage: last_page,
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _toggleStatusMovement(id: number) {
        let success = false
        await executeApi()
          .patch(
            `${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes/${id}/toggle-status`
          )
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _createMovementManagement(
        payload: IMovementManagementCreatePayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes`, payload)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _createBulkMovementManagement(
        payload: IMovementManagementCreateBulkPayload
      ) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes/import/bulk`,
            payload
          )
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _downloadExcelMovementManagementTemplate() {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes/download-template`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadExcelMovementManagementErrors(file: File) {
        const formData = new FormData()
        formData.append('file', file)

        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes/import?download-errors=true`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadExcelMovementManagementErrorsJson(file: File) {
        let responseData: IMovementManagementFileErrorJson = {
          summary: {
            total: 0,
            success: 0,
            errors: 0,
            has_errors: false,
          },
          validated_rows: [],
          error_rows: [],
        }

        const formData = new FormData()
        formData.append('file', file)

        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes/import?return-rows=true`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then((response) => {
            responseData = response.data.data
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return responseData
      },

      async _uploadFile(file: File) {
        let file_response: IMovementManagementFileResponse = {
          inserted: 0,
          total: 0,
          errors: [],
        }

        const formData = new FormData()
        formData.append('file', file)

        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes/import`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then((response) => {
            file_response = response.data
          })
          .catch((e) => {
            file_response = e.response.data
            const error = { message: e.message } as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return file_response
      },

      async _deleteMovement(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes/${id}`)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _getMovementById(id: number) {
        let responseData: IMovementManagementForm | null = null
        await executeApi()
          .get(`${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              responseData = data
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return responseData
      },

      async _updateMovementManagement(
        payload: IMovementManagementUpdatePayload,
        id: number
      ) {
        let success = false
        await executeApi()
          .put(`${URL_PATH_ACCOUNTS_PAYABLE}/movement-codes/${id}`, payload)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      _clearData() {
        this.movement_management_list = []
        this.movement_management_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)

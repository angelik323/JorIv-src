import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IGuaranteesResponse,
  IGuaranteesList,
  IGuaranteesForm,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH_GUARANTEES = `${TRUST_BUSINESS_API_URL}/guarantees`

export const useGuaranteesStoreV1 = defineStore('guarantees-store-v1', {
  state: () => ({
    version: 'v1',
    guarantees_list: [] as IGuaranteesList[],
    guarantees_response: null as IGuaranteesResponse | null,
    guarantees_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_documents_form: [] as File[] | [],
    ids_to_delete: [] as number[] | [],
    data_authorization: null as string | null,
  }),

  actions: {
    async _getGuaranteesList(params: string) {
      this._clearData()

      await executeApi()
        .get(`${URL_PATH_GUARANTEES}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.guarantees_list = response.data?.data?.data ?? []
            this.guarantees_pages = {
              currentPage: response.data?.data?.current_page ?? 1,
              lastPage: response.data?.data?.last_page ?? 1,
            }
          }

          return useAlert().showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
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

    async _getGuaranteesByBusinessId(businessId: number, showAlert = true) {
      await executeApi()
        .get(`${URL_PATH_GUARANTEES}?paginate=1`, {
          params: { 'filter[business_trust_id]': businessId },
        })
        .then((response) => {
          if (response.data.success) {
            this.guarantees_list = response.data?.data?.data ?? []
            this.guarantees_pages = {
              currentPage: response.data?.data?.current_page ?? 0,
              lastPage: response.data?.data?.lastPage ?? 0,
            }
          }

          if (showAlert) {
            useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)

          if (showAlert) {
            useAlert().showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          }
        })
    },

    async _getByIdGuarantees(guaranteeId: number) {
      await executeApi()
        .get(`${URL_PATH_GUARANTEES}/${guaranteeId}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.guarantees_response = { ...responseData }
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

    async _createGuarantees(data: Partial<IGuaranteesForm>) {
      let success = false

      await executeApi()
        .post(`${URL_PATH_GUARANTEES}`, data)
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

    async _updateGuarantees(
      data: Partial<IGuaranteesForm>,
      guaranteeId: number
    ) {
      let success = false

      await executeApi()
        .put(`${URL_PATH_GUARANTEES}/${guaranteeId}`, data)
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

    async _authorize(id: number, action: boolean, observation: string) {
      let success = false

      await executeApi()
        .patch(`${TRUST_BUSINESS_API_URL}/guarantees/${id}`, {
          registration_status_id: action ? 71 : 10,
          registration_status_message: observation,
        })
        .then((response) => {
          const { message, success: responseSuccess } = response.data
          success = responseSuccess

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

    async _downloadExcel(params: string) {
      await executeApi()
        .get(`${URL_PATH_GUARANTEES}/export/excel?${params}`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          const fileName = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, fileName)

          return showAlert(
            'La descarga comenzará pronto',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _deleteAction(id: number) {
      let success = false

      await executeApi()
        .delete(`${TRUST_BUSINESS_API_URL}/guarantees/${id}`)
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

    async _deleteFilesAction(): Promise<boolean> {
      let success = false
      if (!this.ids_to_delete.length) return success

      this.ids_to_delete.forEach(async (element) => {
        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/policy/file/${element}`)
          .then((response) => {
            success = response.data.success
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
      })

      return success
    },

    _clearData() {
      this.guarantees_list = []
      this.guarantees_response = null
      this.guarantees_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
    async _addFile(name: string, type: string, business_id: number) {
      let success = false
      let documentId = 0
      let uploadUrl = ''
      let filePath = ''

      await executeApi()
        .get(
          `${TRUST_BUSINESS_API_URL}/policy/file/signed?name=${name}&document_type=${type}&business_id=${business_id}`
        )
        .then((response) => {
          const { data: responseData, success: responseSuccess } = response.data

          success = responseSuccess
          documentId = responseData.document_id ?? documentId
          uploadUrl = responseData.upload_url ?? ''
          filePath = responseData.file_path ?? ''
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return { success, documentId, uploadUrl, filePath }
    },

    _setDataDocumentsTab(data_to_set: File[] | []) {
      this.data_documents_form = [...data_to_set]
    },

    _setRecordStatus(data: string) {
      this.data_authorization = data
    },
  },
})

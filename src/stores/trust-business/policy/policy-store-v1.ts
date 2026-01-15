// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

// interfaces
import {
  IPolicyCreate,
  IPolicyList,
  IPolicyResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}

export const usePolicyStoreV1 = defineStore('policy-store-v1', {
  state: () => ({
    version: 'v1',
    policy_transfers_list: [] as IPolicyList[],
    policy_transfers_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as IPolicyCreate | null,
    policy_request: null as IPolicyResponse | null,
    data_documents_form: [] as File[] | [],
    ids_to_delete: [] as number[] | [],
    data_authorization: null as string | null,
    link_download: null as string | null,
  }),
  actions: {
    async _getListAction(params: string) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/policy?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.policy_transfers_list = response.data?.data?.data ?? []
            this.policy_transfers_pages = {
              currentPage: response.data?.data?.current_page ?? 0,
              lastPage: response.data?.data?.last_page ?? 0,
            }
            this.link_download = response.data?.data?.route_export
          }

          return useAlert().showAlert(
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
    },

    async _getPoliciesByBusinessId(businessId: number, showAlert = true) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/policy?paginate=1`, {
          params: { 'filter[business_trust_id]': businessId },
        })
        .then((response) => {
          if (response.data.success) {
            this.policy_transfers_list = response.data?.data?.data ?? []
            this.policy_transfers_pages = {
              currentPage: response.data?.data?.current_page ?? 0,
              lastPage: response.data?.data?.last_page ?? 0,
            }
            this.link_download = response.data?.data?.route_export
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
        .catch((error) => {
          if (showAlert) {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          }
        })
    },

    async _downloadByRowdData(params: string): Promise<void> {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/policy/policies/export?${params}`, {
          responseType: 'blob',
        })
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

    async _getByIdPolicy(id: number) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/policy/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.policy_request = response.data?.data
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

    async _createPolicy(data: IPolicyCreate) {
      let success = false

      await executeApi()
        .post(`${TRUST_BUSINESS_API_URL}/policy`, data, CONFIG)
        .then((response) => {
          success = response.data.success

          return useAlert().showAlert(
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
      return success
    },

    async _updatePolicy(id: number, data: IPolicyCreate) {
      let success = false

      await executeApi()
        .put(`${TRUST_BUSINESS_API_URL}/policy/${id}`, data)
        .then((response) => {
          success = response.data.data?.id

          return useAlert().showAlert(
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
      return success
    },

    async _deletePolicy(id: number) {
      let success = false

      await executeApi()
        .delete(`${TRUST_BUSINESS_API_URL}/policy/${id}`)
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

    async _authorize(id: number, action: boolean, observation: string) {
      let success = false

      await executeApi()
        .patch(`${TRUST_BUSINESS_API_URL}/policy/${id}`, {
          record_status_id: action ? 71 : 10,
          record_status_message: observation,
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

    _setDataInformationForm(data: IPolicyCreate | null) {
      this.data_information_form = data ? { ...data } : null
    },

    _setIdToDelete(ids: number[] | []) {
      if (ids.length === 0) {
        this.ids_to_delete = []
      } else {
        this.ids_to_delete = [...this.ids_to_delete, ...ids]
      }
    },

    _setDataDocuments(data_to_set: File[] | []) {
      this.data_documents_form = [...data_to_set]
    },

    _setRecordStatus(data: string) {
      this.data_authorization = data
    },

    _clearData() {
      this.policy_transfers_list = []
      this.policy_transfers_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})

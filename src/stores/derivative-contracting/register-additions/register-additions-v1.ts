import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import {
  IRegisterContractsList,
  IRegisterAdditionsForm,
  IRegisterAdditionsResponse,
  IGeneratePresignedUrlAdditions,
  IContractData,
  IAttachedDocuments,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'

const URL_PATH_REGISTER_ADDITIONS = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract-additions`
const URL_PATH_CONTRACTS = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract`
const URL_PATH_DOCUMENTS = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract-addition-document-attachments/attachments-by-contract-type`
const URL_PATH_CLAUSES_PDF = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract-addition-clauses/export-pdf`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterAdditionsStoreV1 = defineStore(
  'register-additions-store-v1',
  {
    state: () => ({
      version: 'v1',
      register_contracts_list: [] as IRegisterContractsList[],
      register_additions_response: null as IRegisterAdditionsResponse | null,

      contractData: null as IContractData | null,

      attach_documents: null as IAttachedDocuments[] | null,

      register_contracts_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      register_additions_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getContractDataById(id: number) {
        await executeApi()
          .get(`${URL_PATH_CONTRACTS}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data

            if (success && data) {
              this.contractData = data?.contract
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

      async _getRegisterContractsList(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(URL_PATH_REGISTER_ADDITIONS, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.register_contracts_list = items
            this.register_contracts_pages.currentPage = current_page
            this.register_contracts_pages.lastPage = last_page

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

      async _getByIdRegisterAdditions(id: number) {
        await executeApi()
          .get(`${URL_PATH_REGISTER_ADDITIONS}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.register_additions_response = { ...responseData }
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

      async _createRegisterAdditions(data: Partial<IRegisterAdditionsForm>) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_REGISTER_ADDITIONS}`, data)
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

      async _updateRegisterAdditions(
        data: Partial<IRegisterAdditionsForm>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH_REGISTER_ADDITIONS}/${id}`, data)
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

      async _deleteRegisterAdditions(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH_REGISTER_ADDITIONS}/${id}`)
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

      async _changeStatus(id: number, status_id: number) {
        let success = false

        await executeApi()
          .patch(`${URL_PATH_REGISTER_ADDITIONS}/${id}`, { status_id })
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
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _generatePresignedUrl(payload: IGeneratePresignedUrlAdditions) {
        let success = false
        let documentId = 0
        let uploadUrl = ''
        let filePath = ''

        await executeApi()
          .post(`${URL_PATH_REGISTER_ADDITIONS}/file-signed`, payload)
          .then((response) => {
            const { data: responseData, success: responseSuccess } =
              response.data

            success = responseSuccess
            documentId = responseData.document_id ?? 0
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

      async _getDocumentosByContract(id: number) {
        await executeApi()
          .get(`${URL_PATH_DOCUMENTS}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.attach_documents = responseData
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

      async _generateClausePDF(ids: number[]) {
        await executeApi()
          .get(`${URL_PATH_CLAUSES_PDF}`, {
            params: { clause_ids: ids },
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)

            useUtils().downloadBlob(blob, fileName)
            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.register_contracts_list = []
        this.register_additions_response = null
        this.register_contracts_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

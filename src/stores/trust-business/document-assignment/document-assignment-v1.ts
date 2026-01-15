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
  IDocumentAssignmentList,
  IDocumentAssignmentCreate,
  IDocumentAssignmentForm,
  IDocumentAssignmentResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useDocumentAssignmentStorev1 = defineStore(
  'document-assignment-v1',
  {
    state: () => ({
      version: 'v1',
      document_assignment_list: [] as IDocumentAssignmentList[],
      document_with_characteristics: [] as any[],
      data_documents_form: [] as File[] | [],
      ids_to_delete: [] as number[] | [],

      document_assignment_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IDocumentAssignmentForm | null,
      document_assignment_response: null as IDocumentAssignmentResponse | null,
    }),
    actions: {
      async _getListAction(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/document-assign/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.document_assignment_list = response.data?.data?.data ?? []
              this.document_assignment_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
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

      async _getlistOfDocumentCharacteristics(
        businessTrustDocumentType: number
      ) {
        this.document_with_characteristics = []
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/document-assign/list-characteristics/${businessTrustDocumentType}`
          )
          .then((response) => {
            if (response.data.success) {
              this.document_with_characteristics = response.data?.data ?? []
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
      async _getDocumentAssignmentById(id: number) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/document-assign/list-characteristics/${id}`
          )
          .then((response) => {
            if (response.data.success) {
              this.document_assignment_response = response.data?.data ?? null
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

      async _createDocumentAssignment(data: IDocumentAssignmentCreate) {
        let success = false

        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/document-assign/new/${data.businessTrustId}`,
            data
          )
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
            success = false
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
        return success
      },

      async _updateDocumentAssignment(
        data: IDocumentAssignmentCreate,
        documentId: number
      ) {
        let success = false

        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/document-assign/update/${documentId}`,
            data
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

      async _showDocumentAssignmentById(id: number) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/document-assign/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.document_assignment_response = response.data?.data ?? null
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

      async _downloadExcel(params: string, ids: number[] = []) {
        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/document-assign/download-report?paginate=1${params}`,
            { ids: ids },
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Descarga exitosa',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _singDocumentAssignment(documentId: number) {
        let success = false

        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/file/signed/${documentId}`)
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
            success = false
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
        return success
      },

      async _addFile(name: string, type: string) {
        let success = false
        let documentId = 0
        let uploadUrl = ''
        let filePath = ''

        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/document-assign/file/signed?name=${name}&document_type=${type}`
          )
          .then((response) => {
            const { data: responseData, success: responseSuccess } =
              response.data

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
      _setDataInformationForm(data: IDocumentAssignmentForm | null) {
        this.data_information_form = data
      },

      _setDataDocuments(data_to_set: File[] | []) {
        this.data_documents_form = [...data_to_set]
      },

      _setIdToDelete(ids: number[] | []) {
        this.ids_to_delete = [...this.ids_to_delete, ...ids]
      },

      _clearData() {
        this.document_assignment_list = []
        this.document_assignment_response = null
        this.document_assignment_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

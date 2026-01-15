import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useAlert, useShowError } from '@/composables'
import {
  IApiResponse,
  IAssignEncryptDocument,
  IAssignEncryptDocumentUpdatePayload,
  IGenerateFileSignPayload,
  IGenerateFileSignResponse,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAssignEncryptDocumentsStoreV1 = defineStore(
  'assign-encrypt-documents-store-v1',
  {
    state: () => ({
      current_document: null as IAssignEncryptDocument | null,
      documents_list: [] as IAssignEncryptDocument[],
      documents_pages: {
        currentPage: 0,
        lastPage: 0,
        total: 0,
        perPage: 20,
      },
      loading: false,
    }),

    actions: {
      async fetchAssignEncryptDocuments(queryParams?: string) {
        this.loading = true

        const url = `${URL_PATH_TREASURIES}/assign-encrypt-documents?${
          queryParams ? `paginate=1${queryParams.toString()}` : ''
        }`

        await executeApi()
          .get(url)
          .then((response) => {
            const data = response.data
            if (data.success) {
              const paginated = data.data

              this.documents_list = paginated.data ?? []
              this.documents_pages = {
                currentPage: paginated.current_page ?? 1,
                lastPage: paginated.last_page ?? 1,
                total: paginated.total ?? 0,
                perPage: paginated.per_page ?? 20,
              }

              showAlert(data.message, 'success', undefined, TIMEOUT_ALERT)
            } else {
              showAlert(data.message, 'error', undefined, TIMEOUT_ALERT)
            }
          })
          .catch((error) => {
            this.documents_list = []
            this.documents_pages = {
              currentPage: 0,
              lastPage: 0,
              total: 0,
              perPage: 20,
            }
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
          .finally(() => {
            this.loading = false
          })
      },

      async fetchAssignEncryptDocumentDetail(
        bankStructureId: string | number
      ): Promise<IAssignEncryptDocument | null> {
        this.loading = true

        const url = `${URL_PATH_TREASURIES}/assign-encrypt-documents/show/${bankStructureId}`

        return await executeApi()
          .get(url)
          .then((response) => {
            const { success, data, message } = response.data

            if (success) {
              this.current_document = data as IAssignEncryptDocument

              showAlert(message, 'success', undefined, TIMEOUT_ALERT)
              return this.current_document
            } else {
              showAlert(message, 'error', undefined, TIMEOUT_ALERT)
              this.current_document = null
              return null
            }
          })
          .catch((error) => {
            this.current_document = null
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .finally(() => {
            this.loading = false
          })
      },

      async createAssignEncryption(
        payload: IAssignEncryptDocumentUpdatePayload
      ): Promise<IAssignEncryptDocument | null> {
        this.loading = true
        let result: IAssignEncryptDocument | null = null

        await executeApi()
          .post<IApiResponse<IAssignEncryptDocument>>(
            `${URL_PATH_TREASURIES}/assign-encrypt-documents/store`,
            payload
          )
          .then((response) => {
            const { success, data, message } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            if (success) {
              result = data
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
          .finally(() => {
            this.loading = false
          })

        return result
      },

      async updateAssignEncryptDocument(
        id: number | string,
        payload: IAssignEncryptDocumentUpdatePayload
      ): Promise<{ success: boolean }> {
        this.loading = true
        let result = { success: false }

        await executeApi()
          .put<IApiResponse<IAssignEncryptDocument>>(
            `${URL_PATH_TREASURIES}/assign-encrypt-documents/update/${id}`,
            payload
          )
          .then((response) => {
            const { success, message } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            result = { success }
          })
          .catch((error) => {
            const msg = showCatchError(error)
            showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
            result = { success: false }
          })
          .finally(() => {
            this.loading = false
          })

        return result
      },

      async generateFileSign(
        payload: IGenerateFileSignPayload
      ): Promise<IGenerateFileSignResponse | null> {
        this.loading = true
        let result: IGenerateFileSignResponse | null = null

        await executeApi()
          .post<IApiResponse<IGenerateFileSignResponse>>(
            `${URL_PATH_TREASURIES}/assign-encrypt-documents/file/signed`,
            payload
          )
          .then((response) => {
            const { success, data, message } = response.data
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            if (success) {
              result = data
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
          .finally(() => {
            this.loading = false
          })

        return result
      },
    },
  }
)

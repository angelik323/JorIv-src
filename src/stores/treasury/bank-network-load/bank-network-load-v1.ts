// Pinia - Axios
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IBankNetworkLoadItem,
  IFileSignedRequest,
  IFileSignedResponse,
  IBankNetworkUploadRequest,
  IBankNetworkUploadResponse,
  IFileLoadedResponse,
  IValidationResult,
  IProcessBankNetworkUploadResponse,
  IBankNetworkLoadModel,
  IBankNetworkLoadDetail,
} from '@/interfaces/customs/treasury/BankNetworkLoad'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBankNetworkLoadStoreV1 = defineStore(
  'bank-network-load-store-v1',
  {
    state: () => ({
      bank_network_load: {
        currentPage: 0,
        lastPage: 0,
      },
      bank_network_load_list: [] as IBankNetworkLoadItem[],
      validation_result: null as IValidationResult | null,
      signed_url_response: null as IFileSignedResponse | null,
      upload_response: null as IBankNetworkUploadResponse | null,
      file_loaded_response: null as IFileLoadedResponse | null,
      process_response: null as IProcessBankNetworkUploadResponse | null,
    }),

    actions: {
      async _getBankNetworkLoadList(params: string) {
        this._clearData()

        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/banking-network-uploads?paginate=1${params}`
          )
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.bank_network_load_list = items.map(
              (item: IBankNetworkLoadItem) => ({
                ...item,
              })
            )
            this.bank_network_load.currentPage = current_page
            this.bank_network_load.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _deleteBankNetworkLoad(id: number) {
        await executeApi()
          .delete(`${URL_PATH_TREASURIES}/banking-network-uploads/${id}`)
          .then((response) => {
            showAlert(response.data.message, 'success')
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _deleteBankNetworkLoadFile(documentId: number) {
        await executeApi()
          .delete(
            `${URL_PATH_TREASURIES}/banking-network-uploads/file/${documentId}`
          )
          .then((response) => {
            showAlert(response.data.message, 'success')
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadTemplate(bankStructureId: number) {
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/banking-network-uploads/download-template`,
            {
              params: { bank_structure_id: bankStructureId },
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type:
                response.headers['content-type'] || 'text/csv;charset=utf-8',
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Archivo descargado correctamente',
              'success',
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

      async _exportFailures(uploadId: number) {
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/banking-network-uploads/${uploadId}/export-failures`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], {
                type:
                  response.headers['content-type'] || 'text/csv;charset=utf-8',
              })
              const fileName = useUtils().getNameBlob(response)
              useUtils().downloadBlobXlxx(blob, fileName)

              return showAlert(
                'Archivo descargado correctamente',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((e) => {
            const error = e as IErrors
            if (error.response?.data) {
              if (error.response.data instanceof Blob) {
                error.response.data.text().then((text) => {
                  try {
                    const errorData = JSON.parse(text)
                    showAlert(
                      errorData.message || 'Error al exportar las fallas',
                      'error',
                      undefined,
                      TIMEOUT_ALERT
                    )
                  } catch {
                    showAlert(
                      'Error al exportar las fallas',
                      'error',
                      undefined,
                      TIMEOUT_ALERT
                    )
                  }
                })
              } else if (error.response.data.message) {
                showAlert(
                  error.response.data.message,
                  'error',
                  undefined,
                  TIMEOUT_ALERT
                )
              } else {
                const message = showCatchError(error)
                showAlert(message, 'error', undefined, TIMEOUT_ALERT)
              }
            } else {
              const message = showCatchError(error)
              showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            }
          })
      },

      async _validateBankNetworkUpload(uploadId: number) {
        return await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/banking-network-uploads/${uploadId}/validate`
          )
          .then((response) => {
            if (response.data.success) {
              this.validation_result = response.data
              showAlert(
                response.data.message,
                'success',
                undefined,
                TIMEOUT_ALERT
              )
              return response.data
            } else {
              this.validation_result = null
              showAlert(
                response.data.message,
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              return null
            }
          })
          .catch((e) => {
            this.validation_result = null
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _getFileSignedUrl(
        fileData: IFileSignedRequest
      ): Promise<IFileSignedResponse | null> {
        return await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/banking-network-uploads/file/signed`,
            fileData
          )
          .then((response) => {
            if (response.data.success) {
              this.signed_url_response = response.data as IFileSignedResponse
              return response.data as IFileSignedResponse
            } else {
              this.signed_url_response = null
              return null
            }
          })
          .catch((e) => {
            this.signed_url_response = null
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createBankNetworkUpload(
        uploadData: IBankNetworkUploadRequest
      ): Promise<IBankNetworkUploadResponse | null> {
        return await executeApi()
          .post(`${URL_PATH_TREASURIES}/banking-network-uploads`, uploadData)
          .then((response) => {
            if (response.data.success) {
              this.upload_response = response.data as IBankNetworkUploadResponse
              showAlert(
                response.data.message,
                'success',
                undefined,
                TIMEOUT_ALERT
              )
              return response.data as IBankNetworkUploadResponse
            } else {
              this.upload_response = null
              showAlert(
                response.data.message,
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              return null
            }
          })
          .catch((e) => {
            this.upload_response = null
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _updateBankNetworkUpload(
        uploadData: IBankNetworkUploadRequest,
        bankNetworkUploadId?: number | null
      ): Promise<IBankNetworkUploadResponse | null> {
        return await executeApi()
          .put(
            `${URL_PATH_TREASURIES}/banking-network-uploads/${bankNetworkUploadId}`,
            uploadData
          )
          .then((response) => {
            if (response.data.success) {
              this.upload_response = response.data as IBankNetworkUploadResponse
              showAlert(
                response.data.message,
                'success',
                undefined,
                TIMEOUT_ALERT
              )
              return response.data as IBankNetworkUploadResponse
            } else {
              this.upload_response = null
              showAlert(
                response.data.message,
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              return null
            }
          })
          .catch((e) => {
            this.upload_response = null
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _getFileLoaded(
        documentId: number
      ): Promise<IFileLoadedResponse | null> {
        return await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/banking-network-uploads/file/pre-loaded?document_id=${documentId}`
          )
          .then((response) => {
            if (response.data.success) {
              this.file_loaded_response = response.data as IFileLoadedResponse
              return response.data as IFileLoadedResponse
            } else {
              this.file_loaded_response = null
              showAlert(
                response.data.message,
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              return null
            }
          })
          .catch((e) => {
            this.file_loaded_response = null
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _processBankNetworkUpload(uploadId: number) {
        return await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/banking-network-uploads/${uploadId}/process`
          )
          .then((response) => {
            if (response.data.success) {
              this.process_response =
                response.data as IProcessBankNetworkUploadResponse

              if (response.data.data && !response.data.data.success) {
                showAlert(
                  response.data.data.error ||
                    response.data.data.message ||
                    'Error en el procesamiento',
                  'error',
                  undefined,
                  TIMEOUT_ALERT
                )
              } else {
                showAlert(
                  response.data.message,
                  'success',
                  undefined,
                  TIMEOUT_ALERT
                )
              }

              return response.data
            } else {
              this.process_response = null
              showAlert(
                response.data.message,
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              return null
            }
          })
          .catch((e) => {
            this.process_response = null
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _getBankNetworkLoadById(
        id: number
      ): Promise<IBankNetworkLoadModel | null> {
        let responseData: IBankNetworkLoadModel | null = null
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/banking-network-uploads/${id}`)
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

      async _getBankNetworkLoadDetailById(
        id: number
      ): Promise<IBankNetworkLoadDetail[] | null> {
        let responseData: IBankNetworkLoadDetail[] | null = null
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/banking-network-uploads/${id}/records`)
          .then((response) => {
            const { data, success } = response.data

            if (success) {
              responseData = data
            }
          })
          .catch((e) => {
            const error = e as IErrors
            showCatchError(error)
          })
        return responseData
      },

      async _clearData() {
        this.bank_network_load = {
          currentPage: 0,
          lastPage: 0,
        }
        this.bank_network_load_list = []
        this.validation_result = null
        this.signed_url_response = null
        this.upload_response = null
        this.file_loaded_response = null
        this.process_response = null
      },
    },
  }
)

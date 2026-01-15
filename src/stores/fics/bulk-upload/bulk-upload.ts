// Pinia
import { defineStore } from 'pinia'

// Utils
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'

// Interfaces
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IBulkUploadBasicData,
  IBulkUploadList,
  IBulkUploadTableUpload,
  IBulkUploadValidatedOperationsList,
  IBulkUploadValidOperations,
} from '@/interfaces/customs/fics/BulkUpload'
import { useUtils } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const URL_PATH = `${URL_PATH_FICS}/monetary-operation-bulk`

export const useBulkUploadFicsStoreV1 = defineStore(
  'bulk-upload-fics-store-v1',
  {
    state: () => ({
      /* listar */
      data_bulk_upload_list: [] as IBulkUploadList[],
      data_bulk_upload_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      /* listar - crear - ver */
      data_information_form: null as IBulkUploadList | null,

      /* listado de Operaciones validadas */
      data_valid_operations_list: [] as IBulkUploadValidOperations[],
      data_valid_operations_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      /* listado de Operaciones que superan el porcentaje del fondo */
      data_ope_percent_list: [] as IBulkUploadValidOperations[],
      data_ope_percent_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      /* validar plantilla */
      validate_template_bulk_upload: {} as IBulkUploadTableUpload,

      /* Resultado de validacion de plantilla */
      data_result_template_bulk_upload_list: [] as IBulkUploadList[],
      data_result_template_bulk_upload_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      data_authorized_data_basic_list: [] as IBulkUploadBasicData[],
      data_authorized_data_validate_operation_list:
        [] as IBulkUploadValidatedOperationsList[],
      data_authorized_data_validate_operation_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_fund_limit_operations_list:
        [] as IBulkUploadValidatedOperationsList[],
      data_fund_limit_operations_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      /* Ver lista */
      async _getApiBulkUpload(params: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.data_bulk_upload_list = items.map((item: IBulkUploadList) => ({
              ...item,
            }))
            this.data_bulk_upload_pages.currentPage = current_page
            this.data_bulk_upload_pages.lastPage = last_page

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

      /* Crear, listar en opcion manual de cancelacion */
      async _getApiManualBulkUpload(params: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.data_bulk_upload_list = items.map((item: IBulkUploadList) => ({
              ...item,
            }))
            this.data_bulk_upload_pages.currentPage = current_page
            this.data_bulk_upload_pages.lastPage = last_page

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

      /* Validar plantilla */
      async _validateTemplate(payload: IBulkUploadList) {
        this._clearData()

        const formData = new FormData()

        for (const key in payload) {
          if (key !== 'file') {
            const value = payload[key as keyof typeof payload]
            if (value !== null && value !== undefined) {
              if (typeof value === 'object') {
                formData.append(key, JSON.stringify(value))
              } else {
                formData.append(key, String(value))
              }
            }
          }
        }

        if (payload.file instanceof File) {
          formData.append('file', payload.file, payload.file.name)
        }
        await executeApi()
          .post(`${URL_PATH}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((response) => {
            const data = response.data
            if (response.data.success) {
              const result = data.data
              this.validate_template_bulk_upload = result
            }

            return showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      /* Ver detalles */
      async _getApiByIdDetailsBulkUpload(id: number, params: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/${id}/detail?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.data_result_template_bulk_upload_list =
                response.data?.data?.data ?? []
              this.data_result_template_bulk_upload_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
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

      /* Ver campos por id */
      async _getByIdFieldsBulkUpload(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res = response.data.data
              if (res) {
                this.data_information_form = res
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

      /* Ver listado de Operaciones validadas */
      async _getApiValidOperations(id: number, params: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/${id}/detail?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.data_valid_operations_list = response.data?.data?.data ?? []
              this.data_valid_operations_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
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

      /* Ver listado de Operaciones que superan el porcentaje del fondo */
      async _getApiOpePercent(id: number, params: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        await executeApi()
          .get(
            `${URL_PATH}/${id}/detail?paginate=1${params}&filter[passes_found_limit]=true`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_ope_percent_list = response.data?.data?.data ?? []
              this.data_ope_percent_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
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

      /* Descargar excel */
      async _downloadDetailBulkUpload(id: string) {
        await executeApi()
          .get(`${URL_PATH}/${id}/download-detail`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            const fileNameValid = useUtils().fileNameValidate(
              fileName,
              'Detalle_cargue_masivo'
            )

            useUtils().downloadBlobXlxx(blob, fileNameValid)
            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch(async (error) => {
            let errorMessage = 'Error al descargar el archivo Excel'

            if (error.response) {
              if (error.response.data instanceof Blob) {
                try {
                  const text = await error.response.data.text()
                  if (error.response) {
                    if (error.response.data instanceof Blob) {
                      try {
                        const text = await error.response.data.text()

                        if (
                          error.response.headers['content-type']?.includes(
                            'application/json'
                          )
                        ) {
                          const jsonError = JSON.parse(text)
                          errorMessage = jsonError.message || errorMessage
                        }
                      } catch (parseError) {}
                    } else if (error.response.data?.message) {
                      errorMessage = error.response.data.message
                    }
                  } else if (error.message) {
                    errorMessage = error.message
                  }
                  if (
                    error.response.headers['content-type']?.includes(
                      'application/json'
                    )
                  ) {
                    const jsonError = JSON.parse(text)
                    errorMessage = jsonError.message || errorMessage
                  }
                } catch (parseError) {}
              } else if (error.response.data?.message) {
                errorMessage = error.response.data.message
              }
            } else if (error.message) {
              errorMessage = error.message
            }

            showAlert(errorMessage, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      /* Descargar excel valido */
      async _downloadValidExcelBulkUpload(id: string) {
        await executeApi()
          .get(
            `${URL_PATH_FICS}/monetary-operation-templates/${id}/export/excel`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            const fileNameValid = useUtils().fileNameValidate(
              fileName,
              'Detalle_cargue_masivo'
            )

            useUtils().downloadBlobXlxx(blob, fileNameValid)
            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch(async (error) => {
            let errorMessage = 'Error al descargar el archivo Excel'

            if (error.response) {
              if (error.response.data instanceof Blob) {
                try {
                  const text = await error.response.data.text()
                  if (error.response) {
                    if (error.response.data instanceof Blob) {
                      try {
                        const text = await error.response.data.text()

                        if (
                          error.response.headers['content-type']?.includes(
                            'application/json'
                          )
                        ) {
                          const jsonError = JSON.parse(text)
                          errorMessage = jsonError.message || errorMessage
                        }
                      } catch (parseError) {}
                    } else if (error.response.data?.message) {
                      errorMessage = error.response.data.message
                    }
                  } else if (error.message) {
                    errorMessage = error.message
                  }
                  if (
                    error.response.headers['content-type']?.includes(
                      'application/json'
                    )
                  ) {
                    const jsonError = JSON.parse(text)
                    errorMessage = jsonError.message || errorMessage
                  }
                } catch (parseError) {}
              } else if (error.response.data?.message) {
                errorMessage = error.response.data.message
              }
            } else if (error.message) {
              errorMessage = error.message
            }

            showAlert(errorMessage, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _setDataInformationForm(data_to_set: IBulkUploadList | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _clearData() {
        this.data_bulk_upload_list = []
        this.data_bulk_upload_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.data_authorized_data_basic_list = []
        this.data_authorized_data_validate_operation_list = []
        this.data_authorized_data_validate_operation_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.data_fund_limit_operations_list = []
        this.data_fund_limit_operations_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },

      async _processMonetaryOperationBulk(
        id: string,
        lineNumbers: number[],
        approved: boolean,
        observation?: string,
        transaction_method_id?: number
      ) {
        let success = false

        const data = {
          line_numbers: lineNumbers,
          approved,
          observation: observation || '',
          transaction_method_id,
        }

        await executeApi()
          .patch(
            `${URL_PATH_FICS}/monetary-operation-bulk/${id}/authorize`,
            data
          )
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
        return success
      },

      async _authorizeMonetaryOperationBulk(
        id: string,
        lineNumbers: number[],
        observation?: string,
        transaction_method_id?: number
      ) {
        return this._processMonetaryOperationBulk(
          id,
          lineNumbers,
          true,
          observation,
          transaction_method_id
        )
      },

      async _rejectMonetaryOperationBulk(
        id: string,
        lineNumbers: number[],
        observation: string
      ) {
        return this._processMonetaryOperationBulk(
          id,
          lineNumbers,
          false,
          observation
        )
      },

      async _annularBulkUpload(id: string) {
        let success = false

        await executeApi()
          .patch(`${URL_PATH}/${id}/annul`)
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
        return success
      },

      async _getApiAuthorizedDataBasicBulkUpload(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        await executeApi()
          .get(`${URL_PATH_FICS}/monetary-operation-bulk/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_authorized_data_basic_list = response.data.data ?? []
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

      async _getApiAuthorizedValidateOperationBulkUpload(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        await executeApi()
          .get(`${URL_PATH}/${id}/detail`)
          .then((response) => {
            if (response.data.success) {
              this.data_authorized_data_validate_operation_list =
                response.data?.data ?? []
              this.data_authorized_data_validate_operation_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getApiFundLimitOperationsBulkUpload(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        await executeApi()
          .get(`${URL_PATH}/${id}/detail?pass_fund_limit=true`)
          .then((response) => {
            if (response.data.success) {
              this.data_fund_limit_operations_list = response.data?.data ?? []
              this.data_fund_limit_operations_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)

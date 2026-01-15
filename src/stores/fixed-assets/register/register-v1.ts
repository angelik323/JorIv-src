// pinia
import { defineStore } from 'pinia'

// interfaces
import { IErrors } from '@/interfaces/global/errorMessage'
import {
  IDocumentsRegister,
  IRegisterFileValidation,
  IRegisterForm,
  IRegisterItemList,
  IRegisterResponse,
  IAmountUvtValue
} from '@/interfaces/customs/fixed-assets/v1/Register'

// composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'
import { useUtils } from '@/composables/useUtils'

// constants
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'
import { IPaginated } from '@/interfaces/customs'

const TIMEOUT_ALERT = 3000
const INITIAL_ID_VALUE = 0

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { getNameBlob, downloadBlobXlxx, downloadBlob } = useUtils()

export const useRegisterStoreV1 = defineStore('register-v1', {
  state: () => ({
    version: 'v1',
    headerPropsDefault: {
      title: 'Registro activos fijos y bienes',
      breadcrumbs: [
        { label: 'Inicio', route: 'HomeView' },
        { label: 'Activos fijos', route: '' },
        { label: 'Registro activos fijos y bienes', route: 'RegisterList' }
      ]
    }
  }),
  actions: {
    async _getRegisterList(params: string) {
      let responseList: IPaginated<IRegisterItemList> | null = {
        list: [],
        pages: { currentPage: 0, lastPage: 0 }
      }
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/assets?${params}`)
        .then((response) => {
          const { data: items = [], message, success, current_page, last_page } = response.data

          responseList = {
            list: items,
            pages: { currentPage: current_page, lastPage: last_page }
          }

          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return responseList
    },

    async _createRegister(payload: IRegisterForm): Promise<number> {
      let success = false
      let id = INITIAL_ID_VALUE
      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/assets`, payload)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false
          id = response.data?.data?.id ?? INITIAL_ID_VALUE
          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return id
    },

    async _updateRegister(payload: IRegisterForm, id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_FIXED_ASSETS}/assets/${id}`, payload)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false
          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _getRegisterById(id: number): Promise<IRegisterResponse> {
      let register: IRegisterResponse = {} as IRegisterResponse
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/assets/${id}`)
        .then((response) => {
          const { data } = response.data
          register = data
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return register
    },

    async _getPresignedUrls(documents: IDocumentsRegister[]): Promise<IDocumentsRegister[]> {
      let presignedUrls: IDocumentsRegister[] = []

      const payload = {
        documents: documents.map((doc) => ({
          name: doc.name,
          model_name: 'FIXED_ASSET',
          document_type: doc.document_type,
          file_size: doc.file_size
        }))
      }

      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/documents/presigned-url`, payload)
        .then((response) => {
          const { data, success } = response.data

          if (success && data) {
            presignedUrls = data.map((item: IDocumentsRegister) => ({
              document_id: item.document_id,
              upload_url: item.upload_url,
              file_path: item.file_path
            }))
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return presignedUrls
    },

    async _deleteRegisterFile(registerId: number, data: number[]) {
      let success = false

      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/assets/delete-files/${registerId}`, {
          documents: data
        })
        .then((response) => {
          const { message, success: responseSuccess } = response.data
          success = responseSuccess

          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _downloadRegistriesList(): Promise<void> {
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/assets/export`, {
          responseType: 'blob'
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type']
          })

          const fileName = getNameBlob(response)
          downloadBlobXlxx(blob, fileName)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _downloadExcelById(id: number): Promise<void> {
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/assets/export/${id}`, {
          responseType: 'blob'
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type']
          })

          const fileName = getNameBlob(response)
          downloadBlobXlxx(blob, fileName)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },
    async _downloadPdfById(id: number): Promise<void> {
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/assets/export/${id}/pdf`, {
          responseType: 'blob'
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type']
          })

          const fileName = getNameBlob(response)
          downloadBlob(blob, fileName)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _downloadExcelRegisterTemplate(): Promise<void> {
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/assets/import/template`, {
          responseType: 'blob'
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type']
          })

          const fileName = getNameBlob(response)
          downloadBlobXlxx(blob, fileName)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _validateRegisterFile(file: File) {
      let responseData: IRegisterFileValidation = {
        name: '',
        status_id: null,
        size: 0,
        has_errors: false,
        id: null,
        batch_id: null,
        validated_rows: []
      }

      const formData = new FormData()
      formData.append('file', file)

      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/assets/import/process`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          const importedRecords = response.data?.data?.imported_records
          if (importedRecords) {
            responseData = importedRecords as IRegisterFileValidation
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return responseData
    },

    async _downloadExcelRegisterErrorsFile(batch_id: string) {
      await executeApi()
        .post(
          `${URL_PATH_FIXED_ASSETS}/assets/import/${batch_id}/errors`,
          {},
          {
            responseType: 'blob'
          }
        )
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type']
          })

          const name = getNameBlob(response)
          downloadBlobXlxx(blob, name)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _createRegisterBulk(
      batchId: string,
      records?: { id: number; document_ids: number[] }[]
    ): Promise<boolean> {
      let success = false
      const payload = records ? { records } : {}

      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/assets/import/${batchId}`, payload)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false
          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },
    async _getQrCode(id: number): Promise<string> {
      let blobUrl = ''
      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/assets/export/${id}/pdf`)
        .then((response) => {
          const qrCode = response.data?.qr ?? ''
          const svgContent = atob(qrCode)
          const blob = new Blob([svgContent], { type: 'image/svg+xml' })
          blobUrl = URL.createObjectURL(blob)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return blobUrl
    },
    async _getAmountUvtValues(): Promise<IAmountUvtValue | null> {
      let amountUvtValues: IAmountUvtValue | null = null
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/setting-uvt`)
        .then((response) => {
          const { data } = response.data
          amountUvtValues = data[0] as IAmountUvtValue
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return amountUvtValues
    }
  }
})

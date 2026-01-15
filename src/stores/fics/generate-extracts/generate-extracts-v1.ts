// Apis - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces - Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import {
  IFicsExtractGeneration,
  IFicsExtractGenerationRequest,
} from '@/interfaces/customs/fics/GenerateExtractst'

// Composables
import { useAlert, useShowError } from '@/composables'
import { downloadZipFile } from '@/utils'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_FICS}/extract-generations`

export const useGenerateExtractsStoreV1 = defineStore(
  'generate-extracts-store-v1',
  {
    state: () => ({
      version: 'v1',
      generate_extracts_list: [] as IFicsExtractGeneration[],
      generate_extracts_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.generate_extracts_list = items.map(
              (item: IFicsExtractGeneration) => ({
                ...item,
              })
            )
            this.generate_extracts_pages.currentPage = current_page
            this.generate_extracts_pages.lastPage = last_page

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

      async _createAction(payload: IFicsExtractGenerationRequest) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
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

      async _resendAction(extract_id: number) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/resend/${extract_id}`)
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

      async _downloadZipAction(extract_id: number) {
        await executeApi()
          .get(`${URL_PATH}/download/${extract_id}`, {
            responseType: 'blob',
          })
          .then((response) => {
            downloadZipFile(response.data, `extracto_${extract_id}.zip`)
            return showAlert(
              'Archivos descargado exitosamente',
              response.data ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _errorDetailAction(extract_id: number) {
        return await executeApi()
          .get(`${URL_PATH}/error-detail/${extract_id}`)
          .then((response) => {
            if (response.data.success) {
              return response.data.data
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

      _clearData() {
        this.generate_extracts_list = []
        this.generate_extracts_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)

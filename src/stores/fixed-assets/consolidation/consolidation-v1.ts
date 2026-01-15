// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import {
  IConsolidationCreate,
  IConsolidationListResponse,
  IProcessListResponse,
} from '@/interfaces/customs/fixed-assets/v1/Consolidation'
import { IErrors } from '@/interfaces/global'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useConsolidationStoreV1 = defineStore('consolidation-store-v1', {
  state: () => ({
    headerPropsDefault: {
      title: 'Englobe',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Activos fijos',
        },
        {
          label: 'Englobe',
          route: 'ConsolidationList',
        },
      ],
    },
  }),
  actions: {
    async _getConsolidationList(
      params: string
    ): Promise<IConsolidationListResponse> {
      let responseData: IConsolidationListResponse = {
        consolidation_list: [],
        consolidation_pages: {
          currentPage: 0,
          lastPage: 0,
        },
      }

      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/consolidation?${params}`)
        .then((response) => {
          responseData = {
            consolidation_list: response.data.data ?? [],
            consolidation_pages: {
              currentPage: response.data.data.current_page ?? 0,
              lastPage: response.data.data.last_page ?? 0,
            },
          }

          showAlert(
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

      return responseData
    },

    async _createConsolidation(payload: IConsolidationCreate): Promise<number> {
      let responseData: number = 0

      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/consolidation`, payload)
        .then((response) => {
          responseData = response.data.data.id ?? 0

          showAlert(
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

      return responseData
    },

    async _addConsolidationFile(
      consolidationId: number,
      data: Record<string, string>
    ) {
      let success = false
      let documentId = 0
      let uploadUrl = ''
      let filePath = ''

      await executeApi()
        .post(
          `${URL_PATH_FIXED_ASSETS}/consolidation/file-signed/${consolidationId}`,
          data
        )
        .then((response) => {
          const { data: responseData, success: responseSuccess } = response.data

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

    async _updateConsolidationDocuments(
      consolidationId: number,
      data: Record<string, string | boolean | string[]>
    ) {
      let success = false

      await executeApi()
        .put(
          `${URL_PATH_FIXED_ASSETS}/consolidation/files/${consolidationId}`,
          data
        )
        .then((response) => {
          const { success: responseSuccess } = response.data
          success = responseSuccess
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _getByIdConsolidation(id: number) {
      let responseData = null

      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/consolidation/${id}`)
        .then((response) => {
          responseData = response.data.data

          showAlert(
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
          responseData = null
        })

      return responseData
    },

    async _updateConsolidation(id: number, data: IConsolidationCreate) {
      let success = false

      await executeApi()
        .put(`${URL_PATH_FIXED_ASSETS}/consolidation/${id}`, data)
        .then((response) => {
          const { success: responseSuccess } = response.data
          success = responseSuccess

          showAlert(
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
          success = false
        })

      return success
    },

    async _getConsolidationAsset(
      params: string
    ): Promise<IProcessListResponse> {
      let responseData: IProcessListResponse = {
        process_list: [],
        consolidation_pages: {
          currentPage: 0,
          lastPage: 0,
        },
      }

      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/consolidation/fixed-assets?${params}`)
        .then((response) => {
          const data =
            response.data.data?.data ||
            response.data.data ||
            response.data ||
            []
          const currentPage =
            response.data.data?.current_page || response.data?.current_page || 0
          const lastPage =
            response.data.data?.last_page || response.data?.last_page || 0

          responseData = {
            process_list: data,
            consolidation_pages: {
              currentPage: currentPage,
              lastPage: lastPage,
            },
          }

          showAlert(
            response.data.message || 'Operación exitosa',
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

      return responseData
    },
  },
})

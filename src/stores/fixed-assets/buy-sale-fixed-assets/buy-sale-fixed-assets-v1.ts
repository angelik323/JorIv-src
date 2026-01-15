// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import {
  IBuySaleFixedAssetsList,
  IBuySaleFixedAssetsCreateRequest,
  IBuySaleFixedAssetsUpdateRequest,
  IBuySaleFixedAssetsResponse,
  IFixedAssetDocumentRequest,
  IFixedAssetPresignedUrlResponse,
  IBuySaleFileValidation,
  IBuySaleTransactionData,
  IBuySaleBulkCreateRecord,
  IBuySaleBulkCreateRequest
} from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'
import { IErrors } from '@/interfaces/global'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { downloadBlobXlxx } = useUtils()

export const useBuySaleFixedAssetsV1 = defineStore('buy-sale-fixed-assets-v1', {
  state: () => ({
    version: 'v1',
    headerPropsDefault: {
      title: 'Compra y venta activos fijos y bienes',
      breadcrumbs: [
        { label: 'Inicio', route: 'HomeView' },
        { label: 'Activos fijos', route: '' },
        {
          label: 'Compra y venta activos fijos y bienes',
          route: 'BuySaleFixedAssetsList'
        }
      ]
    }
  }),
  actions: {
    async _getBuySaleFixedAssetsList(params: string = '') {
      const responseData = {
        list: [] as IBuySaleFixedAssetsList[],
        pages: {
          currentPage: 0,
          lastPage: 0
        }
      }
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/asset-transactions?${params}`)
        .then((response) => {
          const { data, message, success } = response.data
          responseData.list = data?.data
          responseData.pages.currentPage = data?.current_page
          responseData.pages.lastPage = data?.last_page

          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },

    async _createBuySaleFixedAssets(
      payload: IBuySaleFixedAssetsCreateRequest
    ): Promise<IBuySaleFixedAssetsResponse | null> {
      let responseData: IBuySaleFixedAssetsResponse | null = null
      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/asset-transactions`, payload)
        .then((response) => {
          const { data, message, success } = response.data
          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
          if (success) {
            responseData = data
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },

    async _getByIdBuySaleFixedAssets(id: number): Promise<IBuySaleTransactionData | null> {
      let responseData: IBuySaleTransactionData | null = null
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/asset-transactions/${id}`)
        .then((response) => {
          const { data, message, success } = response.data
          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
          if (success) {
            responseData = data
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },
    async _updateBuySaleFixedAssets(
      id: number,
      payload: IBuySaleFixedAssetsUpdateRequest
    ): Promise<IBuySaleFixedAssetsResponse | null> {
      let responseData: IBuySaleFixedAssetsResponse | null = null
      await executeApi()
        .put(`${URL_PATH_FIXED_ASSETS}/asset-transactions/${id}`, payload)
        .then((response) => {
          const { data, message, success } = response.data
          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
          if (success) {
            responseData = data
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return responseData
    },

    async _deleteBuySaleFixedAssets(id: number): Promise<{ id: number } | null> {
      let responseData: { id: number } | null = null
      await executeApi()
        .delete(`${URL_PATH_FIXED_ASSETS}/asset-transactions/${id}`)
        .then((response) => {
          const { data, message, success } = response.data
          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
          if (success) {
            responseData = data
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },

    async _approveBuySaleFixedAssets(id: number): Promise<{ id: number } | null> {
      let responseData: { id: number } | null = null

      await executeApi()
        .put(`${URL_PATH_FIXED_ASSETS}/asset-transactions/approve/${id}`)
        .then((response) => {
          const { data, message, success } = response.data
          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
          if (success) {
            responseData = data
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },

    async _getPresignedUrls(
      documents: IFixedAssetDocumentRequest[]
    ): Promise<IFixedAssetPresignedUrlResponse | null> {
      let responseData: IFixedAssetPresignedUrlResponse | null = null

      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/documents/presigned-url`, {
          documents
        })
        .then((response) => {
          responseData = response.data as IFixedAssetPresignedUrlResponse
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

    async _downloadExcelBuySaleTemplate() {
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/asset-transactions/import/template`, {
          responseType: 'blob'
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          downloadBlobXlxx(blob, 'Plantilla_Compra_Venta_Activos_Fijos.xlsx')
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _validateBuySaleFile(file: File): Promise<IBuySaleFileValidation | null> {
      let responseData: IBuySaleFileValidation | null = null

      const formData = new FormData()
      formData.append('file', file)

      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/asset-transactions/import/process`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          // La respuesta viene en data.imported_records
          const importedRecords = response.data?.data?.imported_records
          if (importedRecords) {
            responseData = importedRecords as IBuySaleFileValidation
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return responseData
    },

    async _downloadExcelBuySaleErrorsFile(batchId: string) {
      await executeApi()
        .post(
          `${URL_PATH_FIXED_ASSETS}/asset-transactions/import/${batchId}/errors`,
          {},
          {
            responseType: 'blob'
          }
        )
        .then((response) => {
          const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          downloadBlobXlxx(blob, `Errores_Importacion_${batchId}.xlsx`)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _createBuySaleBulk(
      batchId: string,
      records: IBuySaleBulkCreateRecord[],
      purchaseOrderId?: string | number
    ): Promise<boolean> {
      let success = false

      const requestBody: IBuySaleBulkCreateRequest = { records }

      if (purchaseOrderId) {
        requestBody.purchase_order_id = purchaseOrderId
      }

      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/asset-transactions/import/${batchId}`, requestBody)
        .then((response) => {
          const data = response.data as { success: boolean; message: string }
          success = data.success

          if (data.success) {
            showAlert(data.message, 'success', undefined, TIMEOUT_ALERT)
          } else {
            showAlert(
              data.message || 'Error al confirmar cargue',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          }
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    }
  }
})

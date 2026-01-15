// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import {
  IBuyOrderFixedAssetsList,
  IBuyOrderFixedAssetsResponse,
  IBuyOrderFixedAssetsCreateRequest,
  IBuyOrderFixedAssetsUpdateRequest,
  IBuyOrderFixedAssetsSimpleResponse,
  IBuyOrderFixedAssetsSimpleData
} from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'
import { IErrors } from '@/interfaces/global'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBuyOrderFixedAssetsV1 = defineStore('buy-order-fixed-assets-v1', {
  state: () => ({
    version: 'v1',
    headerPropsDefault: {
      title: 'Orden de compra de activos fijos y bienes',
      breadcrumbs: [
        { label: 'Inicio', route: 'HomeView' },
        { label: 'Activos fijos', route: '' },
        {
          label: 'Orden de compra',
          route: 'ConfigurationTypesSubtypesList'
        }
      ]
    }
  }),
  actions: {
    async _getBuyOrderFixedAssetsList(params: string = '') {
      const responseData = {
        list: [] as IBuyOrderFixedAssetsList[],
        pages: {
          currentPage: 0,
          lastPage: 0
        }
      }
      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/purchase-orders?${params}`)
        .then((response) => {
          const { data, message, success } = response.data
          responseData.list = data.data
          responseData.pages = {
            currentPage: 1,
            lastPage: 1
          }

          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },
    async _createBuyOrderFixedAssets(payload: IBuyOrderFixedAssetsCreateRequest) {
      let responseData: IBuyOrderFixedAssetsList | null = null

      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/purchase-orders`, payload)
        .then((response) => {
          const { data, message, success } = response.data as IBuyOrderFixedAssetsResponse

          if (success) {
            responseData = data
          }

          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },

    async _getByIdBuyOrderFixedAssets(id: number) {
      let responseData: IBuyOrderFixedAssetsList | null = null

      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/purchase-orders/${id}`)
        .then((response) => {
          const { data, message, success } = response.data as IBuyOrderFixedAssetsResponse

          if (success && data) {
            responseData = data
          }

          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },

    async _updateBuyOrderFixedAssets(id: number, payload: IBuyOrderFixedAssetsUpdateRequest) {
      let responseData: IBuyOrderFixedAssetsList | null = null

      await executeApi()
        .put(`${URL_PATH_FIXED_ASSETS}/purchase-orders/${id}`, payload)
        .then((response) => {
          const { data, message, success } = response.data as IBuyOrderFixedAssetsResponse

          if (success) {
            responseData = data
          }

          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },

    async _deleteBuyOrderFixedAssets(id: number) {
      let responseData: IBuyOrderFixedAssetsSimpleData | null = null

      await executeApi()
        .delete(`${URL_PATH_FIXED_ASSETS}/purchase-orders/${id}`)
        .then((response) => {
          const { data, message, success } = response.data as IBuyOrderFixedAssetsSimpleResponse

          if (success && data) {
            responseData = data
          }

          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    },

    async _authorizeBuyOrderFixedAssets(id: number) {
      let responseData: IBuyOrderFixedAssetsSimpleData | null = null

      await executeApi()
        .put(`${URL_PATH_FIXED_ASSETS}/purchase-orders/authorize/${id}`)
        .then((response) => {
          const { data, message, success } = response.data as IBuyOrderFixedAssetsSimpleResponse

          if (success && data) {
            responseData = data
          }

          showAlert(message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return responseData
    }
  }
})

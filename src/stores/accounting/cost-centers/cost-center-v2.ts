import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ICostCenterListItem,
  ICostCenterResponse,
  ICostCenterToCreate,
  ICostCenterToEdit,
} from '@/interfaces/customs/accounting/CostCenterV2'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useUtils, useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_ACCOUNTING}/v2/cost-centers`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCostCenterStoreV2 = defineStore('cost-center-store-v2', {
  state: () => ({
    headerPropsDefault: {
      title: 'Centros de costos',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Contabilidad',
        },
        {
          label: 'Centros de costos',
          route: 'x',
        },
      ],
      btn: {
        label: 'Crear',
        icon: useUtils().defaultIconsLucide.plusCircleOutline,
      },
    },
    cost_center_list: [] as ICostCenterListItem[],
    cost_center_response: null as ICostCenterResponse | null,
    cost_center_pages: {
      currentPage: 0,
      lastPage: 0,
    },
  }),

  actions: {
    async _getListAction(params: Record<string, string | number>) {
      this._clearData()

      await executeApi()
        .get(`${URL_PATH}`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.cost_center_list = items as ICostCenterListItem[]
          this.cost_center_pages.currentPage = current_page
          this.cost_center_pages.lastPage = last_page

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

    async _getByStructureId(
      structureId: number,
      params?: Record<string, string | number>
    ) {
      await executeApi()
        .get(`${URL_PATH}/${structureId}`, {
          params: { ...params },
        })
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.cost_center_response = { ...responseData }
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

    async _createCostCenter(data: Partial<ICostCenterToCreate>) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}`, data)
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

    async _updateCostCenter(
      data: Partial<ICostCenterToEdit>,
      structureId: number
    ) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${structureId}`, data)
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

    async _deleteCostCenter(
      data: Partial<ICostCenterToEdit>,
      structureId: number
    ) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${structureId}`, data)
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

    _clearData() {
      this.cost_center_list = []
      this.cost_center_response = null
      this.cost_center_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})

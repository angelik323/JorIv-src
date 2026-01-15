import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { ICostCenter, ICostCenterCreatePayload, ICostCenterModel } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = 'accounting/api/accounting/cost-centers'
const TIMEOUT_ALERT = 3000

export const useCostCenterV1 = defineStore('cost-center-v1', {
  state: () => ({
    version: 'v1',
    cost_center_list: [] as ICostCenter[],
    cost_center_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    selected_cost_center: null as ICostCenter | null,
  }),

  actions: {
    async _getListAction(params = '') {
      this._cleanCostCenterData()
      executeApi()
        .get(`${URL_PATH}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.cost_center_list = response.data?.data?.data ?? []
            this.cost_center_pages = { currentPage: 1, lastPage: 1 }
          }
          return showAlert(response.data.message, 'success', undefined, TIMEOUT_ALERT)
        })
        .catch((error: any) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    _cleanCostCenterData() {
      this.cost_center_list = []
      this.cost_center_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },

    async _createCostCenter(payload: ICostCenterCreatePayload) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}`, payload)
        .then((response) => {
          success = response.data.success
          return showAlert(response.data.message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((error: any) => {
          return showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _updateCostCenter(structureId: number, chartId: number, payload: Partial<ICostCenterModel>) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${structureId}/${chartId}`, payload)
        .then((response) => {
          success = response.data.success
          return showAlert(response.data.message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _getCostCenter(structureId: number, chartId: number) {
      let costCenter = null

      await executeApi()
        .get(`${URL_PATH}/${structureId}/${chartId}`)
        .then((response) => {
          if (response.data.success) {
            costCenter = response.data.data
          }

          return showAlert(response.data.message, response.data.success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return costCenter
    },

    async _getCostCenterCodesAndNames() {
      try {
        const response = await executeApi().get(`${URL_PATH}?fields=code,name`)
        if (response.data && Array.isArray(response.data.data)) {
          return response.data.data
        }
        return []
      } catch (error: any) {
        showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        return []
      }
    },

    async _toggleCostCenterStatus() {
      if (!this.selected_cost_center) {
        return false
      }
      const statusId = this.selected_cost_center.status_id
      const id = this.selected_cost_center.id

      if (!id || statusId === undefined) {
        return false
      }

      const newStatusId = statusId === 1 ? 2 : 1
      let success = false

      try {
        const response = await executeApi().patch(`${URL_PATH}/${id}/status`, { status_id: newStatusId })
        success = response.data.success
        showAlert(response.data.message, success ? 'success' : 'error', undefined, TIMEOUT_ALERT)
      } catch (error: any) {
        showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
      }

      return success
    },

    _selectCostCenter(costCenter: ICostCenter) {
      this.selected_cost_center = costCenter
    },
  },
})

// Pinia
import { defineStore } from 'pinia'

// APIs
import { executeApi } from '@/apis'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// Interfaces
import type { IErrors } from '@/interfaces/global'
import type {
  ITypeWorkPlanForm,
  ITypesWorkPlanResponse,
} from '@/interfaces/customs/derivative-contracting/WorkPlans'

// Constants
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const BASE_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/work-plan`

export const useWorkPlansStoreV1 = defineStore('work-plans-store-v1', {
  state: () => ({
    work_plans_list: [] as ITypesWorkPlanResponse[],

    work_plans_pages: {
      currentPage: 0,
      lastPage: 0,
      total_items: 0,
      per_page: 0,
    },

    data_information_form: null as ITypeWorkPlanForm | null,

    work_plan_received_request: null as ITypesWorkPlanResponse | null,
  }),

  actions: {
    async _getWorkPlans(params: string) {
      this._clearData()

      await executeApi()
        .get(`${BASE_PATH}?paginate=1${params ? `&${params}` : ''}`)
        .then((response) => {
          const {
            data: {
              data: items = [],
              current_page = 0,
              last_page = 0,
              total = 0,
              per_page = 0,
            } = {},
            message,
            success,
          } = response.data ?? {}

          this.work_plans_list = Array.isArray(items) ? items : []
          this.work_plans_pages = {
            currentPage: current_page,
            lastPage: last_page,
            total_items: total,
            per_page: per_page,
          }

          return showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const err = e as IErrors
          const msg = showCatchError(err)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getByIdWorkPlan(id: number): Promise<ITypesWorkPlanResponse | null> {
      this.work_plan_received_request = null

      return await executeApi()
        .get(`${BASE_PATH}/${id}`)
        .then((response) => {
          const { data, message, success } = response.data ?? {}

          if (success && data) {
            this.work_plan_received_request = data as ITypesWorkPlanResponse
            return data as ITypesWorkPlanResponse
          }

          showAlert(
            message ?? 'No fue posible obtener el detalle',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
          return null
        })
        .catch((e) => {
          const err = e as IErrors
          const msg = showCatchError(err)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    async _createWorkPlan(payload: ITypeWorkPlanForm) {
      let success = false

      await executeApi()
        .post(`${BASE_PATH}`, payload)
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Plan de obra creado' : 'No fue posible crear el plan de obra'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const err = e as IErrors
          const msg = showCatchError(err)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _updateWorkPlan(id: number, payload: ITypeWorkPlanForm) {
      let success = false

      await executeApi()
        .put(`${BASE_PATH}/${id}`, payload)
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Plan de obra actualizado' : 'No fue posible actualizar el plan de obra'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const err = e as IErrors
          const msg = showCatchError(err)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _deleteWorkPlan(id: number) {
      let success = false

      await executeApi()
        .delete(`${BASE_PATH}/${id}`)
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Plan de obra eliminado' : 'No fue posible eliminar el plan de obra'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const err = e as IErrors
          const msg = showCatchError(err)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    _setDataBasicWorkPlan(data: ITypeWorkPlanForm | null) {
      this.data_information_form = data ? { ...data } : null
    },

    _clearData() {
      this.work_plans_list = []
      this.work_plans_pages = {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      }
      this.work_plan_received_request = null
    },
  },
})

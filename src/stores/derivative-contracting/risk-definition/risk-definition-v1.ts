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
  IRiskDefinitionResponse,
  IRiskDefinitionForm,
} from '@/interfaces/customs/derivative-contracting'

// Constants
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/risks`

export const useRiskDefinitionsStoreV1 = defineStore('risk-definitions-store-v1', {
  state: () => ({
    risk_definitions_list: [] as IRiskDefinitionResponse[],
    risk_definitions_pages: {
      currentPage: 0,
      lastPage: 0,
      total_items: 0,
      per_page: 0,
    },

    risk_definition_received_request: null as IRiskDefinitionResponse | null,
  }),

  actions: {
    async _getRiskDefinitions(params: string) {
      this._clearData()

      await executeApi()
        .get(`${URL_PATH}?paginate=1${params ? `&${params}` : ''}`)
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

          this.risk_definitions_list = Array.isArray(items) ? items : []
          this.risk_definitions_pages = {
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

    async _getByIdRiskDefinition(id: number): Promise<IRiskDefinitionResponse | null> {
      this.risk_definition_received_request = null

      return await executeApi()
        .get(`${URL_PATH}/${id}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data ?? {}

          if (success && responseData) {
            this.risk_definition_received_request = responseData as IRiskDefinitionResponse
            return responseData as IRiskDefinitionResponse
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

    async _createRiskDefinition(payload: IRiskDefinitionForm) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}`, payload)
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Riesgo creado correctamente' : 'No fue posible crear el riesgo'),
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

    async _updateRiskDefinition(id: number, payload: IRiskDefinitionForm) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${id}`, payload)
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Riesgo actualizado' : 'No fue posible actualizar el riesgo'),
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

    async _deleteRiskDefinition(id: number) {
      let success = false

      await executeApi()
        .delete(`${URL_PATH}/${id}`)
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Riesgo eliminado' : 'No fue posible eliminar el riesgo'),
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

    async _changeRiskDefinitionStatus(id: number, status_id: number) {
      let success = false

      await executeApi()
        .patch(`${URL_PATH}/${id}/toggle-status`, { status_id })
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Riesgo actualizado' : 'No fue posible actualizar el riesgo'),
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

    _clearData() {
      this.risk_definitions_list = []
      this.risk_definitions_pages = {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      }
      this.risk_definition_received_request = null
    },
  },
})

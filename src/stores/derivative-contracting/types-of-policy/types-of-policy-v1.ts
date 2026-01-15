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
  ITypeOfPolicy as ITypeOfPolicyResponse,
  ITypeOfPolicyForm,
} from '@/interfaces/customs/derivative-contracting/TypesOfPolicy'

// Constants
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/policies`

export const useTypeOfPoliciesStoreV1 = defineStore('type-of-policies-store-v1', {
  state: () => ({
    type_of_policies_list: [] as ITypeOfPolicyResponse[],
    type_of_policies_pages: {
      currentPage: 0,
      lastPage: 0,
      total_items: 0,
      per_page: 0,
    },

    type_of_policy_received_request: null as ITypeOfPolicyResponse | null,
  }),

  actions: {
    async _getTypeOfPolicies(params: string) {
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

          this.type_of_policies_list = Array.isArray(items) ? items : []
          this.type_of_policies_pages = {
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

    async _getByIdTypeOfPolicy(id: number): Promise<ITypeOfPolicyResponse | null> {
      this.type_of_policy_received_request = null

      return await executeApi()
        .get(`${URL_PATH}/${id}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data ?? {}

          if (success && responseData) {
            this.type_of_policy_received_request = responseData as ITypeOfPolicyResponse
            return responseData as ITypeOfPolicyResponse
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

    async _createTypeOfPolicy(payload: ITypeOfPolicyForm) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}`, payload)
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Tipo de póliza creado correctamente' : 'No fue posible crear el tipo de póliza'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const err = e as IErrors
          const msg = useShowError().showCatchError(err)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _updateTypeOfPolicy(id: number, payload: ITypeOfPolicyForm) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${id}`, payload)
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Tipo de póliza actualizado' : 'No fue posible actualizar el tipo de póliza'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const err = e as IErrors
          const msg = useShowError().showCatchError(err)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _deleteTypeOfPolicy(id: number) {
      let success = false

      await executeApi()
        .delete(`${URL_PATH}/${id}`)
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Tipo de póliza eliminado' : 'No fue posible eliminar el tipo de póliza'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const err = e as IErrors
          const msg = useShowError().showCatchError(err)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _changeTypeOfPolicyStatus(id: number, status_id: number) {
      let success = false

      await executeApi()
        .patch(`${URL_PATH}/${id}/toggle-status`, { status_id })
        .then((response) => {
          const { message } = response.data ?? {}
          success = !!response.data?.success

          showAlert(
            message ?? (success ? 'Tipo de póliza actualizado' : 'No fue posible actualizar el tipo de póliza'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const err = e as IErrors
          const msg = useShowError().showCatchError(err)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _activateTypeOfPolicy(id: number) {
      let success = false
      await executeApi()
        .patch(`${URL_PATH_DERIVATIVE_CONTRACTING}/policies/${id}/activate`)
        .then((response) => {
          success = !!response.data?.success
          return showAlert(
            response.data?.message ?? (success ? 'Tipo de póliza activado' : 'No fue posible activar el tipo de póliza'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
      return success
    },

    async _inactivateTypeOfPolicy(id: number) {
      let success = false
      await executeApi()
        .patch(`${URL_PATH_DERIVATIVE_CONTRACTING}/policies/${id}/inactivate`)
        .then((response) => {
          success = !!response.data?.success
          return showAlert(
            response.data?.message ??
            (success ? 'Tipo de póliza inactivado' : 'No fue posible inactivar el tipo de póliza'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
      return success
    },

    _clearData() {
      this.type_of_policies_list = []
      this.type_of_policies_pages = {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      }
      this.type_of_policy_received_request = null
    },
  },
})

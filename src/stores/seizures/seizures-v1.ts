// Vue - Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'

// Interfaces
import {
  ISeizureRequest,
  ISeizureMassiveCreatePayload,
  IMassiveValidationError,
} from '@/interfaces/customs/seizures/Seizures'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

const URL_PATH = `/seizure/api/seizure/seizure`

export const useSeizuresStoreV1 = defineStore('seizures-store-v1', {
  state: () => ({
    version: 'v1' as const,
  }),

  actions: {
    _buildCreateFormData(payload: ISeizureRequest): FormData {
      const fd = new FormData()

      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined) return

        if (key === 'document') {
          if (value instanceof File) {
            fd.append('document', value, value.name)
          }
          return
        }

        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            Object.entries(item).forEach(([k, v]) => {
              if (v !== null && v !== undefined) {
                fd.append(`${key}[${index}][${k}]`, String(v))
              }
            })
          })
          return
        }

        if (typeof value === 'object') {
          fd.append(key, JSON.stringify(value))
          return
        }

        fd.append(key, String(value))
      })

      return fd
    },

    //list
    async _listAction(params?: Record<string, string | number>) {
      return executeApi()
        .get(`${URL_PATH}/list`, {
          params: {
            ...params,
            paginate: 1,
          },
        })
        .then((response) => {
          const {
            success,
            data: { data = [], current_page = 0, last_page = 0 } = {},
            message,
          } = response.data

          if (success) {
            return {
              data,
              current_page,
              last_page,
            }
          }

          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    //get
    async _getAction(id: number | string) {
      return executeApi()
        .get(`${URL_PATH}/show/${id}`)
        .then((response) => {
          const { data, success, message } = response.data

          if (success) return data

          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    //create individual
    async _createIndividualAction(payload: ISeizureRequest) {
      const formData = this._buildCreateFormData(payload)

      return executeApi()
        .post(`${URL_PATH}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const { success, message } = response.data

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
          return success
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return false
        })
    },

    //create massive
    async _createMassiveAction(payload: ISeizureMassiveCreatePayload) {
      return executeApi()
        .post(`${URL_PATH}/create/massive`, payload)
        .then((response) => {
          const { success, message } = response.data

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )

          return success
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return false
        })
    },

    //update
    async _updateAction(id: number | string, payload: Record<string, unknown>) {
      return executeApi()
        .put(`${URL_PATH}/update/${id}`, payload)
        .then((response) => {
          const { success, message } = response.data

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
          return success
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return false
        })
    },
    //export
    async _exportAction(
      type: number,
      params?: Record<string, string | number>
    ) {
      return executeApi()
        .get(`${URL_PATH}/export/${type}`, {
          params,
          responseType: 'blob',
        })
        .then((response) => response.data)
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },
    //download massive template
    async _downloadMassiveTemplate() {
      return executeApi()
        .post(`${URL_PATH}/template/massive`, null, {
          responseType: 'blob',
        })
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },
    // validate massive template
    async _validateMassiveTemplate(payload: FormData) {
      return executeApi()
        .post(`${URL_PATH}/validator/massive`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const { success, data, message } = response.data

          if (!success) {
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          }
          showAlert(message, 'success', undefined, TIMEOUT_ALERT)

          return data
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },
    // export detail massive
    async _exportDetailMassiveAction(payload: {
      data: {
        errors: IMassiveValidationError[]
      }
    }) {
      return executeApi()
        .post(`${URL_PATH}/export-detail-masive`, payload, {
          responseType: 'blob',
        })
        .then((response) => response.data)
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    // manage seizure (procedimiento)
    async _manageSeizureProcedureAction(
      seizureId: number | string,
      payload: FormData
    ) {
      return executeApi()
        .post(`${URL_PATH}/procedure/${seizureId}`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          const { success, message } = response.data

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )

          return success
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return false
        })
    },

    // list seizure parameters
    async _listParametersAction(params?: Record<string, string | number>) {
      return executeApi()
        .get(`${URL_PATH}/parameters/list`, {
          params,
        })
        .then((response) => {
          const { success, data, message } = response.data

          if (success) {
            return data ?? []
          }

          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return []
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return []
        })
    },
    // update seizure parameter
    async _updateParameterAction(
      id: number | string,
      payload: {
        priority: number
        embargability_limit: number
      }
    ) {
      return executeApi()
        .put(`${URL_PATH}/parameters/${id}`, payload)
        .then((response) => {
          const { success, message } = response.data

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )

          return success
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return false
        })
    },
  },

  persist: true,
})

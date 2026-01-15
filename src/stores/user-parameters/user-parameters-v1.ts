// Pinia
import { defineStore } from 'pinia'

// Utils
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global/errorMessage'

import { IParameters } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useUserParametersV1 = defineStore('user-parameters-v1', {
  state: () => ({
    data_parameters: {} as IParameters,
    success_update_parameters: false,
  }),

  actions: {
    // User parameters
    async _getApiUserParameters() {
      await executeApi()
        .get('/users/api/users/parameters')
        .then((response) => {
          if (response.data.success) {
            this.data_parameters = response.data.data
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },
    async _setApiUserParameters() {
      const payload = {
        password_expiry_days: this.data_parameters.password_expiry_days ?? 0,
        max_failed_attempts: this.data_parameters.max_failed_attempts ?? 0,
        password_history_count:
          this.data_parameters.password_history_count ?? 0,
        auto_deactivate_unused:
          this.data_parameters.auto_deactivate_unused ?? false,
        login_type: this.data_parameters.login_type ?? '',
        max_active_sessions: this.data_parameters.max_active_sessions ?? 1,
        max_inactivity_days: this.data_parameters.max_inactivity_days ?? 0,
        session_timeout_minutes:
          this.data_parameters.session_timeout_minutes ?? 0,
      }
      await executeApi()
        .put('/users/api/users/parameters', payload)
        .then((response) => {
          if (response.data.success) {
            showAlert('Actualizado con exito', 'success')
            this.success_update_parameters = true
          }
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },
  },
})

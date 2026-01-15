// Vue - Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import { IAccountingParametersAccountingParametersAuxiliariesList } from '@/interfaces/customs/fics/AccountingParametersAuxiliaries'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_FICS}/accounting-parameters/parameters-list`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingParametersAccountingParametersAuxiliariesStoreV1 =
  defineStore('accounting-parameters-auxiliaries-store-v1', {
    state: () => ({
      accounting_parameters_auxiliaries_list:
        [] as IAccountingParametersAccountingParametersAuxiliariesList,
    }),

    actions: {
      async _getAccountingParametersAuxiliaries() {
        this._clearDataAccountingParametersAuxiliaries()

        await executeApi()
          .get(`${URL_PATH}`)
          .then((response) => {
            this.accounting_parameters_auxiliaries_list = response.data.data

            return showAlert(
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
      },

      _clearDataAccountingParametersAuxiliaries() {
        this.accounting_parameters_auxiliaries_list = []
      },
    },
  })

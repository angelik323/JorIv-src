import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IAccountingParametersProcessCodesList,
  IAccountingParametersProcessCodesFormList,
} from '@/interfaces/customs/fics/ProcessCodes'

const URL_PATH = `${URL_PATH_FICS}/process-codes`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingParametersProcessCodesStoreV1 = defineStore(
  'accounting-parameters-process-codes-store-v1',
  {
    state: () => ({
      process_codes_list: [] as IAccountingParametersProcessCodesList,
    }),

    actions: {
      async _getProcessCodes() {
        this._clearDataProcessCodes()
        await executeApi()
          .get(`${URL_PATH}`)
          .then((response) => {
            this.process_codes_list = response.data.data

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

      async _createProcessCode(
        data: IAccountingParametersProcessCodesFormList
      ) {
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

      _clearDataProcessCodes() {
        this.process_codes_list = []
      },
    },
  }
)

import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IAccountingParametersAccountingCopyForm } from '@/interfaces/customs/fics/AccountingCopy'

const URL_PATH = `${URL_PATH_FICS}/accounting-blocks/copy-accounting-parameters`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingParametersAccountingCopyStoreV1 = defineStore(
  'accounting-parameters-accounting-copy-store-v1',
  {
    state: () => ({
      accounting_copy_form:
        null as IAccountingParametersAccountingCopyForm | null,
    }),

    actions: {
      async _createAccountingCopy(
        data: IAccountingParametersAccountingCopyForm
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

      _setAccountingCopyForm(
        data: IAccountingParametersAccountingCopyForm | null
      ) {
        this.accounting_copy_form = data
      },
    },
  }
)

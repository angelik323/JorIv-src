import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
import { useAlert, useShowError } from '@/composables'
import { IErrors } from '@/interfaces/global'

import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

import {
  ITreasureReadjustmentForm
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTreasuryReadjustmentStoreV1 = defineStore(
  'treasury-readjustment-v1',
  {
    state: () => ({
      version: 'v1',
    }),

    actions: {
      async _treasuryBalanceAdjustmentProcess(data: Partial<ITreasureReadjustmentForm>) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_TREASURIES}/treasury-balance-adjustments/process`, data)
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
      }
    }
  }
)
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IEquityChangeReportLimit,
  IEquityChangeReportLimitsResponse,
  IReportingLimitChangesInEquityCreatePayload,
  IReportingLimitsUpdatePayload,
} from '@/interfaces/customs/accounting'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTING}/equity-change-report-limits`

export const useReportingLimitsForChangesInEquityStoreV1 = defineStore(
  'reporting-limits-for-changes-in-equity-store-v1',
  {
    state: () => ({
      version: 'v1',
      limits_list: [] as IEquityChangeReportLimit[],
      limits_pages: {
        currentPage: 0,
        lastPage: 0,
        total: 0,
      },
    }),

    actions: {
      async _createEquityChangeReportLimit(
        payload: IReportingLimitChangesInEquityCreatePayload
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/store`, payload)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
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

      async _getListReportingLimits(params: string) {
        await executeApi()
          .get<IEquityChangeReportLimitsResponse>(
            `${URL_PATH}?paginate=1${params ? `&${params}` : ''}`
          )
          .then((response) => {
            const { success, data, message } = response.data

            if (success) {
              this.limits_list = data.data
              this.limits_pages = {
                currentPage: data.current_page,
                lastPage: data.last_page,
                total: data.total,
              }
              showAlert(message, 'success', undefined, TIMEOUT_ALERT)
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _updateReportingLimits(
        payload: IReportingLimitsUpdatePayload
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/update-limits`, payload)
          .then((response) => {
            const { success: ok, message } = response.data

            showAlert(
              message,
              ok ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            success = ok
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _deleteReportingLimits(queryParams: string): Promise<boolean> {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/destroy?${queryParams}`)
          .then((response) => {
            const { success: ok, message } = response.data

            showAlert(
              message,
              ok ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            if (ok) {
              success = true
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },
    },
  }
)

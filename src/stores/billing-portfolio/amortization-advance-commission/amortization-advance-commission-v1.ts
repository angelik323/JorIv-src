import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_BILLING } from '@/constants/apis'
import {
  IAmortizationAdvanceCommissionCreate,
  IAmortizationAdvanceCommissionItemList,
  IAmortizationAdvanceCommissionResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAmortizationAdvanceCommissionStoreV1 = defineStore(
  'amortization-advance-commission-store-v1',
  {
    state: () => ({
      version: 'v1',
      data_information_form:
        null as IAmortizationAdvanceCommissionCreate | null,
      amortization_advance_commission_list:
        [] as IAmortizationAdvanceCommissionItemList[],
      amortization_advance_commission_response:
        {} as IAmortizationAdvanceCommissionResponse,
      amortization_advance_commission_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      selectedAmortizationId: null as number | null,
    }),

    actions: {
      async _getAmortizationAdvanceCommissionList(params: string) {
        this._clearData()

        await executeApi()
          .get(
            `${URL_PATH_BILLING}/amortization-commission?paginate=true${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.amortization_advance_commission_list =
                response.data?.data?.data ?? []
              this.amortization_advance_commission_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

            showAlert(
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

      async _postAmortizationAdvanceCommission(
        id: number | null,
        amortization_date: string | object | null
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_BILLING}/amortization-commission/${id}`,
            amortization_date
          )
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

      async _getByIdAmortizationAdvanceCommission(id: number | null) {
        await executeApi()
          .get(`${URL_PATH_BILLING}/amortization-commission/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.amortization_advance_commission_response =
                response.data?.data
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _cancelAmortizationAdvanceCommission(
        amortizationCommission: number | null,
        amortization: number | null,
        observation: string | object | null
      ) {
        await executeApi()
          .post(
            `${URL_PATH_BILLING}/amortization-commission/${amortizationCommission}/cancel/${amortization}`,
            { observation }
          )
          .then((response) => {
            if (response.data.success) {
              this.amortization_advance_commission_response = response.data.data
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.amortization_advance_commission_list = []
        this.amortization_advance_commission_response =
          {} as IAmortizationAdvanceCommissionResponse
        this.amortization_advance_commission_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },

      async _setDataBasicCollection(
        data: IAmortizationAdvanceCommissionCreate | null
      ) {
        this.data_information_form = data ? { ...data } : null
      },
    },
  }
)

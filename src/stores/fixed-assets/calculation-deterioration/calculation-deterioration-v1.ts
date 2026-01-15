// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'

// interfaces
import {
  ICalculationImparment,
  ICalculationResponse,
  ICalculationResponseList,
  ICalculationForm,
} from '@/interfaces/customs/fixed-assets/CalculationDeterioration'
import { IErrors } from '@/interfaces/global'

// composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCalculationDeteriorationStoreV1 = defineStore(
  'calculation-deterioration-v1',
  {
    state: () => ({}),

    actions: {
      async _getCalculationList(params: Record<string, string | number>) {
        const responseData = {
          pages: {
            currentPage: 1,
            lastPage: 1,
          },
          data: [] as ICalculationResponseList[],
        }

        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/fixed-assets-impairment`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const { data: items = [], message, success } = response.data
            responseData.data = items
            responseData.pages = {
              currentPage: 1,
              lastPage: 1,
            }

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
        return responseData
      },

      async _createCalculation(payload: ICalculationForm) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_FIXED_ASSETS}/fixed-assets-impairment`, payload)
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

      async _getCalculationById(id: number) {
        let responseData: ICalculationForm | null = null
        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/fixed-assets-impairment/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              responseData = {
                id: data.id ?? null,
                code: data.code ?? null,
                created_by_name: data.created_by_name ?? null,
                updated_by_name: data.updated_by_name ?? null,
                updated_at: data.updated_at ?? null,
                created_at: data.created_at ?? null,
                business_trust_id: data.business_trust_id ?? null,
                configuration_types_id: data.configuration_types_id ?? null,
                configuration_subtypes_id:
                  data.configuration_subtypes_id ?? null,
                asset_id: data.asset_id ?? null,
                statuses_id: data.statuses_id ?? null,
                reason_justification: data.reason_justification ?? null,
                book_value: data.book_value ?? null,
                fair_value: data.fair_value ?? null,
                acquisition_cost: data.acquisition_cost ?? null,
                estimated_sale_value: data.estimated_sale_value ?? null,
                estimated_sale_cost: data.estimated_sale_cost ?? null,
                total_residual_value: data.total_residual_value ?? null,
                total_cash_flows: data.total_cash_flows ?? null,
                number_of_periods: data.number_of_periods ?? null,
                discount_rate: data.discount_rate ?? null,
                value_in_use: data.value_in_use ?? null,
                recoverable_amount: data.recoverable_amount ?? null,
                impairment_loss: data.impairment_loss ?? null,
                impairment_percentage: data.impairment_percentage ?? null,
                code_calculation: data.code_calculation ?? null,
                voucher_id: data.voucher_id ?? null,
                type: data.type ?? null,
                subtype: data.subtype ?? null,
                location: data.location ?? null,
                responsible_id: data.responsible_id ?? null,
                status_id: data.status_id ?? null,
                description: data.description ?? null,
                currency: data.currency ?? null,
                currency_deterioration: data.currency_deterioration ?? null,
                date_deterioration: data.date_deterioration ?? null,
                residual_value: data.residual_value ?? null,

                asset: {
                  id: data.asset?.id ?? null,
                  code: data.asset?.code ?? null,
                  description: data.asset?.description ?? null,
                  location: data.asset?.location ?? null,
                  responsible_id: data.asset?.responsible_id ?? null,
                  status_name: data.asset?.status_name ?? null,
                },
                voucher:
                  data.voucher && data.voucher.length > 0
                    ? {
                        id: data.voucher[0].id ?? null,
                        code: data.voucher[0].code ?? null,
                        registration_date:
                          data.voucher[0].registration_date ?? null,
                        status: data.voucher[0].status ?? null, // ⬅️ Agregar status
                      }
                    : null,
              }
            }

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
        return responseData
      },
      async _deleteCalculation(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_FIXED_ASSETS}/fixed-assets-impairment/${id}`)
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

      async _getCalculation(
        payload: ICalculationImparment
      ): Promise<ICalculationResponse | null> {
        return executeApi()
          .post(
            `${URL_PATH_FIXED_ASSETS}/fixed-assets-impairment/calculate`,
            payload
          )
          .then((response) => {
            const result = response.data as ICalculationResponse

            showAlert(
              result.message,
              result.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return result
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)

            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
    },
  }
)

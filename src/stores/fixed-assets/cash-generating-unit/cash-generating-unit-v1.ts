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
  ICashUnitCreate,
  ICashUnitForm,
  ICashUnitResponseList,
} from '@/interfaces/customs/fixed-assets/CashGeneratingUnit'
import { IErrors } from '@/interfaces/global'

// prepare composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCashGeneratingUnitStoreV1 = defineStore(
  'cash-generating-unit-v1',
  {
    state: () => ({}),

    actions: {
      async _getCashUnitList(params: Record<string, string | number>) {
        const responseData = {
          pages: {
            currentPage: 1,
            lastPage: 1,
          },
          data: [] as ICashUnitResponseList[],
        }

        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/cgu`, {
            params: { ...params, paginate: 1 },
          })

          .then((response) => {
            const { data: paginatedData, message, success } = response.data
            const items = paginatedData?.data || []
            responseData.data = Array.isArray(items) ? items : []

            responseData.pages = {
              currentPage: response.data.current_page || 1,
              lastPage: response.data.last_page || 1,
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

      async _createCashUnit(payload: ICashUnitForm) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_FIXED_ASSETS}/cgu`, payload)
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

      async _getCashUnitById(id: number) {
        let responseData: ICashUnitForm | null = null
        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/cgu/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              responseData = data
            }
            if (success) {
              responseData = {
                id: data.business_trust.id ?? null,
                code: data.code ?? null,
                business_trust: data.business ?? null,
                description: data.description ?? null,
                configuration_type: data.type ?? null,
                created_at: data.created_at ?? null,
                initial_value: data.initial_value ?? null,
                currency: data.currency ?? null,
                status: data.status ?? null,
                created_by: data.created_by.name ?? null,
                updated_by: data.updated_by ?? null,
                updated_at: data.updated_at ?? null,
                description_type: data.description_type ?? null,
                business_trust_id: data.business_trust?.id ?? null,
                configuration_type_id: data.configuration_type?.id || null,
                cash_flow_generation_date:
                  data.cash_flow_generation_date || null,
                statuses_uge: data.statuses_uge ?? 1,
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

      async _updateCasUnit(payload: ICashUnitCreate, id: number) {
        let success = false
        await executeApi()
          .put(`${URL_PATH_FIXED_ASSETS}/cgu/${id}`, payload)
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

      async _deleteCasUnit(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_FIXED_ASSETS}/cgu/${id}`)
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

      async _updateCashUnitStatus(id: number, status_id: number) {
        let success = false
        await executeApi()
          .patch(`${URL_PATH_FIXED_ASSETS}/cgu/${id}`, { status_id })
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
    },
  }
)

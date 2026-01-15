import { useAlert, useShowError } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import {
  IDispersionDetailGroupResponse,
  IDispersionBreakdownGroupResponsev2,
  IDetailDispersionGroupRequestV2,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/v2/generate-dispersion-group`

export const useDetailDispersionGroupStoreV2 = defineStore(
  'detail-dispersion-group-store-v2',
  {
    state: () => ({
      version: 'v2',
      dispersion_detail_list: [] as IDispersionDetailGroupResponse[],
      dispersion_breakdown_list: [] as IDispersionBreakdownGroupResponsev2[],
    }),
    actions: {
      async _listDetailActionV2(params: string) {
        this.dispersion_detail_list = []

        await executeApi()
          .get(`${URL_PATH}/list-detail?${params}`)
          .then((response) => {
            const data = response.data

            if (response.data.success) {
              this.dispersion_detail_list = (data.data ?? []).map(
                (item: IDispersionDetailGroupResponse, index: number) => ({
                  id: index + 1,
                  ...item,
                })
              )
            }

            return showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _listBreakdownActionV2(params: string) {
        this.dispersion_breakdown_list = []

        await executeApi()
          .get(`${URL_PATH}/list-breakdown?paginate=1&${params}`)
          .then((response) => {
            const data = response.data

            if (response.data.success)
              this.dispersion_breakdown_list = data.data.data ?? []

            return showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _showActionV2(payload: {
        id: number
        record_expense_id: number | null
        bank_transfer_id: number | null
      }) {
        return await executeApi()
          .get(`${URL_PATH}/detail/${payload.id}`, {
            params: {
              record_expense_id: payload.record_expense_id,
              bank_transfer_id: payload.bank_transfer_id,
            },
          })
          .then((response) => {
            if (response.data.success) {
              return response.data.data
            }

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createActionV2(payload: IDetailDispersionGroupRequestV2[]) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            success = response.data.success
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

        return success
      },
    },
  }
)

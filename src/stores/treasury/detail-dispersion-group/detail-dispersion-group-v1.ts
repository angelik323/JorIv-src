import { useAlert, useShowError } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import {
  IDetailDispersionGroupRequest,
  IDispersionDetailGroupResponse,
  IDispersionBreakdownGroupResponse,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/generate-dispersion-group`

export const useDetailDispersionGroupStoreV1 = defineStore(
  'detail-dispersion-group-store-v1',
  {
    state: () => ({
      version: 'v1',
      dispersion_detail_list: [] as IDispersionDetailGroupResponse[],
      dispersion_breakdown_list: [] as IDispersionBreakdownGroupResponse[],
    }),
    actions: {
      async _listDetailAction(params: string) {
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

      async _listBreakdownAction(params: string) {
        this.dispersion_breakdown_list = []

        await executeApi()
          .get(`${URL_PATH}/list-breakdown?${params}`)
          .then((response) => {
            const data = response.data

            if (response.data.success)
              this.dispersion_breakdown_list = data.data ?? []

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

      async _showAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/detail/${id}`)
          .then((response) => {
            if (response.data.success) {
              return response.data.data
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
            return null
          })
      },

      async _createAction(payload: IDetailDispersionGroupRequest[]) {
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

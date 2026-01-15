import { useAlert, useShowError } from '@/composables'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import {
  IRangeForTable,
  ISelectorResources,
  IRangeDeferredResponse,
  IRangesForDeferredRequest,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTING}/deferred-impairments`

export const useRangesForDeferredStoreV1 = defineStore(
  'ranges-for-deferred-store-v1',
  {
    state: () => ({
      version: 'v1',
      ranges_list: [] as IRangeForTable[],
      ranges_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      account_structures: [] as ISelectorResources[],
      business_trusts: [] as ISelectorResources[],
      range_types: [] as ISelectorResources[],
    }),
    actions: {
      async _resourcesAction() {
        await executeApi()
          .get(`${URL_PATH}/filter-options`)
          .then((response) => {
            if (response.data.success) {
              if (response.data.data.account_structures) {
                this.account_structures =
                  response.data.data.account_structures.map(
                    (item: ISelectorResources) => ({
                      value: item.id,
                      label: item.name,
                    })
                  )
              }
              if (response.data.data.business_trusts) {
                this.business_trusts = response.data.data.business_trusts.map(
                  (item: ISelectorResources) => ({
                    value: item.id,
                    label: item.name,
                  })
                )
              }
              if (response.data.data.range_types) {
                this.range_types = response.data.data.range_types.map(
                  (item: ISelectorResources) => ({
                    value: item.id,
                    label: item.name,
                  })
                )
              }
            }

            return ''
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const responseData = response.data

            if (responseData.success) {
              const data = responseData.data.data as IRangeDeferredResponse[]

              const flattened = data.flatMap((item) =>
                item.ranges.map((range) => ({
                  id: item.id,
                  code: range.id,
                  range_type: range.range_type,
                  structure: item.account_structure
                    ? `${item.account_structure.code} - ${item.account_structure.purpose}`
                    : '-',
                  business: item.business_trusts?.[0]?.name ?? '-',
                  receipt_type: range.receipt_type?.code ?? '-',
                  receipt_sub_type: range.sub_receipt_type?.code ?? '-',
                }))
              )

              this.ranges_list = flattened
              this.ranges_pages.currentPage = responseData.current_page ?? 1
              this.ranges_pages.lastPage = responseData.last_page ?? 1
            }

            return showAlert(
              responseData.message,
              responseData.success ? 'success' : 'error',
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
          .get(`${URL_PATH}/${id}`)
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

      async _createAction(payload: IRangesForDeferredRequest) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/`, payload)
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

      async _updateAction(payload: IRangesForDeferredRequest) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/${payload.id}`, payload)
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

      _clearData() {
        this.ranges_list = []
        this.ranges_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)

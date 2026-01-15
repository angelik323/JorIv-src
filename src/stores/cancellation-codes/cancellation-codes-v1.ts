import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  ICancellationCodes,
  ICancellationCodesResponse,
} from '@/interfaces/customs'
import { defineStore } from 'pinia'

const URL_PATH_CANCELLATION_CODES =
  'treasuries/api/treasuries/treasury-cancellation-codes'
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCancellationCodesStoreV1 = defineStore(
  'cancellation-codes-v1',
  {
    state: () => ({
      version: 'v1',
      cancellation_codes_list: [] as ICancellationCodes[],
      cancellation_codes_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as ICancellationCodes | null,
      cancellation_codes_request: null as ICancellationCodes | null,
    }),
    actions: {
      async _getListAction(params: string) {
        this.cancellation_codes_list = []
        await executeApi()
          .get(`${URL_PATH_CANCELLATION_CODES}?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.cancellation_codes_list =
                response.data?.data?.data?.map(
                  (item: ICancellationCodesResponse) => {
                    return {
                      id: item.id,
                      code: item.cancellation_code,
                      description: item.description,
                      type: item.type,
                      reverses_conciliation: item.reverse_conciliation,
                      retains_consecutive_check:
                        item.preserve_consecutive_check,
                    }
                  }
                ) ?? []

              this.cancellation_codes_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
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

      async _getByIdCancellationCode(id: number) {
        this.cancellation_codes_request = null
        this.data_information_form = null
        await executeApi()
          .get(`${URL_PATH_CANCELLATION_CODES}/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res = response.data?.data
              if (res) {
                this.cancellation_codes_request = {
                  id: res.id,
                  code: res.cancellation_code,
                  description: res.description,
                  type: res.type,
                  reverses_conciliation: res.reverse_conciliation,
                  retains_consecutive_check: res.preserve_consecutive_check,
                }
              }
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

      async _createCancellationCode(
        payload: ICancellationCodesResponse
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .post(`${URL_PATH_CANCELLATION_CODES}`, payload)
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

      async _updateCancellationCode(
        payload: ICancellationCodesResponse,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH_CANCELLATION_CODES}/${id}`, payload)
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

      async _changeStatusAction(id: number) {
        await executeApi()
          .delete(`${URL_PATH_CANCELLATION_CODES}/${id}`)
          .then((response) => {
            this._getListAction('')
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

      _setDataCancellationCodes(data_to_set: ICancellationCodes | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },
    },
  }
)

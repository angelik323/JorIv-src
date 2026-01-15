// Pinia
import { defineStore } from 'pinia'

// Utils
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'

// Interfaces
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IUncheckDeliveryChecksList } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const URL_PATH = `${URL_PATH_TREASURIES}/check-unmark-delivered`

export const useUncheckDeliveryChecksStoreV1 = defineStore(
  'uncheck-delivery-checks-store-v1',
  {
    state: () => ({
      data_uncheck_delivery_checks_list: [] as IUncheckDeliveryChecksList[],
      data_uncheck_delivery_checks_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IUncheckDeliveryChecksList | null,
    }),

    actions: {
      async _getApiUncheckDeliveryChecks(params: string) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.data_uncheck_delivery_checks_list =
                response.data?.data?.data ?? []
              this.data_uncheck_delivery_checks_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
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

      async _confirmUncheckDeliveryChecks(data: { check_ids: number[] }) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/confirm`, data)
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

      _setDataInformationForm(data_to_set: IUncheckDeliveryChecksList | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _clearData() {
        this.data_uncheck_delivery_checks_list = []
        this.data_uncheck_delivery_checks_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

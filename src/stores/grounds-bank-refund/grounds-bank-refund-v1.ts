// Pinia
import { defineStore } from 'pinia'

// Utils
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'

// Interfaces
import { IGroundsBankRefund, IGroundsBankRefundForm } from '@/interfaces/customs'

const URL_PATH_GROUNDS_BANK_REFOUND =
  'treasuries/api/treasuries/reasons-for-bank-returns'
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useGroundsBankRefundV1 = defineStore(
  'user-grounds-bank-refund-v1',
  {
    state: () => ({
      data_grounds_bank_list: [] as IGroundsBankRefund[],
      data_grounds_bank_request: null as IGroundsBankRefund | null,
      data_gruonds_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IGroundsBankRefundForm | null,
    }),

    actions: {
      async _getApiGroundsBankRefund(params: string) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH_GROUNDS_BANK_REFOUND}?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.data_grounds_bank_list = response.data?.data?.data
              this.data_gruonds_pages = {
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

      async _getByIdGroundsBankRefund(id: number) {
        await executeApi()
          .get(`${URL_PATH_GROUNDS_BANK_REFOUND}/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res = response.data?.data
              if (res) {
                this.data_grounds_bank_request = { ...res }
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

      async _createGroundsBankRefund(
        data: IGroundsBankRefund
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .post(`${URL_PATH_GROUNDS_BANK_REFOUND}`, data)
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

      async _updateGroundsBankRefund(data: IGroundsBankRefund, id: number) {
        let success = false
        this.data_grounds_bank_request = null
        await executeApi()
          .put(`${URL_PATH_GROUNDS_BANK_REFOUND}/${id}`, data)
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

      async _deleteGroundsBankRefund(id: number) {
        await executeApi()
          .delete(`${URL_PATH_GROUNDS_BANK_REFOUND}/${id}`)
          .then((response) => {
            this._getApiGroundsBankRefund('')
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

      _setDataInformationForm(data_to_set: IGroundsBankRefundForm | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _clearData() {
        this.data_grounds_bank_list = []
        this.data_grounds_bank_request = null
        this.data_gruonds_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

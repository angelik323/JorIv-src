import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IFiduciaryBusinessCommissionsResponse,
  IFiduciaryBusinessCommissionsList,
  IFiduciaryBusinessCommissionsForm,
  IFiduciaryBusinessCommissionsToEdit,
  IFiduciaryBusinessCommissionsCalculationForm,
  IFiduciaryBusinessCommissionsDescriptionsList,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useFiduciaryBusinessCommissionsV1 = defineStore(
  'fiduciary-business-commissions-store-v1',
  {
    state: () => ({
      version: 'v1',
      fiduciary_business_commissions_list:
        [] as IFiduciaryBusinessCommissionsList[],
      fiduciary_business_commissions_response:
        null as IFiduciaryBusinessCommissionsResponse | null,
      calculation_commissions_response:
        null as IFiduciaryBusinessCommissionsCalculationForm | null,
      fiduciary_business_commissions_descriptions:
        [] as IFiduciaryBusinessCommissionsDescriptionsList[],
      fiduciary_business_commissions_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getFiduciaryBusinessCommissionsList(
        params: Record<string, string | number>
      ) {
        this._clearData()

        await executeApi()
          .get(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions`,
            {
              params: { ...params, paginate: 1 },
            }
          )
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.fiduciary_business_commissions_list = items
            this.fiduciary_business_commissions_pages.currentPage = current_page
            this.fiduciary_business_commissions_pages.lastPage = last_page

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
      },

      async _getByIdFiduciaryBusinessCommissions(id: number) {
        await executeApi()
          .get(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/${id}`
          )
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.fiduciary_business_commissions_response = { ...responseData }
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
      },

      async _getByIdDescriptionsFiduciaryBusinessCommissions(
        id: number,
        params?: Record<string, string | number>
      ) {
        await executeApi()
          .get(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/${id}/descriptions`,
            {
              params: { ...params, paginate: 1 },
            }
          )
          .then((response) => {
            const { message, success } = response.data
            const { descriptions } = response.data.data

            this.fiduciary_business_commissions_descriptions = descriptions.data
            this.fiduciary_business_commissions_pages.currentPage =
              descriptions.current_page
            this.fiduciary_business_commissions_pages.lastPage =
              descriptions.last_page

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
      },

      async _getByIdCalculationCommissions(id: number) {
        await executeApi()
          .get(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/${id}/settlement-parameters`
          )
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.calculation_commissions_response = { ...responseData }
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
      },

      async _createFiduciaryBusinessCommissions(
        data: Partial<IFiduciaryBusinessCommissionsForm>
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions`,
            data
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

      async _updateRFiduciaryBusinessCommissions(
        data: Partial<IFiduciaryBusinessCommissionsToEdit>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/${id}`,
            data
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

      async _createCalculationCommissions(
        id: number,
        data: Partial<IFiduciaryBusinessCommissionsCalculationForm>
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/${id}/settlement-parameters`,
            data
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

      _clearData() {
        this.fiduciary_business_commissions_list = []
        this.fiduciary_business_commissions_response = null
        this.calculation_commissions_response = null
        this.fiduciary_business_commissions_descriptions = []
        this.fiduciary_business_commissions_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

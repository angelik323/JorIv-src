// Vue - pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IPaginated } from '@/interfaces/customs'
import {
  IInvestmentFundValidationItem,
  IInvestmentFundItem,
  IFundValidationResponse,
  IDetailedMovement,
  IDetailedMovementParticipation,
} from '@/interfaces/customs/fics/ValidationFicsClosing'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_FICS}/collective-investment-funds`

const initialState = () => ({
  version: 'v1',
  validations: {
    list: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  } as IPaginated<IInvestmentFundValidationItem>,
  listFunds: [] as IInvestmentFundItem[],
  listFundsValidation: [] as IFundValidationResponse[],
  detailedMovements: [] as IDetailedMovement[],
  detailedMovementsParticipation: [] as IDetailedMovementParticipation[],
})

export const useValidationFicsClosingStoreV1 = defineStore(
  'validation-fics-closing-store-v1',
  {
    state: () => initialState(),
    actions: {
      async _getFunds(params: {}) {
        await executeApi()
          .get(`${URL_PATH}/for-closing`, { params: { ...params } })
          .then((response) => {
            const data = response.data
            if (response.data.success) {
              this.listFunds = response.data.data.sort(
                (a: IInvestmentFundItem, b: IInvestmentFundItem) =>
                  Number(a.fund_code) - Number(b.fund_code)
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

      async _undoValidation(payload: {}) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_FICS}/closing-funds/undo-validation`, payload)
          .then((response) => {
            success = response.data.success
            showAlert(
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

      async _transferParticipationType(payload: {}) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_FICS}/closing-funds/transfer-plans`, payload)
          .then((response) => {
            success = response.data.success
            showAlert(
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

      async _validation(payload: {}) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_FICS}/closing-funds/validate`, payload)
          .then((response) => {
            success = response.data.success
            showAlert(
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

      async _validationDetails(params: {}) {
        let isSuccess = false
        await executeApi()
          .get(`${URL_PATH}/for-closing-validation`, { params: { ...params } })
          .then((response) => {
            const data = response.data

            isSuccess = response.data.success
            if (response.data.success) {
              this.listFundsValidation = response.data.data
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
        return isSuccess
      },

      async _getDetailedMovements(params: {}) {
        this.detailedMovements = []
        let success = false
        await executeApi()
          .get(`${URL_PATH_FICS}/closing-funds/detailed-movements`, {
            params: { ...params },
          })
          .then((response) => {
            const data = response.data

            if (response.data.success) {
              this.detailedMovements = response.data.data
              success = true
            }

            showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _getDetailedMovementsParticipation(params: {}) {
        this.detailedMovementsParticipation = []
        let success = false
        await executeApi()
          .get(
            `${URL_PATH_FICS}/fund-participations/filtered-movements?paginate=true`,
            {
              params: { ...params },
            }
          )
          .then((response) => {
            const data = response.data

            if (response.data.success) {
              this.detailedMovementsParticipation =
                response.data.data.data || []
              success = true
            }

            showAlert(
              data.message,
              data.success ? 'success' : 'error',
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
        this.validations.list = []
        this.validations.pages = {
          currentPage: 1,
          lastPage: 1,
        }
        this.listFunds = []
        this.listFundsValidation = []
        this.detailedMovements = []
        this.detailedMovementsParticipation = []
      },
    },
  }
)

import { defineStore } from 'pinia'
import {
  IBankingEntitiesAccountingParametersCommissions,
  ICreateBankingEntitiesAccountingParametersCommissions,
} from '@/interfaces/customs'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useAlert, useShowError } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const VALID_PATTERNS = [/.*/]

export const useBankingEntitiesAccountingParametersCommissionsStoreV1 = defineStore(
  'banking-entities-accounting-parameters-commissions-store-v1',
  {
    state: () => ({
      banking_entities_list: [] as | IBankingEntitiesAccountingParametersCommissions[] | [],
      type_banking_entities_request:
        null as IBankingEntitiesAccountingParametersCommissions | null,
      error_information_form: null as string | null,
      data_information_form:
        null as ICreateBankingEntitiesAccountingParametersCommissions | null,
    }),
    actions: {
      async _getListAction(params: string = '', pages: number = 20) {
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/accounting_parameters_commissions/bank_entities?paginate=1&rows=${pages}${params}`
          )
          .then((response) => {
            this.banking_entities_list = response.data?.data?.data ?? []
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            this.banking_entities_list = []
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getByIdBankingEntitiesAccountingParametersCommissions(id: number) {
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/accounting_parameters_commissions/bank_entities/${id}`
          )
          .then((response) => {
            if (response.data.success) {
              const res: IBankingEntitiesAccountingParametersCommissions = response.data?.data
              if (res) {
                this.type_banking_entities_request = res
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

      async _createBankingEntitiesAccountingParametersCommissions(
        data: ICreateBankingEntitiesAccountingParametersCommissions
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/accounting_parameters_commissions/bank_entities`,
            data
          )
          .then((response) => {
            success = response.data.success
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            const message = error.response?.data?.message
            if (this._isValidMessageLike(message)) {
              this.error_information_form = message
            } else {
              this.error_information_form = null
            }
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _getBankingEntitiesAccountingParametersCommissionsList(params: string = '', id: number) {
        this.banking_entities_list = []
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/accounting_parameters_commissions/bank_entities?accounting_blocks_collection_id=${encodeURIComponent(id)}${params}`)
          .then((response) => {
            if (response.data.success) {
              this.banking_entities_list = response.data?.data?.data ?? []
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

      async _deleteBankingEntitiesAccountingParametersCommissions(id: number) {
        await executeApi()
          .delete(
            `${URL_PATH_TREASURIES}/accounting_parameters_commissions/bank_entities/${id}`
          )
          .then((response) => {
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

      async _updateBankingEntitiesAccountingParametersCommissions(
        data: ICreateBankingEntitiesAccountingParametersCommissions,
        id: number
      ): Promise<boolean> {
        let success = false
        this.type_banking_entities_request = null
        await executeApi()
          .put(
            `${URL_PATH_TREASURIES}/accounting_parameters_commissions/bank_entities/${id}`,
            data
          )
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
            const message = error.response?.data?.message
            this.error_information_form = this._isValidMessageLike(message)
              ? message
              : null
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      _setDataInformationForm(
        data_to_set: ICreateBankingEntitiesAccountingParametersCommissions | null
      ) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _isValidMessageLike(message: string) {
        if (typeof message !== 'string') return false
        return VALID_PATTERNS.some((pattern) => pattern.test(message))
      },
    },
  }
)

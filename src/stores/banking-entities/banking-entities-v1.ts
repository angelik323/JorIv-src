import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IBankEntity, IBankingEntitiesList } from '@/interfaces/customs'
const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const TIMEOUT_ALERT = 3000
const URL_PATH_TREASURIES = 'treasuries/api/treasuries'
const VALID_PATTERNS = [
  /Esta identificación.*asignad[ao].*al banco \d+ .*/i,
  /Esta autorización había sido .*rechazad[ao].* por:.*número AUTH-\d+\./i,
  /El código bancario.*asignad[ao].*al banco \d+ .*/i,
  /El codigo bancario.*asignad[ao].*al banco \d+ .*/i,
  /Debes justificar el registro por nit o código bancario duplicado\./i,
]

export const useBankingEntities = defineStore('banking-entities-v1', {
  state: () => ({
    banking_entities_list: [] as IBankingEntitiesList[] | [],
    banking_entities_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as IBankEntity | null,
    error_information_form: null as string | null,
    bank_receipt_request: null as IBankingEntitiesList | null,
    bank_entity_creation_error_flag: true,
  }),

  actions: {
    async _getBankingEntitiesList(params: string) {
      this.banking_entities_list = []
      await executeApi()
        .get(
          `${URL_PATH_TREASURIES}/banking-entities/banks?paginate=1${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.banking_entities_list = response.data?.data?.data ?? []
            this.banking_entities_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.banking_entities_pages.lastPage =
              response.data?.data?.last_page ?? 0
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

    async _createBankingEntities(payload: object): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_TREASURIES}/banking-entities/banks/save`, payload)
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
          if (this._isValidMessageLike(error.response.data.message)) {
            this.error_information_form = error.response.data.message
          } else {
            this.bank_entity_creation_error_flag = true
            this.error_information_form = null
          }
        })
      return success
    },

    async _getByIdBankingEntities(id: number) {
      this.bank_receipt_request = null
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/banking-entities/banks/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.bank_receipt_request = response.data.data ?? null
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

    async _deleteBankingEntities(params: number) {
      await executeApi()
        .delete(`${URL_PATH_TREASURIES}/banking-entities/banks/${params}`)
        .then(() => {
          showAlert('Entidad bancaria eliminada', 'success')
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _updateBankingEntities(
      id: number,
      payload: object
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .put(
          `${URL_PATH_TREASURIES}/banking-entities/banks/save/${id}`,
          payload
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
          if (this._isValidMessageLike(error.response.data.message)) {
            this.error_information_form = error.response.data.message
          } else {
            this.error_information_form = null
          }
        })
      return success
    },

    async _setDataBasicBankingEntitie(data: IBankEntity | null) {
      this.data_information_form = data ? { ...data } : null
    },

    async _setBankReceiptRequest(data: IBankingEntitiesList | null) {
      this.bank_receipt_request = data ? { ...data } : null
    },

    async _dataBasicError(data: string | null) {
      this.error_information_form = data ? { ...JSON.parse(data) } : null
    },

    _isValidMessageLike(message: string) {
      if (typeof message !== 'string') {
        return false
      }

      return VALID_PATTERNS.some((pattern) => pattern.test(message))
    },
  },
})

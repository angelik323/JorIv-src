import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IBankContactList } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const TIMEOUT_ALERT = 3000
const URL_PATH_TREASURIES = 'treasuries/api/treasuries'

export const useBankContacts = defineStore('bank-contacts-v1', {
  state: () => ({
    bank_contacts_list: [] as IBankContactList[] | [],
    bank_contacts_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form_contacts: null as IBankContactList | null,
    bank_contacts_request: null as IBankContactList | null,
    bankingEntitieContactsId: null as number | null,
  }),
  actions: {
    async _getBankContactsList(params: string, id: number) {
      this.bank_contacts_list = []
      await executeApi()
        .get(
          `${URL_PATH_TREASURIES}/banking-entities/bank/contacts/by-bank/${id}?paginate=1${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.bank_contacts_list = response.data?.data?.data ?? []
            this.bank_contacts_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.bank_contacts_pages.lastPage =
              response.data?.data?.last_page ?? 0
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getByIdBankContacts(id: number) {
      this.bank_contacts_request = null
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/banking-entities/bank/contacts/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.bank_contacts_request = response.data?.data ?? null
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

    async _createBankContacts(payload: object): Promise<boolean> {
      let success = false

      await executeApi()
        .post(`${URL_PATH_TREASURIES}/banking-entities/bank/contacts`, payload)
        .then((response) => {
          success = response.data.success

          if (response.data.success) {
            this.bank_contacts_list = response.data?.data ?? []
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
      return success
    },

    async _updateBankContacts(id: number, payload: object): Promise<boolean> {
      let success = false
      await executeApi()
        .put(
          `${URL_PATH_TREASURIES}/banking-entities/bank/contacts/${id}`,
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
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
      return success
    },

    async _deleteBankContacts(id: number) {
      await executeApi()
        .delete(`${URL_PATH_TREASURIES}/banking-entities/bank/contacts/${id}`)
        .then(() => {
          showAlert('Sucursal bancaria eliminada', 'success')
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    _emptyBankContactsList() {
      this.bank_contacts_list = []
      this.bank_contacts_pages.currentPage = 0
      this.bank_contacts_pages.lastPage = 0
    },

    async _setDataBasicBankContacts(data: IBankContactList | null) {
      this.data_information_form_contacts = data ? { ...data } : null
    },
  },
})

import {
  IBankBranchesList,
  BasicBankBranch,
  IBankBranchesRequest,
} from '@/interfaces/customs'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const TIMEOUT_ALERT = 3000
const URL_PATH_TREASURIES = 'treasuries/api/treasuries'
export const useBankBranches = defineStore('bank-branches-v1', {
  state: () => ({
    bank_branches_list: [] as IBankBranchesList[] | [],
    bank_branches_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as BasicBankBranch | null,
    bank_branches_request: null as IBankBranchesRequest | null,
  }),

  actions: {
    async _getBankBranchesByEntitiesList(params: string, id: number) {
      this.bank_branches_list = []
      await executeApi()
        .get(
          `${URL_PATH_TREASURIES}/banking-entities/bank/branches/by-bank/${id}?paginate=1${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.bank_branches_list = response.data?.data?.data ?? []
            this.bank_branches_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.bank_branches_pages.lastPage =
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

    async _createBankBranches(params: object): Promise<boolean> {
      let success = false

      await executeApi()
        .post(`${URL_PATH_TREASURIES}/banking-entities/bank/branches`, params)
        .then((response) => {
          success = response.data.success

          if (response.data.success) {
            this.bank_branches_list = response.data?.data ?? []
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

    async _getByIdBankBranches(id: number) {
      this.bank_branches_request = null
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/banking-entities/bank/branches/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.bank_branches_request = response.data.data ?? null
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

    async _updateBankBranches(id: number, payload: object): Promise<boolean> {
      let success = false

      await executeApi()
        .put(
          `${URL_PATH_TREASURIES}/banking-entities/bank/branches/${id}`,
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

    async _deleteBankBranches(params: number) {
      await executeApi()
        .delete(
          `${URL_PATH_TREASURIES}/banking-entities/bank/branches/${params}`
        )
        .then(() => {
          showAlert('Sucursal bancaria eliminada', 'success')
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _setDataBasicBankBranches(data: any | null) {
      this.data_information_form = data ? { ...data } : null
    },
  },
})

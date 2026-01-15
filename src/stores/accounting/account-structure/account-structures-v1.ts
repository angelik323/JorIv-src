import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import { IAccountStructure, IAccountStructureModel } from '@/interfaces/customs'

const URL_PATH = 'accounting/api/accounting/account-structures'
const TIMEOUT_ALERT = 3000
const ACCOUNTING_CATALOG_TYPE = 'Catálogo de cuentas contables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountStructuresV1 = defineStore('account-structures-v1', {
  state: () => ({
    version: 'v1',
    accounting_catalog_type: ACCOUNTING_CATALOG_TYPE,
    account_structures_list: [] as IAccountStructure[],
    account_structures_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    selected_account_structure: null as null | IAccountStructure,
  }),
  actions: {
    async _getListAction(params: string) {
      this._cleanAccountStructuresData()
      await executeApi()
        .get(`${URL_PATH}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.account_structures_list = response.data?.data?.data ?? []
            this.account_structures_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.account_structures_pages.lastPage =
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

    _cleanAccountStructuresData() {
      this.account_structures_list = []
      this.account_structures_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },

    async _createAccountStructure(payload: IAccountStructureModel) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}`, payload)
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

    async _updateAccountStructure(id: number, payload: IAccountStructureModel) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${id}`, payload)
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

    async _getAccountStructure(id: number) {
      let accountStructure = null

      await executeApi()
        .get(`${URL_PATH}/${id}`)
        .then((response) => {
          if (response.data.success) {
            accountStructure = response.data.data
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

      return accountStructure
    },

    async _toggleAccountStructureStatus() {
      const { status, id } = this.selected_account_structure!
      const status_id = status.id === 1 ? 2 : 1
      let success = false

      await executeApi()
        .patch(`${URL_PATH}/${id}/status`, {
          status_id: status_id,
        })
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

    async _deleteValidation(limit: number) {
      let success = false
      await executeApi()
        .get(`${URL_PATH}/validate-deletion/${limit}`)
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

      return { success }
    },

    _selectAccountStructure(accountStructure: IAccountStructure) {
      this.selected_account_structure = accountStructure
    },
  },
})

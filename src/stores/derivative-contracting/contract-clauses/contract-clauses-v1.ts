import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import {
  IContractClausesList,
  IContractClausesResponse,
  IContractClausesForm,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'

const URL_PATH_CONTRACT_CLAUSES = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract-clauses`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useContractClausesStoreV1 = defineStore(
  'contract-clauses-store-v1',
  {
    state: () => ({
      version: 'v1',
      contract_clauses_list: [] as IContractClausesList[],
      contract_clauses_response: null as IContractClausesResponse | null,
      contract_clauses_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getContractClausesList(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(URL_PATH_CONTRACT_CLAUSES, {
            params: { ...params, paginate: true },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.contract_clauses_list = items.map(
              (item: IContractClausesList) => ({
                ...item,
              })
            )
            this.contract_clauses_pages.currentPage = current_page
            this.contract_clauses_pages.lastPage = last_page

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

      async _getByIdContractClauses(id: number) {
        await executeApi()
          .get(`${URL_PATH_CONTRACT_CLAUSES}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.contract_clauses_response = { ...responseData }
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

      async _createContractClauses(data: Partial<IContractClausesForm>) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_CONTRACT_CLAUSES}`, data)
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

      async _updateContractClauses(
        data: Partial<IContractClausesForm>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH_CONTRACT_CLAUSES}/${id}`, data)
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

      async _deleteContractClauses(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH_CONTRACT_CLAUSES}/${id}`)
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

      async _changeStatus(id: number, status_id: number) {
        let success = false

        await executeApi()
          .patch(`${URL_PATH_CONTRACT_CLAUSES}/${id}`, { status_id })
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
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      _clearData() {
        this.contract_clauses_list = []
        this.contract_clauses_response = null
        this.contract_clauses_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { defineStore } from 'pinia'
import { IBudgetLevelsList } from '@/interfaces/customs/budget/BudgetLevels'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'
import { TIMEOUT_ALERT } from '@/constants/alerts'
const URL_PATH = `${URL_PATH_BUDGET}/budget-levels`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { getNameBlob, downloadBlobXlxx } = useUtils()

const initialState = () => ({
  version: 'v1',
  budget_level_list: [] as IBudgetLevelsList[],
  budget_level_pages: {
    currentPage: 0,
    lastPage: 0,
  },
  budget_level: {} as IBudgetLevelsList,
})

export const useBudgetLevelsStoreV1 = defineStore('budget-levels-store-v1', {
  state: initialState,

  actions: {
    async _deleteAction(id: number) {
      let success = false
      await executeApi()
        .delete(`${URL_PATH}/destroy/${id}`)
        .then((response) => {
          success = response.data.success
          const message = response.data.message
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

    async _downloadBudgetLevelsReceipt(gotUrl: string) {
      await executeApi()
        .get(`${URL_PATH}/export?${gotUrl}`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const fileName = getNameBlob(response)
          downloadBlobXlxx(blob, fileName)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error')
        })
    },

    async _getBudgetLevelsList(params: string) {
      const sanitizedParams = `${params ?? ''}`.trim()
      let queryParams = ''
      if (sanitizedParams) {
        queryParams = sanitizedParams.startsWith('&')
          ? sanitizedParams
          : `&${sanitizedParams}`
      }
      this._cleanData()
      await executeApi()
        .get(`${URL_PATH}/list?paginate=true${queryParams}`)
        .then((response) => {
          if (response.data.success) {
            this.budget_level_list = response.data?.data?.data ?? []
            this.budget_level_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.budget_level_pages.lastPage =
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

    async _getBudgetLevelById(id: number) {
      try {
        const response = await executeApi().get(`${URL_PATH}/show/${id}`)
        if (response.data.success) {
          this.budget_level = response.data?.data ?? {}
          return true
        }
        showAlert(
          'Error al cargar el nivel presupuestal',
          'error',
          undefined,
          TIMEOUT_ALERT
        )
        return false
      } catch (error) {
        showAlert(
          showCatchError(error as IErrors),
          'error',
          undefined,
          TIMEOUT_ALERT
        )
        return false
      }
    },

    async _createBudgetLevels(payload: IBudgetLevelsList) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}/new`, payload)
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

    _cleanData() {
      this.budget_level_list = []
      this.budget_level_pages = {
        currentPage: 0,
        lastPage: 0,
      }
      this.budget_level = initialState().budget_level
    },

    async _updateBudgetLevels(id: number, payload: IBudgetLevelsList) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/update/${id}`, payload)
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
  },
  persist: true,
})

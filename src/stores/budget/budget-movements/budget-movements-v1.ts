import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { defineStore } from 'pinia'
import {
  IBudgetMovementsList,
  IBudgetMovementFormItem,
  IBudgetLevelsList,
} from '@/interfaces/customs/budget/BudgetLevels'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_BUDGET}/code-movement-levels`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { getNameBlob, downloadBlobXlxx } = useUtils()

const initialState = () => ({
  version: 'v1',
  budget_movements_list: [] as IBudgetMovementsList[],
  budget_movements_pages: {
    currentPage: 0,
    lastPage: 0,
  },
  budget_movements: {} as IBudgetMovementsList,
  selected_budget_level_id: null as number | null,
  selected_budget_level_item: null as IBudgetLevelsList | null,
  budget_movement_item: null as IBudgetMovementsList | null,
})

export const useBudgetMovementsStoreV1 = defineStore(
  'budget-movements-store-v1',
  {
    state: initialState,

    actions: {
      _setEditingItem(item: IBudgetMovementsList) {
        this.budget_movement_item = item
      },

      _clearEditingItem() {
        this.budget_movement_item = null
      },

      _setSelectedBudgetLevel(id: number | null) {
        this.selected_budget_level_id = id
      },

      _setSelectedBudgetLevelItem(row: IBudgetLevelsList) {
        this.selected_budget_level_item = row
      },

      async _getBudgetMovementById(id: number) {
        try {
          const response = await executeApi().get(`${URL_PATH}/show/${id}`)
          if (response.data.success) {
            this.budget_movement_item = response.data?.data ?? null
            return true
          }
          showAlert(
            'Error al cargar el movimiento presupuestal',
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

      async _downloadBudgetMovements(gotUrl: string) {
        let sanitizedParams = ''
        if (gotUrl) {
          sanitizedParams = gotUrl.startsWith('&')
            ? gotUrl.substring(1)
            : gotUrl
        }
        const queryParams = sanitizedParams ? `?${sanitizedParams}` : ''
        await executeApi()
          .get(`${URL_PATH}/export${queryParams}`, {
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

      async _getBudgetMovementsList(params: string) {
        let sanitizedParams = ''
        if (params) {
          sanitizedParams = params.startsWith('&') ? params : `&${params}`
        }
        const queryParams = `${sanitizedParams}`
        this._cleanData()
        await executeApi()
          .get(`${URL_PATH}/list?paginate=1${queryParams}`)
          .then((response) => {
            if (response.data.success) {
              this.budget_movements_list = response.data?.data?.data ?? []
              this.budget_movements_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.budget_movements_pages.lastPage =
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

      async _createBudgetMovements(payload: IBudgetMovementFormItem[]) {
        let success = false
        if (!Array.isArray(payload) || !payload.length) return false
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
        this.budget_movements_list = []
        this.budget_movements_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.budget_movements = initialState().budget_movements
        this.budget_movement_item = null
      },

      async _updateBudgetMovements(
        id: number,
        payload: IBudgetMovementFormItem
      ) {
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
  }
)

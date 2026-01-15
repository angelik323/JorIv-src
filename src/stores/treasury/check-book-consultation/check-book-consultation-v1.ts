import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { ICheckbookQuery, ICheckbookHistory } from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCheckbookQueryStorev1 = defineStore(
  'checkbook-query-store-v1',
  {
    state: () => ({
      version: 'v1',
      checkbook_query_list: [] as ICheckbookQuery[],
      checkbook_query_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      selected_checkbook_query: null as ICheckbookQuery | null,
      checkbook_history: [] as ICheckbookHistory[],
    }),

    actions: {
      async _getListAction(params = '') {
        this._cleanList()

        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/check-book-inquiry?paginate=1${
              params ? `${params}` : ''
            }`
          )
          .then((response) => {
            if (!response.data?.success) {
              showAlert(
                response.data?.message ?? 'No fue posible obtener el listado',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              return
            }

            const payload = response.data.data

            if (Array.isArray(payload)) {
              this.checkbook_query_list = payload
              this.checkbook_query_pages = { currentPage: 1, lastPage: 1 }
            } else {
              this.checkbook_query_list = Array.isArray(payload?.data)
                ? payload.data
                : []
              this.checkbook_query_pages = {
                currentPage: payload?.current_page ?? 1,
                lastPage: payload?.last_page ?? 1,
              }
            }

            showAlert(
              response.data.message,
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getCheckbookHistory(
        id: number
      ): Promise<ICheckbookHistory[] | null> {
        this.checkbook_history = []

        return await executeApi()
          .get(`${URL_PATH_TREASURIES}/check-book-history/${id}`)
          .then((response) => {
            if (response.data.success) {
              const data = response.data.data
              this.checkbook_history = Array.isArray(data) ? data : []

              showAlert(
                response.data.message,
                'success',
                undefined,
                TIMEOUT_ALERT
              )
              return this.checkbook_history
            }

            showAlert(response.data.message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      _selectCheckbookQuery(item: ICheckbookQuery) {
        this.selected_checkbook_query = item
      },

      _cleanList() {
        this.checkbook_query_list = []
        this.checkbook_query_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

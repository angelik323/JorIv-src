// Vue - Vue Router - Pinia - Quasar
import { defineStore } from 'pinia'

// Interfaces
import { IFundsTypes } from '@/interfaces/customs/fics/FundsTypes'
import { IErrors } from '@/interfaces/global'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

export const useFundsTypesStoreV1 = defineStore('funds-types-store-v1', {
  state: () => ({
    funds_types_list: [] as IFundsTypes[],
    funds_types_operation_list: [] as IFundsTypes[],
    funds_types_pages: {
      currentPage: 1,
      lastPage: 1,
    },
  }),
  actions: {
    async _getFundsTypesList() {
      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      executeApi()
        .get(`${URL_PATH_FICS}/fund-types-opearation-types/fund-types`)
        .then((response) => {
          const { current_page, last_page, message, success, data } =
            response.data

          if (success) {
            this.funds_types_list = data ?? []
            this.funds_types_pages = {
              currentPage: current_page ?? 1,
              lastPage: last_page ?? 1,
            }
          }
          return showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error: IErrors) => {
          showCatchError(error)
        })
    },
    async _getFundsTypesOperationList() {
      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      executeApi()
        .get(`${URL_PATH_FICS}/fund-types-opearation-types/operation-types`)
        .then((response) => {
          const { current_page, last_page, message, success, data } =
            response.data

          if (success) {
            this.funds_types_operation_list = data ?? []
            this.funds_types_pages = {
              currentPage: current_page ?? 1,
              lastPage: last_page ?? 1,
            }
          }
          return showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error: IErrors) => {
          showCatchError(error)
        })
    },
  },
})

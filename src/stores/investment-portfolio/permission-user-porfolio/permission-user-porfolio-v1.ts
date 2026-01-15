// vue | quasar | router
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// composables
import { useAlert, useShowError } from '@/composables'

// utils
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IPermissionUserPorfolioCreate,
  IPermissionUserPorfolioForm,
  IPermissionUserPortfolioItemList,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePermissionUserPorfolioStoreV1 = defineStore(
  'permission-user-porfolio-store-v1',
  {
    state: () => ({
      version: 'v1',
      permission_user_porfolio_list: [] as IPermissionUserPortfolioItemList[],
      permission_user_porfolio_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IPermissionUserPorfolioForm | null,
    }),
    actions: {
      async _getListAction(params: string = '') {
        this._cleanData()

        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.permission_user_porfolio_list = response.data.data.data ?? []
              this.permission_user_porfolio_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }
            showAlert(
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

      async _getByIdPermissionUserPorfolio(id: number) {
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/show/${id}`
          )
          .then((response) => {
            if (response.data.success) {
              const res = response.data.data
              if (res) {
                this.data_information_form = res
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

      async _updatePermissionUserPorfolio(
        data: IPermissionUserPorfolioForm,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/update/${id}`,
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
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      async _createPermissionUserPorfolio(data: IPermissionUserPorfolioCreate) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/new/`,
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
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      async _deletePermissionUserPorfolio(id: number) {
        let success = false
        await executeApi()
          .delete(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/permission-user-portfolio/destroy/${id}`
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
      _setDataInformationForm(data_to_set: IPermissionUserPorfolioForm | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _cleanData() {
        this.permission_user_porfolio_list = []
        this.permission_user_porfolio_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

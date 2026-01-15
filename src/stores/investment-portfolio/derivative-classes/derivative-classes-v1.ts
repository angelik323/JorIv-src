import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IDerivativeClassesListItem,
  IDerivativeClassesResponse,
  IDerivativeClassesToCreate,
} from '@/interfaces/customs/investment-portfolio/DerivativeClasses'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useDerivativeClassesStoreV1 = defineStore(
  'derivative-classes-store-v1',
  {
    state: () => ({
      version: 'v1',
      headerPropsDefault: {
        title: 'Clases de derivados',
        breadcrumbs: [
          { label: 'Inicio', route: 'HomeView' },
          { label: 'Portafolio de inversiones', route: '' },
          {
            label: 'Clases de derivados',
            route: 'DerivativeClassesList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: useUtils().defaultIconsLucide.plusCircleOutline,
        },
      },
      derivative_classes_list: [] as IDerivativeClassesListItem[],
      derivate_classes_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      derivate_classes_response: null as IDerivativeClassesResponse | null,
    }),

    actions: {
      async _getDerivateClassesList(params: Record<string, string | number>) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/derivative-class`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data
            this.derivative_classes_list = items as IDerivativeClassesListItem[]
            this.derivate_classes_pages.currentPage = current_page
            this.derivate_classes_pages.lastPage = last_page

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

      async _getDerivativeClassesById(id: number): Promise<void> {
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/derivative-class/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.derivate_classes_response = { ...responseData }
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

      async _createDerivativeClasses(
        payload: Partial<IDerivativeClassesToCreate>
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/derivative-class`, payload)
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

      async _updateDerivativeClasses(
        payload: Partial<IDerivativeClassesToCreate>,
        id: number
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/derivative-class/${id}`,
            payload
          )
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

      async _deleteDerivativeClass(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_INVESTMENT_PORTFOLIO}/derivative-class/${id}`)
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
          .put(`${URL_PATH_INVESTMENT_PORTFOLIO}/derivative-class/${id}`, {
            status_id,
          })
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

      _clearData() {
        this.derivative_classes_list = []
        this.derivate_classes_pages = { currentPage: 0, lastPage: 0 }
        this.derivate_classes_response = null
      },
    },
  }
)

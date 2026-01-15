import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ITypesCoverageList,
  ITypesCoverageResponse,
  ITypesCoverageToCreate,
  ITypesCoverageToEdit,
} from '@/interfaces/customs/investment-portfolio/TypesCoverage'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTypesCoverageStoreV1 = defineStore('types-coverage-store-v1', {
  state: () => ({
    headerPropsDefault: {
      title: 'Tipos de cobertura',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Portafolio de inversión',
          route: '',
        },
        {
          label: 'Tipos de cobertura',
          route: 'TypesCoverageList',
        },
      ],

      btn: {
        label: 'Crear',
        icon: useUtils().defaultIconsLucide.plusCircleOutline,
      },
    },
    types_coverage_list: [] as ITypesCoverageList[],
    types_coverage_response: null as ITypesCoverageResponse | null,
    types_coverage_pages: {
      currentPage: 0,
      lastPage: 0,
    },
  }),

  actions: {
    async _getCoverageTypeList(params: Record<string, string | number>) {
      this._clearData()

      await executeApi()
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.types_coverage_list = items as ITypesCoverageList[]
          this.types_coverage_pages.currentPage = current_page
          this.types_coverage_pages.lastPage = last_page

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

    async _getByIdTypesCoverage(id: number) {
      await executeApi()
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type/${id}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.types_coverage_response = { ...responseData }
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

    async _createCoverageType(data: Partial<ITypesCoverageToCreate>) {
      let success = false

      await executeApi()
        .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type`, data)
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

    async _editTypeCoverage(data: Partial<ITypesCoverageToEdit>, id: number) {
      let success = false

      await executeApi()
        .put(`${URL_PATH_INVESTMENT_PORTFOLIO}/coverage-type/${id}`, data)
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
      this.types_coverage_list = []
      this.types_coverage_response = null
      this.types_coverage_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})

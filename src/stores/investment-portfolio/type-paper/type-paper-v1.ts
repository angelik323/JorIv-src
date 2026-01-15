import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IPaperTypeListItem,
  ITypePaperToCreate,
  ITypePaperResponse,
} from '@/interfaces/customs/investment-portfolio/TypePaper'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useUtils, useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePaperTypesStoreV1 = defineStore('paper-types-store-v1', {
  state: () => ({
    headerPropsDefault: {
      title: 'Tipos de papel',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Portafolio de inversiones',
        },
        {
          label: 'Tipos de papel',
          route: 'PaperTypesList',
        },
      ],
      btn: {
        label: 'Crear',
        icon: useUtils().defaultIconsLucide.plusCircleOutline,
      },
    },
    paper_type_list: [] as IPaperTypeListItem[],
    paper_type_response: null as ITypePaperResponse | null,
    paper_type_pages: {
      currentPage: 0,
      lastPage: 0,
    },
  }),

  actions: {
    async _getListAction(params: Record<string, string | number>) {
      await executeApi()
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/paper-types`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          if (response.data.success) {
            this.paper_type_list =
              (response.data?.data?.data as IPaperTypeListItem[]) ?? []
            this.paper_type_pages.currentPage =
              response.data?.data?.current_page ?? 1
            this.paper_type_pages.lastPage = response.data?.data?.last_page ?? 1
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

    async _createPaperType(data: Partial<ITypePaperToCreate>) {
      let success = false

      await executeApi()
        .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/paper-types`, data)
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

    async _getByPaperTypeId(paperTypeId: number) {
      await executeApi()
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/paper-types/${paperTypeId}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.paper_type_response = { ...responseData }
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

    _clearData() {
      this.paper_type_list = []
      this.paper_type_response = null
      this.paper_type_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})

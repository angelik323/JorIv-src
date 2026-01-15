import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

//interfaces
import {
  IFractionationSendData,
  IFractionationTitles,
} from '@/interfaces/customs'

//Composables - Utils
import { useAlert, useShowError, useUtils } from '@/composables'

//Constants
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useFractionationTitlesStorev1 = defineStore(
  'fractionation-titles-store-v1',
  {
    state: () => ({
      headerProps: {
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Portafolio de inversiones',
            route: 'InvestmentPortfolioView',
          },
          {
            label: 'Operaciones renta fija',
            route: '',
          },
        ],
        btn: {
          label: 'Crear',
          icon: useUtils().defaultIconsLucide.plusCircleOutline,
        },
      },
      fractionation_titles_list: [] as [],
      pages: {
        currentPage: 0,
        lastPage: 0,
      },
      fractionation_titles_response: null as IFractionationTitles | null,
    }),
    actions: {
      async _getListFractionationTitles(params: string): Promise<void> {
        this.fractionation_titles_list = []
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/fixed-rate-division/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.fractionation_titles_list = response.data.data.data ?? []
              this.pages.currentPage = response.data?.data?.current_page ?? 0
              this.pages.lastPage = response.data?.data?.last_page ?? 0
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
      async _validateFractionationTitle(
        payload: IFractionationSendData
      ): Promise<IFractionationTitles | null> {
        let success = false
        let dataResponse: IFractionationTitles | null = null
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/fixed-rate-division/preview`,
            payload
          )
          .then((response) => {
            const { data: responseData, message } = response.data
            dataResponse = responseData ?? null
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
        return dataResponse
      },
      async _createFractionationTitle(
        payload: Partial<IFractionationSendData>
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/fixed-rate-division/new`,
            payload
          )
          .then((response) => {
            if (response.data.success) {
              success = response.data.success
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
        return success
      },
      async _getFractionationTitleDetail(id: string | number): Promise<void> {
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/fixed-rate-division/${id}/show`
          )
          .then((response) => {
            const { data: responseData, message, success } = response.data
            if (success && responseData) {
              this.fractionation_titles_response = { ...responseData }
            }
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
      },
      _clearData() {
        this.fractionation_titles_response = null
        this.fractionation_titles_list = []
        this.pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

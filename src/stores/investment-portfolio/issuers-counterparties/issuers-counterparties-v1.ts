import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  THIRD_PARTY_API_URL,
  URL_PATH_INVESTMENT_PORTFOLIO,
} from '@/constants/apis'
import {
  IIssuersCounterparties,
  IIssuersCounterpartiesForm,
  IThirdDocumentResponse,
} from '@/interfaces/customs'
import { defaultIconsLucide } from '@/utils'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useIssuersCounterpartiesStoreV1 = defineStore(
  'issuers-counterparties-store-v1',
  {
    state: () => ({
      data_issuers_counterparties_list: [] as IIssuersCounterparties[],
      data_issuers_counterparties_form:
        null as IIssuersCounterpartiesForm | null,
      responseThirdDocument: {} as IThirdDocumentResponse,
      headerPropsDefault: {
        title: 'Emisores y contrapartes',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Portafolio de inversiones',
          },
          {
            label: 'Emisores y contrapartes',
            route: 'IssuersCounterpartiesList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: defaultIconsLucide.plusCircleOutline,
        },
      },
      pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _getListIssuersCounterparties(params: string) {
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/issuers-counter-party/get?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_issuers_counterparties_list =
                response.data?.data?.data ?? []
              this.pages.currentPage = response.data?.data?.current_page ?? 1
              this.pages.lastPage = response.data?.data?.last_page ?? 1
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
      async _getIssuersCounterpartiesByID(id: number) {
        let success = false
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/issuers-counter-party/show/${id}`
          )
          .then((response) => {
            success = response.data.success
            const responseData = response.data.data ?? null
            if (responseData) {
              responseData.class_ratings = responseData.class_ratings.map(
                (rating: any) => {
                  return typeof rating === 'object' && 'class_name' in rating
                    ? rating.class_name
                    : rating
                }
              )
            }
            this.data_issuers_counterparties_form = responseData
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
      async _validExistsThirdDocument(document: string) {
        let success = false
        await executeApi()
          .get(
            `${THIRD_PARTY_API_URL}third-parties/valid-exists-third?document=${document}`
          )
          .then((response) => {
            success = response.data.success
            this.responseThirdDocument = response.data?.data ?? {}
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
      _setDataIssuersCounterpartiesForm(
        data: IIssuersCounterpartiesForm | null
      ) {
        this.data_issuers_counterparties_form = data
      },
      async _createAction(
        payload: IIssuersCounterpartiesForm
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/issuers-counter-party/new`,
            payload
          )
          .then((response) => {
            success = response.data.success

            if (response.data.success) {
              this.data_issuers_counterparties_form = null
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

        return success
      },
      async _updateAction(
        issuersCounterpartiesId: string,
        payload: IIssuersCounterpartiesForm
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/issuers-counter-party/update/${issuersCounterpartiesId}`,
            payload
          )
          .then((response) => {
            success = response.data.success

            if (response.data.success) {
              this.data_issuers_counterparties_form = null
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

        return success
      },
    },
  }
)

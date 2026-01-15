import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IMarketabilityType } from '@/interfaces/customs'
import { defineStore } from 'pinia'
const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()
export const useMarketabilityTypesCollectionStoreV1 = defineStore(
  'marketability-types-collection-store-v1',
  {
    state: () => ({
      marketability_types_list: [] as IMarketabilityType[] | [],
      marketability_types_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IMarketabilityType | null,
    }),
    actions: {
      async _getMarketabilityTypesList(params: string = '') {
        this.marketability_types_list = []
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/bursatility-types?${params}`)
          .then((response) => {
            if (response.data.success) {
              this.marketability_types_list = response.data?.data ?? []
              this.marketability_types_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.marketability_types_pages.lastPage =
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
      async _getMarketabilityTypeById(id: number) {
        let success = false
        this.data_information_form = null
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/bursatility-types/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_information_form = response.data?.data ?? null
              success = response.data.success
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
      async _createMarketabilityType(data: IMarketabilityType) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/bursatility-types/new`, data)
          .then((response) => {
            if (response.data.success) {
              success = response.data.success
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
      async _updateMarketabilityType(data: IMarketabilityType, id: number) {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/bursatility-types/update/${id}`,
            data
          )
          .then((response) => {
            if (response.data.success) {
              success = response.data.success
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
      _setDataInformationForm(data: IMarketabilityType | null) {
        this.data_information_form = data
      },
    },
  }
)

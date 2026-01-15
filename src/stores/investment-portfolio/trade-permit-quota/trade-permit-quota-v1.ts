import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { ITradePermitQuota, ITradePermitQuotaList } from '@/interfaces/customs/'
import { defineStore } from 'pinia'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTradePermitQuotaCollectionStoreV1 = defineStore(
  'trade-permit-quota-collection-store-v1',
  {
    state: () => ({
      trade_permit_quota_list: [] as ITradePermitQuotaList[],
      trade_permit_quota_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as ITradePermitQuota | null,
    }),
    actions: {
      async _getTradePermitQuotaList(params: string = ''): Promise<void> {
        this.trade_permit_quota_list = []
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/trade-permit-quota/list?paginate=1${params}`,
          )
          .then((response) => {
            if (response.data.success) {
              this.trade_permit_quota_list = response.data?.data?.data ?? []
              this.trade_permit_quota_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.trade_permit_quota_pages.lastPage =
                response.data?.data?.last_page ?? 0
            }
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT,
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _createTradePermitQuota(
        payload: ITradePermitQuota,
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/trade-permit-quota/new`,
            payload,
          )
          .then((response) => {
            if (response.data.success) {
              success = response.data.success
            }
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT,
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      async _updateTradePermitQuota(
        id: number,
        payload: ITradePermitQuota,
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/trade-permit-quota/update/${id}`,
            payload,
          )
          .then((response) => {
            if (response.data.success) {
              success = response.data.success
            }
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT,
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      async _getTradePermitQuotaById(id: number): Promise<void> {
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/trade-permit-quota/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_information_form = response.data?.data ?? null
            }
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT,
            )
          })
      },
      async _deleteTradePermitQuota(id: number): Promise<boolean> {
        let success = false
        await executeApi()
          .delete(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/trade-permit-quota/destroy/${id}`,
          )
          .then((response) => {
            if (response.data.success) {
              success = response.data.success
            }
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT,
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      _setDataInformationForm(data: ITradePermitQuota | null) {
        this.data_information_form = data
      },
    },
  },
)

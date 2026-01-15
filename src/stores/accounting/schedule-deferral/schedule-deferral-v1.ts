import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  IBusinessTrust,
  IPaginated,
  IScheduleDeferral,
  IScheduleDeferralItem,
  IScheduleItem,
  IScheduleDeferralModel,
} from '@/interfaces/customs'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_ACCOUNTING}/deferred-schedules`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  schedule_deferral: {
    structure: { id: 0, code: 0, purpose: '', name: '' },
    business_trust: { id: 0, name: '' },
    from_business_trust: { id: 0, name: '' },
    to_business_trust: { id: 0, name: '' },
    voucher_data_id: 0,
    parameters: [],
    installments: 0,
    installment_amount: '',
    start_period: '',
  } as IScheduleDeferral,
  schedule_deferral_list: [] as IScheduleDeferralItem[],
  schedule_deferral_pages: {
    currentPage: 0,
    lastPage: 0,
  },
  deferral_business_trust: {
    list: [],
    pages: { currentPage: 0, lastPage: 0 },
  } as IPaginated<IBusinessTrust>,
  business_vouchers: {
    list: [],
    pages: { currentPage: 0, lastPage: 0 },
  } as IPaginated<IScheduleItem>,
  selected_voucher_data: {} as IScheduleItem,
})

export const useScheduleDeferralStoreV1 = defineStore(
  'schedule-deferral-store-v1',
  {
    state: initialState,
    actions: {
      _cleanScheduleDeferralsData() {
        this.schedule_deferral_list = []
        this.schedule_deferral_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.business_vouchers = initialState().business_vouchers
        this.deferral_business_trust = initialState().deferral_business_trust
      },
      async _getScheduleDeferralList(params: string) {
        this._cleanScheduleDeferralsData()
        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.schedule_deferral_list = response.data?.data?.data ?? []
              this.schedule_deferral_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.schedule_deferral_pages.lastPage =
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
      async _getBusiness(params: string = '') {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/getBusiness?${params}&paginate=1`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.deferral_business_trust = {
                list: response.data.data.data,
                pages: {
                  lastPage: response.data.data.last_page,
                  currentPage: response.data.data.current_page,
                },
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

        return success
      },
      async _getVouchers(params: string = '') {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/vouchers?${params}&paginate=1`)
          .then((response) => {
            success = response.data.success
            if (success) {
              const businessVouchers = response.data.data.data
              this.business_vouchers = {
                list: businessVouchers,
                pages: {
                  lastPage: response.data.data.last_page,
                  currentPage: response.data.data.current_page,
                },
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

        return success
      },
      async _saveParameter(payload: IScheduleDeferralModel) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.schedule_deferral = response.data.data
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
      async _updateParameters(id: number, payload: IScheduleDeferralModel) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${id}`, payload)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.schedule_deferral = response.data.data
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
      async _getScheduleDeferral(id: number) {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            success = response.data.success
            if (success) {
              const parameters = response.data.data
              this.schedule_deferral.parameters = parameters
              this.schedule_deferral.installments = parameters[0].installments
              this.schedule_deferral.installment_amount =
                parameters[0].installment_amount
              this.schedule_deferral.voucher_data = parameters[0].voucher_data
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

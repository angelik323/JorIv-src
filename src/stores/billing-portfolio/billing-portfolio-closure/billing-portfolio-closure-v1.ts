// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_BILLING } from '@/constants/apis'
// Interfaces
import { IErrors } from '@/interfaces/global'
import {
  IBillingAndPortfolioClousureInformationForm,
  IBillingAndPortfolioClousureList,
} from '@/interfaces/customs'
// composables & pinia & apis
import { defineStore } from 'pinia'
import { useAlert, useShowError, useUtils } from '@/composables'
import { executeApi } from '@/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
export const useBillingPortfolioClosureStoreV1 = defineStore(
  'billing-portfolio-closure-store-v1',
  {
    state: () => ({
      version: 'v1',
      billing_portfolio_clouser_list: [] as IBillingAndPortfolioClousureList[],
      billing_portfolio_clouser_response:
        {} as IBillingAndPortfolioClousureInformationForm,
      billing_portfolio_clouser_validated_response:
        {} as IBillingAndPortfolioClousureInformationForm,
      billing_portfolio_clouser_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      validate_pending_requirements_request: {} as {},
    }),

    actions: {
      async _getBillingPortfolioClosureList(params: string) {
        this._clearData()

        await executeApi()
          .get(
            `${URL_PATH_BILLING}/accounting-period-closures?paginate=true${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.billing_portfolio_clouser_list =
                response.data?.data?.data ?? []
              this.billing_portfolio_clouser_pages = {
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
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _postBillingPortfolioClosure(id: number, data: object) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_BILLING}/accounting-period-closures/${id}/confirm`,
            data
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

      async _getByIdBillingPortfolioClosure(id: number | null) {
        await executeApi()
          .get(`${URL_PATH_BILLING}/accounting-period-closures/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.billing_portfolio_clouser_response = response.data?.data
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

      async _postValidatePendingRequirements(payload: object) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_BILLING}/accounting-period-closures`, payload)
          .then((response) => {
            success = response.data?.success ?? false
            this.billing_portfolio_clouser_validated_response =
              response.data?.data ?? {}
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _getRevalidatePendingRequirements(id: number) {
        let success = false
        await executeApi()
          .get(
            `${URL_PATH_BILLING}/accounting-period-closures/${id}/revalidate`
          )
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false
            this.billing_portfolio_clouser_validated_response =
              response.data.data ?? {}
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

      async _getDataExcel(id: number): Promise<void> {
        await executeApi()
          .get(`${URL_PATH_BILLING}/accounting-period-closures/${id}/export`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error: unknown) => {
            showAlert(
              showCatchError(error as IErrors),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      _clearData() {
        this.billing_portfolio_clouser_list = []
        this.billing_portfolio_clouser_response =
          {} as IBillingAndPortfolioClousureInformationForm
        this.billing_portfolio_clouser_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.billing_portfolio_clouser_validated_response =
          {} as IBillingAndPortfolioClousureInformationForm
      },
    },
  }
)

// Vue - pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import { IErrors } from '@/interfaces/global'
import {
  IGenericInvestmentPlansLegalizationExportDetails,
  IGenericInvestmentPlansLegalizeLegalization,
  IGenericInvestmentPlansLegalizeContribution,
  IGenericInvestmentPlansLegalizeFormData,
  IGenericInvestmentPlansLegalizeResponse,
  IGenericInvestmentPlans,
} from '@/interfaces/customs/fics/GenericInvestmentPlans'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

const URL_PATH_LEGALIZE = `${URL_PATH_FICS}/investment-resource-legalization`
const URL_PATH = `${URL_PATH_FICS}/generic-investment-plans`

export const useGenericInvestmentPlansStoreV1 = defineStore(
  'generic-investment-plans-store-v1',
  {
    state: () => ({
      generic_investment_list: [] as IGenericInvestmentPlans[],
      generic_investment_pages: {
        currentPage: 1,
        lastPage: 1,
      },

      generic_investment_plan_unidentified_contributions_list:
        [] as IGenericInvestmentPlansLegalizeContribution[],
      generic_investment_plan_unidentified_contributions_pages: {
        currentPage: 1,
        lastPage: 1,
      },

      generic_investment_plan_legalizations_list:
        [] as IGenericInvestmentPlansLegalizeLegalization[],
      generic_investment_plan_legalizations_pages: {
        currentPage: 1,
        lastPage: 1,
      },

      generic_investment_plan_legalization_export_list:
        [] as IGenericInvestmentPlansLegalizationExportDetails[],

      generic_investment_plan_legalization_export_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.generic_investment_list = items.map(
              (item: IGenericInvestmentPlans) => ({
                ...item,
              })
            )
            this.generic_investment_pages.currentPage = current_page
            this.generic_investment_pages.lastPage = last_page

            return showAlert(
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

      async _createAction(payload: IGenericInvestmentPlans) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
            return showAlert(
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

        return isSuccess
      },

      async _showGenericPlanById(id: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(`${URL_PATH_LEGALIZE}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data


            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            if (success) return data as IGenericInvestmentPlansLegalizeResponse

            return null
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _listGenericPlanUnidentifiedContributionsById(id: string) {
        this._clearGenericPlanUnidentifedContributions()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(
            `${URL_PATH_FICS}/investment-resource-legalization/${id}/contributions`,
            { params: { paginate: true } }
          )
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.generic_investment_plan_unidentified_contributions_list = items
            this.generic_investment_plan_unidentified_contributions_pages.currentPage =
              current_page
            this.generic_investment_plan_unidentified_contributions_pages.lastPage =
              last_page

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

      async _createInvestmentPlansLegalization(
        id: number,
        data: IGenericInvestmentPlansLegalizeFormData
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .post(
            `${URL_PATH_FICS}/investment-resource-legalization/legalize/${id}`,
            data
          )
          .then((response) => {
            const { message, success } = response.data
            const isSuccess = success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return isSuccess
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },

      async _cancelInvestmentPlansLegalization(
        legalizationId: number
      ): Promise<boolean> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .put(
            `${URL_PATH_FICS}/investment-resource-legalization/annul-legalization/${legalizationId}`
          )
          .then((response) => {
            const { message, success } = response.data
            const isSuccess = success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return isSuccess
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },

      async _listGenericPlanLegalizations(
        genericPlanId: number,
        params: Record<string, string | number>
      ) {
        this._clearGenericPlanLegalizations()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return executeApi()
          .get(
            `${URL_PATH_FICS}/investment-resource-legalization/${genericPlanId}/legalizations`,
            { params: { ...params, paginate: true } }
          )
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.generic_investment_plan_legalizations_list = items
            this.generic_investment_plan_legalizations_pages.currentPage =
              current_page
            this.generic_investment_plan_legalizations_pages.lastPage =
              last_page

            return showAlert(
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
            return false
          })
      },

      async _listGenericPlanLegalizationExport(
        genericPlanId: number,
        params: Record<string, string | number>
      ) {
        this._clearGenericPlanLegalizationsExport()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return executeApi()
          .get(
            `${URL_PATH_FICS}/investment-resource-legalization/${genericPlanId}/legalizations-to-export`,
            { params: { ...params, paginate: true } }
          )
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.generic_investment_plan_legalization_export_list = items
            this.generic_investment_plan_legalization_export_pages.currentPage =
              current_page
            this.generic_investment_plan_legalization_export_pages.lastPage =
              last_page

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

      async _downloadLegalizationList(
        genericPlanId: number,
        params: Record<string, string | number>
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        await executeApi()
          .post(
            `${URL_PATH_FICS}/investment-resource-legalization/export-legalizations`,
            null,
            {
              params: {
                ...params,
                'filter[generic_investment_plan_id]': genericPlanId,
              },
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = getNameBlob(response)
            downloadBlobXlxx(blob, fileName)
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearGenericPlanUnidentifedContributions() {
        this.generic_investment_plan_unidentified_contributions_list = []
        this.generic_investment_plan_unidentified_contributions_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _clearGenericPlanLegalizations() {
        this.generic_investment_plan_legalizations_list = []
        this.generic_investment_plan_legalizations_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _clearGenericPlanLegalizationsExport() {
        this.generic_investment_plan_legalization_export_list = []
        this.generic_investment_plan_legalization_export_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _clearData() {
        this.generic_investment_list = []
        this.generic_investment_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)

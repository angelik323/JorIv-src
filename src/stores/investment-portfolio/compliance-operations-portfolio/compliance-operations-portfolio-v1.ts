import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IComplianceOperationsPortfolio,
  IComplianceOperationsPortfolioForm,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { defaultIconsLucide } = useUtils()

export const useComplianceOperationsPortfolioStoreV1 = defineStore(
  'compliance-operations-portfolio-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Cumplimiento operaciones portafolio',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Tesorería',
          },
          {
            label: 'Cumplimiento operaciones portafolio',
            route: 'ComplianceOperationsPortfolioList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: defaultIconsLucide.plusCircleOutline,
          options: [
            {
              label: 'Cumplimiento',
              routeName: 'ComplianceOperationsPortfolioCreate',
            },
            {
              label: 'Anulación cumplimiento',
              routeName: 'ComplianceOperationsPortfolioCancel',
            },
          ],
          textColor: 'white',
        },
      },
      pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    getters: {},
    actions: {
      async _getComplianceOperationsPortfolioList(
        params: string,
        isPaginated = false
      ) {
        let data_portfolio_operations_compliance_list: IComplianceOperationsPortfolio[] =
          []
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/select-tables?keys[]=operation_compliance_list${params}${
              isPaginated ? '&operation_compliance_list_paginated=true' : ''
            }`
          )
          .then((response) => {
            if (response.data.success) {
              const data = isPaginated
                ? response.data?.data?.operation_compliance_list.data
                : response.data?.data?.operation_compliance_list

              data_portfolio_operations_compliance_list =
                (data as IComplianceOperationsPortfolio[]) ?? []

              this.pages.currentPage = response.data?.data?.current_page ?? 1
              this.pages.lastPage = response.data?.data?.last_page ?? 1
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
        return data_portfolio_operations_compliance_list
      },
      async _createComplianceOperationsPortfolio(
        payload: IComplianceOperationsPortfolioForm
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-compliance`,
            payload
          )
          .then((response) => {
            success = response.data.success

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
      async _cancelComplianceOperationsPortfolio(id: number | string) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/operation-compliance/cancel/${id}`
          )
          .then((response) => {
            success = response.data.success

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

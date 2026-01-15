// Vue - pinia - moment
import { defineStore } from 'pinia'

// Interfaces
import {
  IGuaranteeOperationMoneyOperationsResponse,
  IGuaranteeOperationPayload,
  IGuaranteeOperationResponseById,
  IGuaranteeOperationsList,
  IGuaranteeOperationTilesResponse,
} from '@/interfaces/customs/investment-portfolio/GuaranteeOperations'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// APIs
import { executeApi } from '@/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useGuaranteeOperationsStoreV1 = defineStore(
  'guarantee-operations-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Llamado al margen y mantenimiento de garantías',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Portafolio de inversiones',
          },
          {
            label: 'Operaciones renta fija',
            route: 'GuaranteeOperationsList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: useUtils().defaultIconsLucide.plusCircleOutline,
          options: [
            { label: 'Llamado al margen', routeName: 'MarginCallCreate' },
            {
              label: 'Mantenimiento de garantías',
              routeName: 'MaintenanceGuaranteesCreate',
            },
          ],
          color: 'primary',
          textColor: 'white',
          size: 'md',
          class: 'btn-header',
          outline: false,
          disable: false,
        },
      },
      guarantee_operation_list: [] as IGuaranteeOperationsList[],
      pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    getters: {},
    actions: {
      async _getGuaranteeOperationList(
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/list`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            if (response.data.success) {
              this.guarantee_operation_list =
                (response.data?.data?.data as IGuaranteeOperationsList[]) ?? []
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
      },
      async _createGuaranteeOperation(payload: IGuaranteeOperationPayload) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/new`,
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
      async _getGuaranteeOperationById(id: number) {
        let data_guarantee_operation_by_id =
          null as IGuaranteeOperationResponseById | null
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/show/${id}`
          )
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              data_guarantee_operation_by_id = { ...responseData }
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
        return data_guarantee_operation_by_id
      },
      async _getListMoneyMarketOperations(params: string) {
        let data_response =
          null as IGuaranteeOperationMoneyOperationsResponse | null

        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/guarantee-operation/list-money-market?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              data_response = response.data
                .data as IGuaranteeOperationMoneyOperationsResponse
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
        return data_response
      },
      async _getTitlesList(params: string) {
        let data_response = null as IGuaranteeOperationTilesResponse | null
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/title-handler/titles-list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              data_response = response.data
                .data as IGuaranteeOperationTilesResponse
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

        return data_response
      },
      _clearData() {
        this.guarantee_operation_list = []
        this.pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

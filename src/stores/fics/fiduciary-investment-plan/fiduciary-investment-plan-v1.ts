// Pinia - Axios
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import {
  IFicFiduciaryInvestmentPlansCanceledPlansItemsList,
  IIFicFiduciaryInvestmentPlansOpenPlansItemsList,
  IFiduciaryInvestmentPlanAdjustmentRequest,
  IFiduciaryInvestmentPlanAdjustmentDetail,
  IFiduciaryInvestmentPlansToggleStatus,
  IFiduciaryInvestmentPlansAccountForm,
  IFiduciaryInvestmentPlansAccountList,
  IFiduciaryInvestmentPlansForm,
  IFicConsultUnitsDataBasicForm,
  IFiduciaryInvestmentPlanItem,
  IFicCheckBalancesPlansList,
  IFicCheckBalancesView,
  IFicProfileOption,
  IFicProfile,
  IFiduciaryInvestmentPlansHolder,
  IFiduciaryInvestmentPlansEmail,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

export const useFiduciaryInvestmentPlanStoreV1 = defineStore(
  'fiduciary-investment-plan-store-v1',
  {
    state: () => ({
      fiduciary_investment_plan_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      fiduciary_investment_plan_list: [] as IFiduciaryInvestmentPlanItem[],
      banking_account_list: [] as IFiduciaryInvestmentPlansAccountList[],
      data_selection: [] as IFiduciaryInvestmentPlanItem[],
      data_toggle_status: null as IFiduciaryInvestmentPlansToggleStatus | null,
      data_form: null as IFiduciaryInvestmentPlansForm | null,
      fiduciary_investment_plan_response:
        null as IFiduciaryInvestmentPlansForm | null,
      fic_manager_profiles: [] as IFicProfileOption[],
      fic_advisor_profiles: [] as IFicProfileOption[],

      // consultar-saldos
      field_last_closing_date: null as string | null,
      check_balances_basic_data_form: null as IFicCheckBalancesView | null,
      check_balances_by_date_form: null as IFicCheckBalancesView | null,
      check_balances_control_table_by_date: [] as IFicCheckBalancesView[] | [],

      // NOTE: Reports
      canceled_fiduciary_investment_plans_list:
        [] as IFicFiduciaryInvestmentPlansCanceledPlansItemsList[],
      canceled_fiduciary_investment_plans_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      open_fiduciary_investment_plans_list:
        [] as IIFicFiduciaryInvestmentPlansOpenPlansItemsList[],
      open_fiduciary_investment_plans_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      check_balances_plan_list: [] as IFicCheckBalancesPlansList[] | [],
      check_balances_plan_list_pages: {
        currentPage: 0,
        lastPage: 0,
      },

      // consultar-unidades
      consult_units_basic_data_form:
        null as IFicConsultUnitsDataBasicForm | null,

      // validar si un fondo tiene tipos de operacion
      has_types_participation: false as boolean,

      // guardar data de tablas
      holder_tables: {
        holders: [] as IFiduciaryInvestmentPlansHolder[],
        selected_holder_id: null as number | null,
        emails: [] as IFiduciaryInvestmentPlansEmail[],
      },
    }),

    actions: {
      async _getFiduciaryInvestmentPlanList(
        params: Record<string, string | number>
      ) {
        this._clearData()
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/fiduciary-investment-plans`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.fiduciary_investment_plan_list = items.map(
              (item: IFiduciaryInvestmentPlanItem) => ({
                ...item,
              })
            )
            this.fiduciary_investment_plan_pages.currentPage = current_page
            this.fiduciary_investment_plan_pages.lastPage = last_page

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

      async _getBankingAccountList(params: string) {
        this._clearData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/fip-account-management?paginate=1&${params}`)
          .then((response) => {
            const {
              data: { data: items, current_page, last_page },
              message,
              success,
            } = response.data

            this.banking_account_list = items ?? []
            this.fiduciary_investment_plan_pages.currentPage = current_page
            this.fiduciary_investment_plan_pages.lastPage = last_page

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

      async _getByIdFiduciaryInvestmentPlan(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/fiduciary-investment-plans/${id}`)
          .then((response) => {
            const { data, message, success } = response.data

            if (success) {
              const normalizedData = {
                ...data,
                holder_identification:
                  data?.holder_identifications || data?.holder_identification,
              }

              this.fiduciary_investment_plan_response = normalizedData ?? null
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

      async _createFiduciaryInvestmentPlan(
        data_to_create: IFiduciaryInvestmentPlansForm
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH_FICS}/fiduciary-investment-plans`, data_to_create)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
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
        return isSuccess
      },

      async _createBankingAccount(
        data_to_create: IFiduciaryInvestmentPlansAccountForm
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH_FICS}/fip-account-management`, data_to_create)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
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
        return isSuccess
      },

      async _editFiduciaryInvestmentPlan(
        id: number,
        data_to_edit: IFiduciaryInvestmentPlansForm
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(
            `${URL_PATH_FICS}/fiduciary-investment-plans/${id}`,
            data_to_edit
          )
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
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
        return isSuccess
      },

      async _updateStatus(id: number) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(`${URL_PATH_FICS}/fip-account-management/${id}`)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
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
        return isSuccess
      },

      async _toggleStatusFiduciaryInvestmentPlan(
        id: number,
        data_to_edit: IFiduciaryInvestmentPlansToggleStatus
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(
            `${URL_PATH_FICS}/fiduciary-investment-plans/toggle-status/${id}`,
            data_to_edit
          )
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
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
        return isSuccess
      },

      async _exportExcel(ids: string) {
        let xlsFile = null

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/fip-account-management/export-accounts?ids[]=${ids}`,
            {
              responseType: 'arraybuffer',
            }
          )
          .then((response) => {
            xlsFile = response.data
            return showAlert(
              response.data.message ?? 'Exportación exitosa',
              response.status === 200 ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return xlsFile
      },

      _setDataSelection(data_to_set: IFiduciaryInvestmentPlanItem[] | null) {
        this.data_selection = data_to_set ? [...data_to_set] : []
      },

      _setDataToggleStatus(
        data_to_set: IFiduciaryInvestmentPlansToggleStatus | null
      ) {
        this.data_toggle_status = data_to_set ? { ...data_to_set } : null
      },

      _setDataForm(data_to_set: IFiduciaryInvestmentPlansForm | null) {
        this.data_form = data_to_set ? { ...data_to_set } : null
      },

      async _createInvestmentPlanAdjustment(
        data_to_create: IFiduciaryInvestmentPlanAdjustmentRequest
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(
            `${URL_PATH_FICS}/fiduciary-investment-plans/investment-plan-balance-adjustments`,
            data_to_create
          )
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
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
        return isSuccess
      },

      async _calculateAdjustment(data: {
        start_date: string
        end_date: string
        amount: number
        fund_id: number
      }) {
        let calculatedValue = 0

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(
            `${URL_PATH_FICS}/fiduciary-investment-plans/adjustment-calculation`,
            data
          )
          .then((response) => {
            const { success, data } = response.data

            if (success) {
              calculatedValue = data || 0
            }
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return calculatedValue
      },

      async _getAdjustmentDetail(
        id: number
      ): Promise<IFiduciaryInvestmentPlanAdjustmentDetail | null> {
        let adjustmentDetail: IFiduciaryInvestmentPlanAdjustmentDetail | null =
          null

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/fiduciary-investment-plans/adjustment-detail/${id}`
          )
          .then((response) => {
            const { success, data } = response.data

            if (success) {
              adjustmentDetail = data || null
            }
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return adjustmentDetail
      },

      async _loadFicProfilesByFund(fundId: string | number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        if (!fundId) {
          this.fic_manager_profiles = []
          this.fic_advisor_profiles = []
          return
        }

        try {
          const [managersResponse, advisorsResponse] = await Promise.all([
            executeApi().get(
              `${URL_PATH_FICS}/select-tables?filter[fund_id]=${fundId}&keys[]=fic_profiles&filter[type_user]=1`
            ),
            executeApi().get(
              `${URL_PATH_FICS}/select-tables?filter[fund_id]=${fundId}&keys[]=fic_profiles&filter[type_user]=2`
            ),
          ])
          const { data: dataManager } = managersResponse.data
          const { data: dataAdvisors } = advisorsResponse.data

          if (dataManager?.fic_profiles) {
            this.fic_manager_profiles = dataManager.fic_profiles.map(
              (item: IFicProfile): IFicProfileOption => ({
                value: item.id ?? '',
                label: `${item.users?.[0]?.name ?? ''}  ${
                  item.users?.[0]?.last_name ?? ''
                }`,
                type_user: item.type_user,
                profile_id: item.id,
                user_id: item.users?.[0]?.id,
              })
            )
          } else {
            this.fic_manager_profiles = []
          }

          if (dataAdvisors?.fic_profiles) {
            this.fic_advisor_profiles = dataAdvisors.fic_profiles.map(
              (item: IFicProfile): IFicProfileOption => ({
                value: item.id ?? '',
                label: `${item.users?.[0]?.name ?? ''}  ${
                  item.users?.[0]?.last_name ?? ''
                }`,
                type_user: item.type_user,
                profile_id: item.id,
                user_id: item.users?.[0]?.id,
              })
            )
          } else {
            this.fic_advisor_profiles = []
          }
        } catch (e) {
          this.fic_manager_profiles = []
          this.fic_advisor_profiles = []

          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        }
      },

      // consultar-saldos-basicos
      async _getByIdCheckBalancesBasicData(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/detail-plan-balance-returns/${id}`)
          .then((response) => {
            const { data, success, message } = response.data

            if (success) {
              this.check_balances_basic_data_form = data ?? []
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
      async _getByIdCheckBalancesByDate(id: number, params: string) {
        this._clearData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/detail-plan-balance-returns/detail/${id}?${params}`
          )
          .then((response) => {
            const { data, success, message } = response.data

            if (success) {
              this.check_balances_by_date_form = data ?? []
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
      async _getByIdCheckBalancesControlTableByDate(
        id: number,
        params: string
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/detail-plan-balance-returns/detail-with-control/${id}?${params}&paginate=1`
          )
          .then((response) => {
            const { data, success, message } = response.data

            if (success) {
              this.check_balances_control_table_by_date = Array.isArray(data)
                ? data
                : data?.data ?? []
            }
            showAlert(
              message,
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
      /* ...// */
      async _exportExcelCheckBalancesView(
        controlOfContributions: boolean,
        id: number,
        params: string
      ) {
        const { showAlert } = useAlert()
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        const apiCall = controlOfContributions
          ? executeApi().get(
              `${URL_PATH_FICS}/detail-plan-balance-returns/balance-online-contribution-control-export?plan_id=${id}&${params}`,
              { responseType: 'blob' }
            )
          : executeApi().post(
              `${URL_PATH_FICS}/detail-plan-balance-returns/export-balance?id=${id}&${params}`,
              null,
              { responseType: 'blob' }
            )

        await apiCall
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = getNameBlob(response)

            downloadBlobXlxx(blob, fileName)
            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch(() => {
            showAlert(
              'Error al descargar el archivo',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },
      /* ...// */
      async _listCanceledFiduciaryInvestmentPlans(
        params: Record<string, string | number>
      ) {
        this._clearData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(
            `${URL_PATH_FICS}/detail-plan-balance-returns/plans-cancellations`,
            {
              params: { ...params, paginate: true },
            }
          )
          .then((response) => {
            const {
              data: { data: items, current_page, last_page },
              message,
              success,
            } = response.data

            this.canceled_fiduciary_investment_plans_list = items ?? []
            this.canceled_fiduciary_investment_plans_pages.currentPage =
              current_page ?? 0
            this.canceled_fiduciary_investment_plans_pages.lastPage =
              last_page ?? 0

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _exportCanceledFiduciaryInvestmentPlans(
        params: Record<string, string | number>
      ) {
        const { showAlert } = useAlert()
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/detail-plan-balance-returns/cancellation-investment-plan-export`,
            {
              params: { ...params },
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
          .catch(() => {
            showAlert(
              'Error al descargar el archivo',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _listOpenFiduciaryInvestmentPlans(
        params: Record<string, string | number>
      ) {
        this._clearData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(`${URL_PATH_FICS}/detail-plan-balance-returns/plans-openings`, {
            params: { ...params, paginate: true },
          })
          .then((response) => {
            const {
              data: { data: items, current_page, last_page },
              message,
              success,
            } = response.data

            this.open_fiduciary_investment_plans_list = items ?? []
            this.open_fiduciary_investment_plans_pages.currentPage =
              current_page ?? 0
            this.open_fiduciary_investment_plans_pages.lastPage = last_page ?? 0

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _exportOpenFiduciaryInvestmentPlans(
        params: Record<string, string | number>
      ) {
        const { showAlert } = useAlert()
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/detail-plan-balance-returns/plans-openings-export`,
            { params: { ...params }, responseType: 'blob' }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = getNameBlob(response)
            downloadBlobXlxx(blob, fileName)
          })
          .catch(() => {
            showAlert(
              'Error al descargar el archivo',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      // consultar-unidades
      async _getByIdConsultUnitsBasicData(id: number) {
        let responseData: IFicConsultUnitsDataBasicForm | null = null

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/detail-plan-balance-returns/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              responseData = data
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
        return responseData
      },

      async _getByIdConsultUnitsTable(id: number, filters: string) {
        let responseData: IFicConsultUnitsDataBasicForm | null = null

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/detail-plan-balance-returns/plan-balance-units/${id}?${filters}`
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              responseData = data
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
        return responseData
      },

      async _dowlanloadReport(id: number, params: string) {
        const { showAlert } = useAlert()
        const { getNameBlob, downloadBlobXlxx, fileNameValidate } = useUtils()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/detail-plan-balance-returns/plan-balance-units-export/${id}?${params}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = getNameBlob(response)
            const fileNameValid = fileNameValidate(
              fileName,
              'Detalle_consulta_unidades'
            )

            downloadBlobXlxx(blob, fileNameValid)
            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch(() => {
            showAlert(
              'Error al descargar el archivo',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      // plans
      async _getByIdCheckBalancesPlan(id: number, params: string) {
        this._clearData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/detail-plan-balance-returns/plan-movements/${id}?paginate=1${params}`
          )
          .then((response) => {
            const {
              data: { data: items, current_page, last_page },
              message,
              success,
            } = response.data

            this.check_balances_plan_list = [...items].sort(
              (a, b) =>
                new Date(b.movement_date).getTime() -
                new Date(a.movement_date).getTime()
            )

            this.check_balances_plan_list_pages.currentPage = current_page ?? 0
            this.check_balances_plan_list_pages.lastPage = last_page ?? 0

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
      async _exportExcelCheckBalancesPlan(id: number, params: string) {
        const { showAlert } = useAlert()
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/detail-plan-balance-returns/plan-movements-export/${id}?${params}`,
            { responseType: 'blob' }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = getNameBlob(response)

            downloadBlobXlxx(blob, fileName)
            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch(() => {
            showAlert(
              'Error al descargar el archivo',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _showBusinessTrustsByHolder(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(
            `${URL_PATH_FICS}/fiduciary-investment-plans/business-trusts-by-holder/${id}`
          )
          .then((response) => {
            const { data, message, success } = response.data

            if (success) return data

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
            return null
          })
      },

      _clearData() {
        this.fiduciary_investment_plan_list = []
        this.banking_account_list = []
        this.data_selection = []
        this.data_toggle_status = null
        this.fiduciary_investment_plan_response = null
        this.data_form = null
        this.fic_manager_profiles = []
        this.fic_advisor_profiles = []
        this.fiduciary_investment_plan_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.canceled_fiduciary_investment_plans_list = []
        this.canceled_fiduciary_investment_plans_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.open_fiduciary_investment_plans_list = []
        this.open_fiduciary_investment_plans_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.consult_units_basic_data_form = null
        this.canceled_fiduciary_investment_plans_list = []
        this.canceled_fiduciary_investment_plans_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.open_fiduciary_investment_plans_list = []
        this.open_fiduciary_investment_plans_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.check_balances_by_date_form = null
      },

      // Estado de tabla titulares y emails
      setHolders(holders: IFiduciaryInvestmentPlansHolder[]) {
        this.holder_tables.holders = holders
      },

      setSelectedHolder(id: number | null) {
        this.holder_tables.selected_holder_id = id
      },

      setEmails(emails: IFiduciaryInvestmentPlansEmail[]) {
        this.holder_tables.emails = emails
      },

      clearHolderTables() {
        this.holder_tables = {
          holders: [],
          selected_holder_id: null,
          emails: [],
        }
      },
      clearForm() {
        this.data_form = null
        this.clearHolderTables()
      },
    },
  }
)

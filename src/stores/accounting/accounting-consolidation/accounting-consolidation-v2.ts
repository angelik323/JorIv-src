// Pinia
import { defineStore } from 'pinia'

//Composables - Utils
import { useShowError } from '@/composables/useShowError'
import { useUtils } from '@/composables/useUtils'
import { useAlert } from '@/composables/useAlert'
//Apis
import { executeApi } from '@/apis'

//Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

//Interfaces
import {
  IAccountingListItem,
  IAccountingConsolidationForm,
  IAccountingBusinessConsolidatingItem,
  IAccountingConsolidationAccountingItem,
  IAccountingConsolidationBasicData,
  IAccountingConsolidationListProcess,
  IAccountingConsolidationBusinessData,
} from '@/interfaces/customs/accounting/AccountingConsolidationV2'

//Auxiliary functions
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingConsolidationV2 = defineStore(
  'accounting-consolidation-store-v2',
  {
    state: () => ({
      headerProps: {
        title: 'Consolidación de contabilidades',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Contabilidad',
            route: '',
          },
          {
            label: 'Consolidación de contabilidades',
            route: 'AccountingConsolidationListV2',
          },
        ],
        btn: {
          label: 'Procesar',
          icon: useUtils().defaultIconsLucide.plusCircleOutline,
        },
      },
      consolidation_list: [] as IAccountingListItem[],
      process_consolidation_list: [] as IAccountingBusinessConsolidatingItem[],
      view_updates_consolidation:
        [] as IAccountingConsolidationAccountingItem[],
      pages: {
        currentPage: 0,
        lastPage: 0,
      },
      consolidation_id_reference: null as number | string | null,
      business_list: [] as IAccountingConsolidationListProcess[],
      consolidation_response: {} as IAccountingConsolidationBasicData | null,
      business_list_consolidate: [] as IAccountingConsolidationBusinessData[],
    }),
    actions: {
      async _getAccountingConsolidationList(
        params: Record<string, string | number>
      ) {
        this.consolidation_list = []
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/consolidation-accounting/list?paginate=1`,
            {
              params: { ...params, paginate: 1 },
            }
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.consolidation_list =
                (response.data?.data?.data as IAccountingListItem[]) ?? []
              this.pages.currentPage = data?.data?.current_page ?? 1
              this.pages.lastPage = data?.data?.last_page ?? 1
            }
            return showAlert(
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
      async _getProcessConsolidation(params: number | string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/consolidation-accounting/show/${params}`
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.consolidation_response =
                (data as IAccountingConsolidationBasicData) ?? null
            }
            return showAlert(
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
      async _getDetailConsolidation(params: number | string) {
        return await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/consolidation-accounting/show-consolidation-detail/${params}`
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.consolidation_response = data ?? {}
              return {
                data,
                message,
                success,
              }
            }
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _getBusinessAccounting(
        params: Record<string, string | number | boolean>
      ) {
        let respSuccess = false
        const queryString =
          typeof params === 'object'
            ? new URLSearchParams(
                Object.fromEntries(
                  Object.entries(params).map(([key, value]) => [
                    key,
                    String(value),
                  ])
                )
              ).toString()
            : params
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/consolidation-accounting/get-business?paginate=1&${queryString}`
          )
          .then((response) => {
            const { data, message, success } = response.data
            respSuccess = success
            if (success) {
              this.business_list = data?.result?.data ?? []
            }
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return respSuccess
      },
      async _getUpdateInfo(params: number | string) {
        this.consolidation_response = {}
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/consolidation-accounting/show-novelty/${params}`
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.consolidation_response = data ?? {}
            }
            return showAlert(
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
      async _getDownloadFile(params: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/consolidation-accounting/export/${params}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const { data, message } = response.data
            const blob = new Blob([data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)
            if (response.status === 200) {
              return showAlert(
                message || 'Archivo descargado con éxito',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _getDownloadDetailsFile(idConsolidate: number | string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/consolidation-accounting/export-novelty/${idConsolidate}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)
            if (response.status === 200) {
              return showAlert(
                response.data.message || 'Archivo descargado con éxito',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _processAccountingConsolidation(
        payload: IAccountingConsolidationForm
      ) {
        let flag = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/consolidation-accounting/process`,
            payload
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              flag = success
              this.business_list = data?.list_parent_consolidator_business ?? []
              this.business_list_consolidate =
                data?.list_child_consolidated_business ?? []
            }
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return flag
      },
      async _getFilterBusinessConsolidation(
        consolidationId: number | string | null,
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/consolidation-accounting/show-consolidation/${consolidationId}?`,
            {
              params: { ...params },
            }
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.business_list = data?.data ?? []
            }
            return showAlert(
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
    },
  }
)

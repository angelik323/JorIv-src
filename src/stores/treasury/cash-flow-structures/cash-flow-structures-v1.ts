import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { ICashFlowStructures } from '@/interfaces/customs'
import { defaultIconsLucide } from '@/utils'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH_CASH_FLOW_STRUCTURE = `${URL_PATH_TREASURIES}/cash-flow-structures`
const TIMEOUT_ALERT = 3000

export const useCashFlowStructuresV1 = defineStore('cash-flow-structures-v1', {
  state: () => ({
    data_cash_flow_list: [] as ICashFlowStructures[],
    data_basic_cash_flow_structure: null as ICashFlowStructures | null,
    cash_flow_structures_request: null as ICashFlowStructures | null,
    headerPropsDefault: {
      title: 'Estructuras de flujo de caja',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Tesorería',
        },
        {
          label: 'Estructuras flujo caja',
          route: 'CashFlowStructuresList',
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
    async _getListCashFlowStructures(params: string, pages: number = 20) {
      await executeApi()
        .get(
          `${URL_PATH_CASH_FLOW_STRUCTURE}?paginate=1&rows=${pages}${params}`
        )
        .then((response) => {
          if (response.data.success && response.status === 200) {
            this.data_cash_flow_list = response.data?.data.data ?? []
            this.pages.currentPage = response.data?.data?.current_page ?? 1
            this.pages.lastPage = response.data?.data?.last_page ?? 1
          }

          if (response.data.success && response.status === 206) {
            this.data_cash_flow_list = []
            this.pages.currentPage = 1
            this.pages.lastPage = 1
            showAlert(response.data.message, 'info', undefined, TIMEOUT_ALERT)
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
    async _createAction(payload: ICashFlowStructures): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_CASH_FLOW_STRUCTURE}`, payload)
        .then((response) => {
          success = response.data.success

          if (response.data.success) {
            this.data_basic_cash_flow_structure = null
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
      idCashFlowStructure: string,
      payload: ICashFlowStructures
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_CASH_FLOW_STRUCTURE}/${idCashFlowStructure}`, payload)
        .then((response) => {
          success = response.data.success

          if (response.data.success) {
            this.data_basic_cash_flow_structure = null
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
    async _deleteAction(idCashFlowStructure: string | number) {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_CASH_FLOW_STRUCTURE}/${idCashFlowStructure}`)
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
    async _setDataBasicCashFlowStructures(data: ICashFlowStructures | null) {
      this.data_basic_cash_flow_structure = data
    },
    async _getByIdAction(id: string) {
      this.data_basic_cash_flow_structure = null
      await executeApi()
        .get(`${URL_PATH_CASH_FLOW_STRUCTURE}/${id}`)
        .then((response) => {
          if (response.data.success) {
            const data = response.data?.data ?? null
            if (data)
              this.data_basic_cash_flow_structure = {
                ...data,
                account_code: data.structure_code,
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
    },
  },
})

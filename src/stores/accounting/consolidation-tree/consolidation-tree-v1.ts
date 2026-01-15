import { executeApi } from '@/apis'
import {
  IConsolidationTree,
  IConsolidationTreeChild,
  IRequestCreateConsolidationTree,
  IRequestUpdateConsolidationTree,
} from '@/interfaces/customs/accounting/ConsolidationTree'
import { useAlert, useShowError, useUtils } from '@/composables'
import { defineStore } from 'pinia'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const URL_PATH_CONSOLIDATION_TREE = `${URL_PATH_ACCOUNTING}/consolidation-tree`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { defaultIconsLucide } = useUtils()

export const useConsolidationTreeV1 = defineStore('consolidation-tree-v1', {
  state: () => ({
    data_consolidation_tree_list: [] as IConsolidationTree[],
    data_basic_consolidation_tree: null as IConsolidationTree | null,
    consolidation_tree_request_update:
      null as IRequestUpdateConsolidationTree | null,
    consolidation_tree_request_create:
      null as IRequestCreateConsolidationTree | null,
    consolidation_tree_childrens: [] as IConsolidationTreeChild[],
    headerPropsDefault: {
      title: 'Árbol de consolidación',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Contabilidad',
        },
        {
          label: 'Árbol de consolidación',
          route: 'ConsolidationTreeList',
        },
      ],
      btn: {
        label: 'Crear',
        icon: defaultIconsLucide.plusCircleOutline,
      },
    },
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  }),
  actions: {
    async _getListConsolidationTree(params: string) {
      await executeApi()
        .get(`${URL_PATH_CONSOLIDATION_TREE}/business-list?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.data_consolidation_tree_list = response.data?.data?.data ?? []
            this.pages.currentPage = response.data?.data?.current_page ?? 1
            this.pages.lastPage = response.data?.data?.last_page ?? 1
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
    async _setConsolidationTreeRequestCreate(
      data: IRequestCreateConsolidationTree | null
    ) {
      this.consolidation_tree_request_create = data
    },
    async _createAction(
      payload: IRequestCreateConsolidationTree
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_CONSOLIDATION_TREE}/create-tree`, payload)
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
    async _setDataBasicConsolidationTree(data: IConsolidationTree | null) {
      this.data_basic_consolidation_tree = data
    },
    async _getBusinessByID(id: number) {
      let success = false
      await executeApi()
        .get(`${URL_PATH_CONSOLIDATION_TREE}/get-tree/${id}`)
        .then((response) => {
          success = response.data.success
          this.data_basic_consolidation_tree = response.data.data ?? null
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
    async _getBusinessByCode(code: string) {
      let businessByCode = null
      await executeApi()
        .get(
          `${URL_PATH_CONSOLIDATION_TREE}/get-busines-by-code?business_code=${code}`
        )
        .then((response) => {
          businessByCode = response.data.data ?? null
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

      return businessByCode
    },
    async _toggleAccountStructureStatus(
      id: number,
      status_id: number
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_CONSOLIDATION_TREE}/chage-status`, {
          parent_id: id,
          status_id: status_id,
        })
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
    async _setConsolidationTreeRequestUpdate(
      data: IRequestUpdateConsolidationTree | null
    ) {
      this.consolidation_tree_request_update = data
    },
    async _updateAction(
      payload: IRequestUpdateConsolidationTree
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_CONSOLIDATION_TREE}/update-tree`, payload)
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

    _setConsolidationTreeChildrens(
      consolidation_tree_childrens: IConsolidationTreeChild[]
    ) {
      this.consolidation_tree_childrens = consolidation_tree_childrens
    },
  },
})

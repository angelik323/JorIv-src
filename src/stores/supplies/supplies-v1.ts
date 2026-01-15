import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

// Utils
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

// Interfaces
import { ISupplies, ISuppliesRequest } from '@/interfaces/global'
import {
  IDataTable,
  ILinkedAssetsTable,
  ISuppliesForm,
} from '@/interfaces/customs'

// Constants
const URL_PATH_SUPPLIES = '/supplies'
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useSuppliesV1 = defineStore('supplies-v1', {
  state: () => ({
    version: 'v1',
    supplies_route_export_excel: [] as ISupplies[],
    supplies_list: [] as ISupplies[],
    supplies_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    headerPropsDefault: {
      title: 'Insumos',
      breadcrumbs: [
        {
          label: 'Activos fijos',
        },
        {
          label: 'Insumos',
          route: 'SuppliesList',
        },
      ],
    },
    supplies_request: null as ISuppliesRequest | null,
    data_basic_supplies: null as ISuppliesForm | null,
    data_table_linked_assets: [] as ILinkedAssetsTable[] | [],
  }),
  actions: {
    async _exportXLS(url: string) {
      const nameFile = 'Listado_de_insumos'

      await executeApi()
        .get(`${URL_PATH_SUPPLIES}/export/info?${url}`, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          createAndDownloadBlobByArrayBuffer(response.data, nameFile)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _exportLinkedAssetsXLS(id: string | number) {
      const nameFile = 'Listado_de_activos_vinculados'

      await executeApi()
        .get(`${URL_PATH_SUPPLIES}/${id}/assets/export`, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          createAndDownloadBlobByArrayBuffer(response.data, nameFile)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getSupplies(params: string) {
      this.supplies_list = []
      await executeApi()
        .get(`${URL_PATH_SUPPLIES}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.supplies_list = response.data?.data?.data ?? []
            this.supplies_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.supplies_pages.lastPage = response.data?.data?.last_page ?? 0
            this.supplies_route_export_excel =
              response?.data?.data?.route_export ?? null
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

    async _createAction(payload: object): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_SUPPLIES}`, payload)
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

    async _getByIdAction(id: string) {
      this.supplies_request = null
      await executeApi()
        .get(`${URL_PATH_SUPPLIES}/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.supplies_request = response.data?.data ?? null
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

    async _updateAction(payload: {
      id: string | null
      code: string | null
      name: string | null
      measurement_unit: string | null
      description: string | null
      assets: {
        asset_id: string | null
        association_date: string | null
        quantity: string | null
      }[]
    }): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_SUPPLIES}/${payload.id}`, payload)
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

    async _changeStatus(id: number) {
      await executeApi()
        .put(`${URL_PATH_SUPPLIES}/${id}/toggle-status`)
        .then((response) => {
          this._getSupplies('')
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

    async _setDataBasicSupplies(data: ISuppliesForm | null) {
      this.data_basic_supplies = data
    },
    async _setDataLinkedAssets(data: IDataTable<ILinkedAssetsTable> | null) {
      this.data_table_linked_assets = data?.data ?? []
    },
    async _clearSuppliesList() {
      this.supplies_list = []
      this.supplies_pages.currentPage = 0
      this.supplies_pages.lastPage = 0
    },
    async _clearRequestSupplies() {
      this.supplies_request = null
    },
  },
})

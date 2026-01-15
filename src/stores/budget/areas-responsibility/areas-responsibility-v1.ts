import { defineStore } from 'pinia'

// Interfaces
import {
  IAreasResponsibilityBasicDataForm,
  IAreasResponsibilityBasicDataResponse,
} from '@/interfaces/customs/budget/AreasResponsibility'

// Composables - Utils
import { useAlert, useShowError, useUtils } from '@/composables'

// Apis
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'

// Alerts
const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { defaultIconsLucide, downloadBlobXlxx, formatDate } = useUtils()

export const useBudgetAreasResponsibilityStoreV1 = defineStore(
  'budget-areas-responsibility-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Áreas de responsabilidad',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Presupuesto',
          },
          {
            label: 'Áreas de responsabilidad',
            route: 'BudgetAreasResponsibilityList',
          },
        ],
        btn: {
          label: 'Crear ',
          icon: defaultIconsLucide.plusCircleOutline,
        },
      },
      data_areas_responsibility_list:
        [] as IAreasResponsibilityBasicDataResponse[],
      data_areas_responsibility_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_areas_responsibility_form:
        null as IAreasResponsibilityBasicDataForm | null,
      data_areas_responsibility_request:
        null as IAreasResponsibilityBasicDataResponse | null,
      error_areas_responsibility_form: null as string | null,
    }),
    actions: {
      _setDataAreasResponsibilityForm(
        data_to_set: IAreasResponsibilityBasicDataForm | null
      ) {
        this.data_areas_responsibility_form = data_to_set
          ? { ...data_to_set }
          : {}
      },

      _cleanAreasResponsibilityData() {
        this.data_areas_responsibility_list = []
        this.data_areas_responsibility_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },

      _getAreaResponsibilityById(id: number) {
        return (
          this.data_areas_responsibility_list.find((item) => item.id === id) ||
          null
        )
      },

      _setDataAreasResponsibilityRequestById(id: number) {
        const found = this._getAreaResponsibilityById(id)
        this.data_areas_responsibility_request = found ? { ...found } : null
      },

      async _getListAction(filters: string) {
        this.data_areas_responsibility_list = []
        await executeApi()
          .get(`${URL_PATH_BUDGET}/areas-responsibilities?paginate=1${filters}`)
          .then((response) => {
            if (response.data.success) {
              this.data_areas_responsibility_list =
                response.data?.data.data ?? []
              this.data_areas_responsibility_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            } else {
              this._cleanAreasResponsibilityData()
            }
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            this._cleanAreasResponsibilityData()
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createAreasResponsibility(
        data: IAreasResponsibilityBasicDataForm
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_BUDGET}/areas-responsibilities`, data)
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
            const message = error.response?.data?.message
            this.error_areas_responsibility_form = message
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _getByIdAreasResponsibility(
        id: number | undefined
      ): Promise<IAreasResponsibilityBasicDataResponse | null> {
        let responseData = null
        await executeApi()
          .get(`${URL_PATH_BUDGET}/areas-responsibilities/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res: IAreasResponsibilityBasicDataResponse =
                response.data?.data
              if (res) {
                responseData = { ...res }
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
        return responseData
      },

      async _updateAreasResponsibility(
        id: number,
        data: Partial<IAreasResponsibilityBasicDataForm>
      ) {
        let success = false
        await executeApi()
          .put(`${URL_PATH_BUDGET}/areas-responsibilities/${id}`, data)
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
            const message = error.response?.data?.message
            this.error_areas_responsibility_form = message
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _deleteAreasResponsibility(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH_BUDGET}/areas-responsibilities/${id}`)
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

      async _downloadAreasResponsibility(
        params: Record<string, string | number>
      ) {
        await executeApi()
          .post(`${URL_PATH_BUDGET}/areas-responsibilities/export`, params, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            downloadBlobXlxx(
              blob,
              `Listado_areas_de_responsabilidad_${formatDate('', 'YYYY-MM-DD')}`
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)

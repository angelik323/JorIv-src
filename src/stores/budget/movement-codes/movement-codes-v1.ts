import { defineStore } from 'pinia'

// Interfaces
import {
  IMovementCodesBasicDataForm,
  IMovementCodesBasicDataResponse,
  IMovementCodesDestinationResponse,
} from '@/interfaces/customs/budget/MovementCodes'

// Composables - Utils
import { useAlert, useShowError, useUtils } from '@/composables'

// Apis
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'

// Alets
const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBudgetMovementCodesStoreV1 = defineStore(
  'budget-movement-codes-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Códigos de movimiento',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Presupuesto',
          },
          {
            label: 'Configuración',
          },
          {
            label: 'Códigos de movimiento',
            route: 'BudgetMovementCodesList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: useUtils().defaultIconsLucide.plusCircleOutline,
        },
      },
      data_movement_codes_list: [] as IMovementCodesBasicDataResponse[],
      data_movement_codes_destination_list:
        [] as IMovementCodesDestinationResponse[],
      data_movement_codes_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_movement_codes_destination_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_movement_codes_form: null as IMovementCodesBasicDataResponse | null,
      data_destination_form: null as IMovementCodesDestinationResponse | null,
      data_movement_codes_request:
        null as IMovementCodesBasicDataResponse | null,
      data_destination_request:
        null as IMovementCodesDestinationResponse | null,
      error_movement_codes_form: null as string | null,
      error_destination_form: null as string | null,
    }),

    actions: {
      _setDataMovementCodesForm(
        data_to_set: IMovementCodesBasicDataResponse | null
      ) {
        this.data_movement_codes_form = data_to_set ? { ...data_to_set } : {}
      },

      _setDataDestinationForm(
        data_to_set: IMovementCodesDestinationResponse | null
      ) {
        this.data_destination_form = data_to_set ? { ...data_to_set } : {}
      },

      _cleanMovementCodesData() {
        this.data_movement_codes_list = []
        this.data_movement_codes_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },

      _cleanDestinationData() {
        this.data_movement_codes_destination_list = []
        this.data_movement_codes_destination_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },

      async _getListAction(filters: string) {
        this.data_movement_codes_destination_list = []
        await executeApi()
          .get(`${URL_PATH_BUDGET}/code-movements?paginate=1${filters}`)
          .then((response) => {
            if (response.data.success) {
              this.data_movement_codes_list = response.data?.data?.data ?? []
              this.data_movement_codes_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }
            } else {
              this._cleanMovementCodesData()
            }
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            this._cleanMovementCodesData()
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getListActionDestination(filters: string) {
        this.data_movement_codes_destination_list = []
        await executeApi()
          .get(
            `${URL_PATH_BUDGET}/code-movements-source-destination?paginate=1${filters}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_movement_codes_destination_list =
                response.data?.data?.data ?? []
              this.data_movement_codes_destination_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }
            } else {
              this._cleanDestinationData()
            }
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            this._cleanDestinationData()
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createMovementCodes(data: IMovementCodesBasicDataForm) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_BUDGET}/code-movements`, data)
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
            this.error_movement_codes_form = message
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _createDestination(data: IMovementCodesDestinationResponse) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_BUDGET}/code-movements-source-destination`, data)
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
            this.error_movement_codes_form = message
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _getByIdMovementCodes(id: number | undefined) {
        await executeApi()
          .get(`${URL_PATH_BUDGET}/code-movements/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res: IMovementCodesBasicDataResponse = response.data?.data
              if (res) {
                this.data_movement_codes_request = { ...res }
              }
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getByIdDestination(id: number | undefined) {
        await executeApi()
          .get(`${URL_PATH_BUDGET}/code-movements-source-destination/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res: IMovementCodesDestinationResponse = response.data?.data
              if (res) {
                this.data_destination_request = { ...res }
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

      async _updateMovementCodes(
        id: number,
        data: Partial<IMovementCodesBasicDataForm>
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .put(`${URL_PATH_BUDGET}/code-movements/${id}`, data)
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
            this.error_movement_codes_form = message
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _updateDestination(
        id: number,
        data: Partial<IMovementCodesDestinationResponse>
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_BUDGET}/code-movements-source-destination/${id}`,
            data
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
            const message = error.response?.data?.message
            this.error_destination_form = message
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _setMovementCodesRequest(
        data: IMovementCodesBasicDataResponse | null
      ) {
        this.data_movement_codes_request = data ? { ...data } : null
      },

      async _downloadMovementCodes(params: string) {
        await executeApi()
          .post(
            `${URL_PATH_BUDGET}/code-movements/export${params}`,
            {},
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = `Listado_codigos_de_movimiento_${useUtils().getCurrentDateFormatted()}.xlsx`
            useUtils().downloadBlobXlxx(blob, fileName)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadDestination(params: string) {
        await executeApi()
          .post(
            `${URL_PATH_BUDGET}/code-movements-source-destination/export${params}`,
            {},
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
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _deleteMovementCodes(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH_BUDGET}/code-movements/${id}`)
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

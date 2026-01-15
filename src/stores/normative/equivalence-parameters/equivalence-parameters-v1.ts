import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IEquivalenceParameterListItem,
  IEquivalenceParameterResponse,
  IConceptDetailResponse,
  IConceptDetailOptions,
  IEquivalenceParameterToCreate,
  IEquivalenceParameterToEdit,
} from '@/interfaces/customs/normative/EquivalenceParameters'
import { IGenericResource } from '@/interfaces/customs/resources/Common'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useUtils, useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_NORMATIVE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_NORMATIVE}/equivalence-parameters`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useEquivalenceParametersStoreV1 = defineStore(
  'equivalence-parameters-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Parámetros equivalencias transmisiones',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Normativo',
          },
          {
            label: 'Parámetros equivalencias transmisiones',
            route: 'EquivalenceParametersList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: useUtils().defaultIconsLucide.plusCircleOutline,
        },
      },
      equivalence_parameter_list: [] as IEquivalenceParameterListItem[],
      equivalence_parameter_response:
        null as IEquivalenceParameterResponse | null,
      equivalence_parameter_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      conceptDetailOptions: [] as IConceptDetailOptions[],
      equivalenceOptions: [] as IGenericResource[],
    }),

    actions: {
      async _getListAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.equivalence_parameter_list =
              items as IEquivalenceParameterListItem[]
            this.equivalence_parameter_pages.currentPage = current_page
            this.equivalence_parameter_pages.lastPage = last_page

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

      async _getByParameterId(
        parameterId: number,
        params?: Record<string, string | number>
      ) {
        await executeApi()
          .get(`${URL_PATH}/show/${parameterId}`, {
            params: { ...params },
          })
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.equivalence_parameter_response = { ...responseData }
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

      async _getConceptDetail(
        conceptId: number,
        params?: Record<string, string | number>
      ) {
        this.conceptDetailOptions = []
        this.equivalenceOptions = []

        await executeApi()
          .get(`${URL_PATH}/detail-concept/${conceptId}`, {
            params: { ...params },
          })
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              const conceptDetailResponse =
                responseData as IConceptDetailResponse

              this.conceptDetailOptions =
                conceptDetailResponse?.concept_details?.map((item) => ({
                  ...item,
                  value: item.id ?? 0,
                  label: item.name ?? '',
                })) ?? []

              this.equivalenceOptions =
                conceptDetailResponse?.equivalence_details?.map((item) => ({
                  ...item,
                  name: item.value,
                  value: item.id ?? 0,
                  label: [item.key, item.value].filter(Boolean).join(' - '),
                })) ?? []
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

      async _createEquivalenceParameter(
        data: Partial<IEquivalenceParameterToCreate>
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/store`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

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

        return success
      },

      async _updateEquivalenceParameter(
        data: Partial<IEquivalenceParameterToEdit>,
        parameterId: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/${parameterId}`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

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

        return success
      },

      _clearConceptDetailOptions() {
        this.conceptDetailOptions = []
        this.equivalenceOptions = []
      },

      _clearData() {
        this.equivalence_parameter_list = []
        this.equivalence_parameter_response = null
        this.equivalence_parameter_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

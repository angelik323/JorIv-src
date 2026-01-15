// store
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_TREASURIES } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const URL_PATH = `${URL_PATH_TREASURIES}/dispersion-group-consultation`

export const useDispersionGroupStoreV1 = defineStore(
  'dispersion-group-store-v1',
  {
    state: () => ({
      version: 'v1',
      dispersion_group_list: [] as unknown[],
      dispersion_group_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      dispersion_group_details_list: [] as unknown[],
      dispersion_group_details_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as unknown | null,
      data_filters: {} as Record<string, unknown> | null,
    }),

    actions: {
      async _getListAction(params: string) {
        this._cleanDispersionGroupData()
        await executeApi()
          .get(`${URL_PATH}/list-dispersion-group?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.dispersion_group_list = response.data?.data?.data ?? []
              this.dispersion_group_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
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

      async _getByIdDispersionGroup(id: number, params: string) {
        await executeApi()
          .get(
            `${URL_PATH}/list-turns?paginate=1${params}&filter[id_group]=${id}`
          )
          .then((response) => {
            if (response.data.success) {
              this.dispersion_group_details_list =
                response.data?.data?.data ?? []
              this.dispersion_group_details_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
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

      _setDataInformationForm(data_to_set: unknown | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },
      async _downloadExcelDispersionGroup(filters: string) {
        await executeApi()
          .get(`${URL_PATH}/export?paginate=1&${filters}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch(async () => {
            showAlert(
              'Error al descargar el Excel',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },
      async _downloadExcelDispersionGroupTurns(filters: string) {
        await executeApi()
          .get(`${URL_PATH}/export-turns?paginate=1&${filters}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch(async () => {
            showAlert(
              'Error al descargar el Excel',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },
      _setDataFilters(filters: Record<string, unknown> | null) {
        this.data_filters = filters
      },
      _setGroupSelected(group: unknown | null) {
        this.data_information_form = group ? { ...group } : null
      },
      _cleanDispersionGroupData() {
        this.dispersion_group_list = []
        this.dispersion_group_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

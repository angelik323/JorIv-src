import { defineStore } from 'pinia'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IGenerateScatterGroupFileAuthorization,
  IGenerateScatterGroupFileCreate,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useGenerateScatterGroupFileStoreV1 = defineStore(
  'generate-scatter-group-file-store-v1',
  {
    state: () => ({
      generate_scatter_group_file_detail_list: [] as unknown[],
      generate_scatter_group_file_breakdown_list: [] as unknown[],
      generate_dispersion_group_file_list: [] as unknown[],
      generate_dispersion_list_detail: [],
      generate_pages_dispersion: {
        currentPage: 0,
        lastPage: 0,
      },
      data_filters: {} as Record<string, unknown> | null,
    }),
    actions: {
      async _getListAction(params: string) {
        this._cleanDispersionGroupData()
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/generate-dispersion-group-file/listGroups?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.generate_dispersion_group_file_list =
                response.data.data.data ?? []
              this.generate_pages_dispersion.currentPage =
                response.data?.data?.current_page ?? 0
              this.generate_pages_dispersion.lastPage =
                response.data?.data?.last_page ?? 0
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
      async _getDetailAction(id: string | number) {
        this.generate_dispersion_list_detail = []
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/generate-dispersion-group-file/listBreakdown?filter[group_id]=${id}&paginate=1&rows=25`
          )
          .then((response) => {
            if (response.data.success) {
              this.generate_dispersion_list_detail =
                response.data.data.data ?? []
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
      async _generateFile(
        payload: IGenerateScatterGroupFileCreate,
        format: 'csv' | 'xls' | 'xlsx' | 'txt' | 'prn' | 'gpg'
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/generate-dispersion-group-file/generateFile`,
            payload,
            { responseType: 'blob' }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            if (!blob.size) {
              showAlert(
                'El archivo está vacío',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              success = false
              return
            }

            success = true
            const utils = useUtils()
            const fileName = utils.getNameBlob(response)
            utils.downloadGenericFile(blob, fileName, format)

            showAlert(
              'Archivo generado exitosamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch(async (error) => {
            if (
              error?.response?.data instanceof Blob &&
              error.response.data.type.includes('application/json')
            ) {
              const text = await error.response.data.text()
              const json = JSON.parse(text)

              showAlert(
                json.message ?? 'Error al generar el archivo',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
            } else {
              showAlert(
                showCatchError(error),
                'error',
                undefined,
                TIMEOUT_ALERT
              )
            }

            success = false
          })

        return success
      },

      async _generateAuthorization(
        payload: IGenerateScatterGroupFileAuthorization
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/generate-dispersion-group-file/generateAuthorization`,
            payload
          )
          .then((response) => {
            if (response.data.success) {
              success = response.data.success
              showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
            return showAlert(
              response.data.message
                ? response.data.message
                : 'Solicitud de elimininación enviada',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      _setDataFilters(filters: Record<string, unknown> | null) {
        this.data_filters = filters
      },

      _cleanDispersionGroupData() {
        this.generate_dispersion_group_file_list = []
      },
    },
  }
)

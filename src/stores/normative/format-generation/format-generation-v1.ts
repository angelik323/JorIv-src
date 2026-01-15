import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IFormatGenerationListItem,
  IFormatGenerationToCreate,
} from '@/interfaces/customs/normative/FormatGeneration'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useUtils, useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_NORMATIVE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useFormatGenerationStoreV1 = defineStore(
  'format-generation-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Generación de formatos',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Normativo',
          },
          {
            label: 'Generación de formatos',
            route: 'FormatGenerationList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: useUtils().defaultIconsLucide.plusCircleOutline,
        },
      },
      format_generation_list: [] as IFormatGenerationListItem[],
      format_generation_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_to_create: '' as string,
    }),

    actions: {
      async _getListAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_NORMATIVE}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.format_generation_list = items as IFormatGenerationListItem[]
            this.format_generation_pages.currentPage = current_page
            this.format_generation_pages.lastPage = last_page

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

      async _createFormatGeneration(data: Partial<IFormatGenerationToCreate>) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_NORMATIVE}/profitability-report/generate`, data)
          .then((response) => {
            const { message, data } = response.data
            success = response.data?.success ?? false
            this.data_to_create = data

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

      async _downloadTxt(data: Partial<IFormatGenerationToCreate>) {
        await executeApi()
          .post(
            `${URL_PATH_NORMATIVE}/profitability-report/download/txt`,
            data,
            { responseType: 'blob' }
          )
          .then((response) => {
            const url = window.URL.createObjectURL(response.data)
            const link = document.createElement('a')
            link.href = url
            link.download = 'profitability-report.txt'
            link.click()
            window.URL.revokeObjectURL(url)
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadExcel(data: Partial<IFormatGenerationToCreate>) {
        await executeApi()
          .post(
            `${URL_PATH_NORMATIVE}/profitability-report/download/xlsx`,
            data,
            { responseType: 'blob' }
          )
          .then((response) => {
            const url = window.URL.createObjectURL(response.data)
            const link = document.createElement('a')
            link.href = url
            link.download = 'profitability-report.xlsx'
            link.click()
            window.URL.revokeObjectURL(url)
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.format_generation_list = []
        this.format_generation_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

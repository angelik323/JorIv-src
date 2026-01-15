import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IGenerationCertificateGroupListItem,
  IGenerationCertificateDetailListItem,
  IGenerationCertificateToCreate,
} from '@/interfaces/customs/normative/GenerationCertificate'
import { IErrors } from '@/interfaces/global'
import { IPaginated } from '@/interfaces/customs/IPages'

// Composables - Utils
import { useUtils, useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_NORMATIVE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_NORMATIVE}/certificate`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useGenerationCertificateStoreV1 = defineStore(
  'generation-certificate-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Generación certificados',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Normativo',
          },
          {
            label: 'Reportes',
          },
          {
            label: 'FICs Fondos de inversión colectiva',
          },
        ],
        btn: {
          label: 'Generar PDF',
          icon: useUtils().defaultIconsLucide.plusCircleOutline,
        },
      },
      url: '' as string,
      routerGroupList: '' as string,
    }),

    actions: {
      async _getListActionGroup(params: Record<string, string | number>) {
        let paginatorResponse: IPaginated<IGenerationCertificateGroupListItem> | null =
          null
        await executeApi()
          .get(`${URL_PATH}/group`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            if (response.data.success) {
              const {
                data: { data = [], current_page = 0, last_page = 0 },
              } = response.data

              paginatorResponse = {
                list: data,
                pages: {
                  currentPage: current_page || 1,
                  lastPage: last_page || 1,
                },
              }
            }
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return paginatorResponse
      },

      async _getListActionDetail(params: Record<string, string | number>) {
        let paginatorResponse: IPaginated<IGenerationCertificateDetailListItem> | null =
          null
        await executeApi()
          .get(`${URL_PATH}/generate`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            if (response.data.success) {
              const {
                data: { data = [], current_page = 0, last_page = 0 },
              } = response.data

              paginatorResponse = {
                list: data,
                pages: {
                  currentPage: current_page || 1,
                  lastPage: last_page || 1,
                },
              }
            }
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return paginatorResponse
      },

      async _createGenerationCertificate(
        type: string,
        data: Partial<IGenerationCertificateToCreate>
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/generate/${type}`, data)
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

      async _sendGroupCertificateEmail(id: number) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/group/sendMassive/${id}`)
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

      async _sendDetailCertificateEmail(id: number) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/generate/send/${id}`)
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

      _setUrl(url: string) {
        this.url = url
      },

      _setRouterList(routerGroupList: string) {
        this.routerGroupList = routerGroupList
      },
    },
  }
)

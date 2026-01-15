import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import {
  ICertifiedParametersListItem,
  ICertifiedParametersResponse,
} from '@/interfaces/customs/normative/CertifiedParameters'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useUtils, useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_NORMATIVE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IPaginated } from '@/interfaces/customs'

const URL_PATH = `${URL_PATH_NORMATIVE}/certificate/parameter`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCertifiedParametersStoreV1 = defineStore(
  'certified-parameters-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Parámetros certificados',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Normativo',
          },
          {
            label: 'Parámetros certificados',
            route: 'CertifiedParametersList',
          },
        ],
        btn: {
          label: 'Crear',
          icon: useUtils().defaultIconsLucide.plusCircleOutline,
        },
      },
    }),

    actions: {
      async _getListAction(
        params: Record<string, string | number>
      ): Promise<IPaginated<ICertifiedParametersListItem> | null> {
        let paginatorResponse: IPaginated<ICertifiedParametersListItem> | null =
          null
        await executeApi()
          .get(`${URL_PATH}`, {
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
      async _getCertifiedParametersById(parameterId: number) {
        let certifiedParameterData: ICertifiedParametersResponse | null = null
        await executeApi()
          .get(`${URL_PATH}/${parameterId}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              certifiedParameterData =
                responseData as ICertifiedParametersResponse
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
        return certifiedParameterData
      },
      async _getCertifiedBlobPreview(
        parameterId: number
      ): Promise<Blob | null> {
        try {
          const response = await executeApi().get(
            `${URL_PATH}/preview/${parameterId}`,
            {
              responseType: 'blob',
            }
          )

          const blob = new Blob([response.data], {
            type: response.headers['content-type'] || 'application/pdf',
          })

          return blob
        } catch (error) {
          const errorObj = error as IErrors
          const message = showCatchError(errorObj)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        }
      },

      async _createCertifiedParameters(formData: FormData) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
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

      async _updateCertifiedParameters(
        formData: FormData,
        parameterId: number
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/update/${parameterId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
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
      async _deleteCertifiedParameters(parameterId: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/${parameterId}`)
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
    },
  }
)

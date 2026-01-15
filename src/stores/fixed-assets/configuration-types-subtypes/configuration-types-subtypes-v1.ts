// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import {
  IAssetTypeRequest,
  IAssetTypeResponse,
  IConfigurationTypesSubtypesCreateResponse,
  IConfigurationTypesSubtypesItemList,
} from '@/interfaces/customs/fixed-assets/ConfigurationTypeSubtypes'
import { IErrors } from '@/interfaces/global'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useConfigurationTypesSubtypesStoreV1 = defineStore(
  'configuration-types-subtypes-store-v1',
  {
    state: () => ({
      version: 'v1',
      headerPropsDefault: {
        title: 'Configuración de activos fijos y bienes',
        breadcrumbs: [
          { label: 'Inicio', route: 'HomeView' },
          { label: 'Activos fijos', route: '' },
          {
            label: 'Configuración de activos fijos y bienes',
            route: 'ConfigurationTypesSubtypesList',
          },
        ],
      },
    }),
    actions: {
      async _getConfigurationTypesSubtypesList(params: string) {
        const responseData = {
          list: [] as IConfigurationTypesSubtypesItemList[],
          pages: {
            currentPage: 0,
            lastPage: 0,
          },
        }

        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/types?${params}`)
          .then((response) => {
            responseData.list = response.data?.data?.data ?? []
            responseData.pages.currentPage =
              response.data?.data?.current_page ?? 0
            responseData.pages.lastPage = response.data?.data?.last_page ?? 0

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
        return responseData
      },
      async _createConfigurationTypesSubtypes(payload: IAssetTypeRequest) {
        let responseData: IConfigurationTypesSubtypesCreateResponse | null =
          null

        await executeApi()
          .post(`${URL_PATH_FIXED_ASSETS}/types`, payload)
          .then((response) => {
            responseData =
              response.data as IConfigurationTypesSubtypesCreateResponse
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return responseData
      },
      async _getByIdConfigurationTypesSubtypes(id: number) {
        let responseData: IAssetTypeResponse | null = null

        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/types/${id}`)
          .then((response) => {
            const { data, message, success } = response.data

            if (success && data) {
              responseData = data
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

        return responseData
      },
      async _updateConfigurationTypesSubtypes(
        id: number,
        payload: IAssetTypeRequest
      ) {
        let success: boolean = false
        await executeApi()
          .put(`${URL_PATH_FIXED_ASSETS}/types/${id}`, payload)
          .then((response) => {
            success = response.data?.success ?? false

            showAlert(
              response.data.message,
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

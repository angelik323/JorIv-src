// Pinia
import { defineStore } from 'pinia'

//APIs
import { executeApi } from '@/apis'

// Interfaces
import {
  IRemoteMassAuthorization,
  IRemoteMassAuthorizationDetailItem,
  IRemoteMassAuthorizationUpdateRequest,
  IRemoteMassAuthorizationUpdateResponse,
} from '@/interfaces/customs/sarlaft/RemoteMassAuthorization'

// Utils
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Composables
import { useAlert, useShowError } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const useRemoteMassAuthorizationStoreV1 = defineStore(
  'remote-mass-authorization-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _getRemoteMassAuthorizations(queryParamsFilters: string) {
        return executeApi()
          .get(`${URL_PATH_SARLAFT}/finding-massive-list?${queryParamsFilters}`)
          .then((response) => {
            const responseData = response?.data?.data
            if (!responseData || !responseData.data?.length) {
              throw new Error('No se encontraron registros')
            }
            const data = responseData.data as IRemoteMassAuthorization[]
            const pages = {
              currentPage: responseData.current_page ?? 1,
              lastPage: responseData.last_page ?? 1,
            }
            showAlert(
              'Registro obtenido exitosamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
            return { data, pages }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _getRemoteMassAuthorizationDetail(
        grupo_id: string,
        queryParamsFilters: string
      ) {
        return executeApi()
          .get(
            `${URL_PATH_SARLAFT}/finding-massive-list/${grupo_id}?${queryParamsFilters}`
          )
          .then((response) => {
            const responseData = response?.data
            if (!responseData || !responseData?.data?.length) {
              throw new Error('No se encontraron registros')
            }
            const data =
              responseData.data as IRemoteMassAuthorizationDetailItem[]

            const pages = {
              currentPage: responseData.current_page ?? 1,
              lastPage: responseData.last_page ?? 1,
            }
            showAlert(
              'Registro obtenido exitosamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
            return { data, pages }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _putRemoteMassAuthorizationUpdate(
        payload: IRemoteMassAuthorizationUpdateRequest
      ) {
        return executeApi()
          .put(`${URL_PATH_SARLAFT}/finding-massive-list`, payload)
          .then((response) => {
            const data = response?.data
            if (data?.success) {
              showAlert(
                `${data.message}, los cambios puden tardar en reflejarse`,
                'success',
                undefined,
                TIMEOUT_ALERT
              )
              return data as IRemoteMassAuthorizationUpdateResponse
            } else {
              throw new Error(data?.message || 'Error desconocido')
            }
          })
          .catch((error) => {
            const errorMessage = error?.message || showCatchError(error)
            showAlert(errorMessage, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
    },
  }
)

export default useRemoteMassAuthorizationStoreV1

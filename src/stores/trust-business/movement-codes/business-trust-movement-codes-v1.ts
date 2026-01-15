// pinia
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'

// interfaces
import {
  ITrustBusinessMovementCodes,
  ITrustBusinessMovementCodesCreate,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBusinessTrustMovementCodesStoreV1 = defineStore(
  'business-trust-movement-codes',
  {
    state: () => ({
      version: 'v1',
      business_trust_movement_codes_list:
        [] as ITrustBusinessMovementCodesCreate[],
      business_trust_movement_codes_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as ITrustBusinessMovementCodesCreate | null,
      business_trust_movement_codes_request:
        null as ITrustBusinessMovementCodes | null,
    }),
    actions: {
      async _getListAction(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/movement-code/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.business_trust_movement_codes_list =
                response.data?.data?.data ?? []
              this.business_trust_movement_codes_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _getTrustBusinessResourcesById(id: number) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/movement-code/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res = response.data?.data
              if (res) {
                this.business_trust_movement_codes_request = { ...res }
              }
            }

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _createTrustBusinessMovementCode(
        data: ITrustBusinessMovementCodesCreate
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/movement-code/new`, data)
          .then((response) => {
            success = response.data.success
            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            success = false
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _updateTrustBusinessMovementCode(
        data: ITrustBusinessMovementCodesCreate,
        id: number
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .put(`${TRUST_BUSINESS_API_URL}/movement-code/update/${id}`, data)
          .then((response) => {
            success = response.data.success
            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _dowloadCodeList(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/movement-code/export?paginate=1${params}`,
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
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _changeStatusAction(id: number) {
        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/movement-code/delete/${id}`)
          .then((response) => {
            this._getListAction('')
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

      _setDataInformationForm(data: ITrustBusinessMovementCodesCreate | null) {
        this.data_information_form = data
      },
    },
  }
)

// Pinia - Axios
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IAuthorizationPayload,
  IAuthorizationTreasuryDetail,
  IAuthorizationTreasuryItemList,
  IBulkUploadsAuthorization,
} from '@/interfaces/customs/treasury/AuthorizationTreasury'
import { IGenericResource } from '@/interfaces/customs/resources/Common'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { saveTextFileWithFallback } = useUtils()
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAuthorizationTreasuryStoreV1 = defineStore(
  'authorization_treasury-store-v1',
  {
    state: () => ({
      authorization_treasury_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      authorization_treasury_list: [] as IAuthorizationTreasuryItemList[],
      authorization_treasury_response: {} as IAuthorizationTreasuryDetail,
      data_selection: [] as IAuthorizationTreasuryItemList[],
      rejection_reason: '' as string,
      bulk_uploads_authorization_list: [] as IGenericResource[],
      error: {
        recordId: [] as number[],
        recordType: '' as string,
      },
    }),

    actions: {
      async _getAuthorizationTreasuryList(params: string) {
        this._clearData()

        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/treasury-authorizations?paginate=1&${params}`
          )
          .then((response) => {
            this.authorization_treasury_list = response.data?.data?.data ?? []
            this.authorization_treasury_pages.currentPage =
              response.data?.data?.current_page
            this.authorization_treasury_pages.lastPage =
              response.data?.data?.last_page

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
      },

      async _getByIdAuthorizationTreasury(id: number, type: string) {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/treasury-authorizations/${id}/${type}`)
          .then((response) => {
            if (response.data.success) {
              this.authorization_treasury_response = response.data.data ?? {}
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
      },

      async _authorizeRequest(payload: IAuthorizationPayload) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/treasury-authorizations/bulk-authorize`,
            payload
          )
          .then((response) => {
            success = response.data.success
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

        this.error = {
          recordId: !success ? payload.record_ids : [],
          recordType: payload.record_type,
        }

        return success
      },

      async _rejectRequest(payload: IAuthorizationPayload) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/treasury-authorizations/bulk-reject`,
            payload
          )
          .then((response) => {
            success = response.data.success

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

        if (!success) {
          this.error = {
            recordId: payload.record_ids,
            recordType: payload.record_type,
          }
        }

        return success
      },

      async _getErrorFileAuthorizationTreasury() {
        const ids = this.error.recordId
        const type = this.error.recordType

        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/treasury-authorizations/${type}/errors-log`,
            {
              responseType: 'text',
              params: {
                ids,
              },
            }
          )
          .then(async (response) => {
            await saveTextFileWithFallback(
              response.data,
              'LOG Errores Autorización Tesorería.txt'
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getBulkUploadsAuthorization() {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/treasury-bulk-uploads-authorization`)
          .then((response) => {
            this.bulk_uploads_authorization_list = response.data?.data.map((item: IBulkUploadsAuthorization) => ({
              label: item.load_number,
              value: item.id,
            }))

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
      },

      _setDataSelection(data_to_set: IAuthorizationTreasuryItemList[] | null) {
        this.data_selection = data_to_set ? [...data_to_set] : []
      },

      _clearData() {
        this.authorization_treasury_list = []
        this.authorization_treasury_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.data_selection = []
        this.rejection_reason = ''
        this.error = {
          recordId: [] as number[],
          recordType: '' as string,
        }
      },
    },
  }
)

import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IUserPermissionListItem,
  IManagePermissionsByBusiness,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBusinessPermissionsStoreV1 = defineStore(
  'business-permissions-store-v1',
  {
    state: () => ({
      version: 'v1',
      user_list_by_business: [] as IUserPermissionListItem[],
      user_list_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getUserListByBusiness(
        businessId: number,
        params: Record<string, string | number | boolean | null>
      ) {
        this._clearData()

        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/permissions/by-business/${businessId}`,
            {
              params: { ...params, paginate: 1 },
            }
          )
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.user_list_by_business = items as IUserPermissionListItem[]
            this.user_list_pages.currentPage = current_page
            this.user_list_pages.lastPage = last_page

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

      async _managePermissionsByBusiness(
        businessId: number,
        data: IManagePermissionsByBusiness
      ) {
        let success = false

        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/permissions/manage-by-business/${businessId}`,
            data
          )
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

      async _downloadUsersByBusiness(
        businessId: number
      ): Promise<ArrayBuffer | null> {
        let xlsFile: ArrayBuffer | null = null

        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/permissions/download-massive`, {
            params: { business_trust: businessId },
            responseType: 'arraybuffer',
          })
          .then((response) => {
            xlsFile = response.data as ArrayBuffer

            showAlert(
              'Archivo generado correctamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return xlsFile
      },

      _clearData() {
        this.user_list_by_business = []
        this.user_list_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IBusinessPermissionListItem,
  IManagePermissionsByUser,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { TIMEOUTS } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useUserPermissionsStoreV1 = defineStore(
  'user-permissions-store-v1',
  {
    state: () => ({
      version: 'v1',
      business_list_by_user: [] as IBusinessPermissionListItem[],
      business_list_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getBusinessListByUser(
        userId: number,
        params: Record<string, string | number | boolean | null>
      ) {
        this._clearData()

        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/permissions/by-user/${userId}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.business_list_by_user = items as IBusinessPermissionListItem[]
            this.business_list_pages.currentPage = current_page
            this.business_list_pages.lastPage = last_page

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUTS.SEC_3
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUTS.SEC_3)
          })
      },

      async _managePermissionsByUser(
        userId: number,
        data: IManagePermissionsByUser
      ) {
        let success = false

        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/permissions/manage-by-user/${userId}`,
            data
          )
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUTS.SEC_5
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUTS.SEC_3)
          })

        return success
      },

      async _transferPermissionsByUser(userId: number, toUserId: number) {
        let success = false

        await executeApi()
          .post(
            `${TRUST_BUSINESS_API_URL}/permissions/user-to-user/${userId}?toUser=${toUserId}`
          )
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUTS.SEC_5
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUTS.SEC_3)
          })

        return success
      },

      _clearData() {
        this.business_list_by_user = []
        this.business_list_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)

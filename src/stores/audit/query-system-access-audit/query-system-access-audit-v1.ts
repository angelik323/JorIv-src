// Apis - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces - Constants
import { IQuerySystemAccessAuditList } from '@/interfaces/customs/audit/QuerySystemAccessAudit'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IPaginated } from '@/interfaces/customs'
import { URL_PATH_AUDIT } from '@/constants/apis'

// Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

const URL_PATH = `${URL_PATH_AUDIT}/authentication-logs`

export const useQuerySystemAccessAuditStoreV1 = defineStore(
  'query-system-access-audit-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        let responseList: IPaginated<IQuerySystemAccessAuditList> | null = {
          list: [],
          pages: { currentPage: 0, lastPage: 0 },
        }

        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            responseList = {
              list: items,
              pages: {
                currentPage: current_page,
                lastPage: last_page,
              },
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return responseList
      },
    },
  }
)

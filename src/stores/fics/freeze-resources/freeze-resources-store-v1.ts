// Vue - pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import {
  IFreezeResourceModel,
  IFreezeResources,
  IFreezeResourcesCreate,
} from '@/interfaces/customs/fics/FreezeResources'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

export const useFreezeResourcesStoreV1 = defineStore(
  'freeze-resources-store-v1',
  {
    state: () => ({
      version: 'v1',
      freeze_resources_list: [] as IFreezeResources[],
      freeze_resources_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      data_information_form: null as IFreezeResourcesCreate | null,
      freeze_details_id: {} as IFreezeResourceModel,
    }),

    actions: {
      async _getListFreeze(params: Record<string, string | number>) {
        this._clearData()
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/freeze`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.freeze_resources_list = items.map(
              (item: IFreezeResources) => ({
                ...item,
              })
            )
            this.freeze_resources_pages.currentPage = current_page
            this.freeze_resources_pages.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createFreeze(payload: IFreezeResourcesCreate): Promise<boolean> {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH_FICS}/freeze`, payload)
          .then((response) => {
            const { message, success } = response.data
            isSuccess = success
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return isSuccess
      },

      async _getFreezeId(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/freeze/${id}`)
          .then((response) => {
            const { message, success, data } = response.data

            if (success) {
              this.freeze_details_id = data ?? {}
            }

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.freeze_resources_list = []
        this.freeze_resources_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _setDataInformationForm(data: IFreezeResourcesCreate | null) {
        this.data_information_form = data
      },
    },
  }
)

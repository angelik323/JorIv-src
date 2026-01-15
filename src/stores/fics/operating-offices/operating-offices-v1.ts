// Pinia - Axios
import { defineStore } from 'pinia'

// Interfaces
import { IOperatingOfficeExtended } from '@/interfaces/customs/fics/OperatingOffices'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

export const useOperatingOfficesStoreV1 = defineStore(
  'operating-offices-store-v1',
  {
    state: () => ({
      operating_offices_list: [] as IOperatingOfficeExtended[],
      data_information_form: null as IOperatingOfficeExtended | null,
      operating_offices_response: {} as IOperatingOfficeExtended,
      operating_offices_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _getOperatingOfficesList(params: Record<string, string | number>) {
        this._clearData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/operating-offices`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.operating_offices_list = items.map(
              (item: IOperatingOfficeExtended) => ({ ...item })
            )
            this.operating_offices_pages.currentPage = current_page
            this.operating_offices_pages.lastPage = last_page

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

      async _getByIdOperatingOffices(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/operating-offices/${id}`)
          .then((response) => {
            const { data, message, success } = response.data

            if (success) {
              this.operating_offices_response = data ?? null
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
      },

      async _createOperatingOffices(payload: IOperatingOfficeExtended) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH_FICS}/operating-offices`, payload)
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

      async _updateOperatingOffices(
        payload: IOperatingOfficeExtended,
        id: number
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(`${URL_PATH_FICS}/operating-offices/${id}`, payload)
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

      async _patchOperatingOffices(id: number): Promise<boolean> {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .patch(`${URL_PATH_FICS}/operating-offices/${id}/toggle-status`)
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

      async _setDataOperatingOffices(data: IOperatingOfficeExtended | null) {
        this.data_information_form = data ? { ...data } : null
      },

      _clearData() {
        this.operating_offices_list = []
        this.operating_offices_response = {} as IOperatingOfficeExtended
        this.data_information_form = null
      },
    },
  }
)

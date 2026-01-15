import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  ICreateLetterFormatPayload,
  ILetterFormat,
  ILetterFormatResponse,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useLetterFormatStoreV1 = defineStore('letter-format-store-v1', {
  state: () => ({
    version: 'v1',
    letter_format_list: [] as ILetterFormat[],
    letter_format_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    selected_letter_format: null as ILetterFormat | null,

    filter_options: {} as Record<
      string,
      Array<{ label: string; value: string | number }>
    >,
  }),

  actions: {
    async _getListAction(params = '') {
      this._cleanLetterFormatData()

      await executeApi()
        .get(
          `${URL_PATH_TREASURIES}/letter-formats${params ? '?' + params : ''}`
        )
        .then((response) => {
          if (response.data.success) {
            this.letter_format_list = response.data?.data ?? []

            this.letter_format_pages = {
              currentPage: 1,
              lastPage: 1,
            }
          }

          showAlert(
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

    _cleanLetterFormatData() {
      this.letter_format_list = []
      this.letter_format_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },

    async _createLetterFormat(payload: ICreateLetterFormatPayload) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_TREASURIES}/letter-formats`, payload)
        .then((response) => {
          success = response.data.success
          showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _updateLetterFormat(
      id: number,
      payload: Partial<ILetterFormat>
    ): Promise<boolean> {
      let success = false

      await executeApi()
        .put(`${URL_PATH_TREASURIES}/letter-formats/${id}`, payload)
        .then((response) => {
          success = response.data.success
          showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _getLetterFormat(id: number): Promise<ILetterFormatResponse | null> {
      let letterFormat: ILetterFormatResponse | null = null

      await executeApi()
        .get(`${URL_PATH_TREASURIES}/letter-formats/${id}`)
        .then((response) => {
          if (response.data.success) {
            letterFormat = response.data.data
          }

          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return letterFormat
    },

    async _deleteLetterFormat(id: number) {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_TREASURIES}/letter-formats/${id}`)
        .then((response) => {
          success = response.data.success
          showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _exportLetterFormat(id: number): Promise<Blob | null> {
      let fileData: Blob | null = null

      await executeApi()
        .get(`${URL_PATH_TREASURIES}/letter-formats/${id}/download`, {
          responseType: 'blob',
        })
        .then((response) => {
          fileData = response.data
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return fileData
    },

    async _getFilterOptions() {
      let options: Record<
        string,
        Array<{ label: string; value: string | number }>
      > = {}

      await executeApi()
        .get(`${URL_PATH_TREASURIES}/letter-format/filter-options`)
        .then((response) => {
          const success = response.data?.success
          if (success) {
            options = (response.data?.data ?? {}) as typeof options
            this.filter_options = options
          }

          showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return options
    },

    async _toggleLetterFormatStatus() {
      if (!this.selected_letter_format?.id) return

      const id = this.selected_letter_format.id
      const newStatus = this.selected_letter_format.status?.id === 1 ? 2 : 1

      await executeApi()
        .put(`${URL_PATH_TREASURIES}/letter-formats/${id}/status`, {
          status_id: newStatus,
        })
        .then((response) => {
          const success = response.data.success
          showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    _selectLetterFormat(format: ILetterFormat) {
      this.selected_letter_format = format
    },
  },
})

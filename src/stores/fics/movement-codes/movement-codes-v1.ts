// Pinia - Axios
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IMovementCodesInformationForm,
  IMovementCodesItemList,
  IMovementCodesResponse,
} from '@/interfaces/customs/fics/MovementCodes'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

export const useMovementCodesStoreV1 = defineStore('movement-codes-store-v1', {
  state: () => ({
    movement_codes_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    movement_codes_list: [] as IMovementCodesItemList[],
    data_information_form: null as IMovementCodesInformationForm | null,
    movement_codes_response: null as IMovementCodesResponse | null,
  }),

  actions: {
    async _getMovementCodesList(params: Record<string, string | number>) {
      this._clearData()
      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      await executeApi()
        .get(`${URL_PATH_FICS}/movement-codes`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.movement_codes_list = items.map(
            (item: IMovementCodesItemList) => ({ ...item })
          )
          this.movement_codes_pages.currentPage = current_page
          this.movement_codes_pages.lastPage = last_page

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

    async _getByIdMovementCodes(id: number) {
      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      await executeApi()
        .get(`${URL_PATH_FICS}/movement-codes/${id}`)
        .then((response) => {
          const { data, message, success } = response.data

          if (success) {
            this.movement_codes_response = data ?? null
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

    async _createMovementCodes(data_to_create: IMovementCodesInformationForm) {
      let isSuccess = false

      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      await executeApi()
        .post(`${URL_PATH_FICS}/movement-codes`, data_to_create)
        .then((response) => {
          const { message, success } = response.data

          isSuccess = success
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
      return isSuccess
    },
    async _updateMovementCodes(id: number, data_to_update: IMovementCodesInformationForm) {
      let isSuccess = false

      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()

      await executeApi()
        .patch(`${URL_PATH_FICS}/movement-codes/${id}`, data_to_update)
        .then((response) => {
          const { message, success } = response.data

          isSuccess = success
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
      return isSuccess
    },
    async _exportExcelAction(params: string) {
      const { showAlert } = useAlert()
      const { showCatchError } = useShowError()
      const utils = useUtils()

      await executeApi()
        .get(`${URL_PATH_FICS}/movement-codes/export/excel?${params}`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          const fileName = utils.getNameBlob(response)
          utils.downloadBlobXlxx(blob, fileName)

          return showAlert(
            'Descarga exitosa',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    _setDataInformationForm(data_to_set: IMovementCodesInformationForm | null) {
      this.data_information_form = data_to_set ? { ...data_to_set } : null
    },

    _clearData() {
      this.movement_codes_list = []
      this.movement_codes_response = null
      this.data_information_form = null
      this.movement_codes_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})

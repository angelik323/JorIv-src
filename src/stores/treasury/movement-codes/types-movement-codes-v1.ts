import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { IMovementCodes } from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useMovementCodesCollection = defineStore(
  'movement-codes-collection',
  {
    state: () => ({
      movement_codes_list: [] as IMovementCodes[] | [],
      movement_codes_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      perPage: 20 as number | string,
      data_information_form: null as IMovementCodes | null,
      movement_codes_request: null as IMovementCodes | null,
      codeOptions: [] as { label: string; value: string }[],
      descriptionOptions: [] as { label: string; value: string }[],
      all_movement_codes: [] as IMovementCodes[],
    }),

    actions: {
      async _getMovementCodes(params: string) {
        this.movement_codes_list = []
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/treasury-movement-codes?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.movement_codes_list = response.data?.data?.data ?? []
              this.movement_codes_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.movement_codes_pages.lastPage =
                response.data?.data?.last_page ?? 0
              return showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _getAllMovementCodes() {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/treasury-movement-codes/`)
          .then((response) => {
            if (response.data.success) {
              this.all_movement_codes = response.data?.data ?? []
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _updateMovementCodes(payload: any, id: number) {
        let success = false
        await executeApi()
          .put(`${URL_PATH_TREASURIES}/treasury-movement-codes/${id}`, payload)
          .then((response) => {
            success = response.data.success
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

        return success
      },
      async _createMovementCodes(payload: any) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_TREASURIES}/treasury-movement-codes`, payload)
          .then((response) => {
            success = response.data.success
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

        return success
      },

      async _deleteMovementCodes(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_TREASURIES}/treasury-movement-codes/${id}`)
          .then((response) => {
            success = response.data.success
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

        return success
      },
      async _getByIdMovementCodes(id: number) {
        this.data_information_form = null
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/treasury-movement-codes/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.data_information_form = response.data.data ?? null
            }
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
      _setDataInformationForm(data_to_set: IMovementCodes | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },
    },
  }
)

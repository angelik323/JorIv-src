// Pinia
import { defineStore } from 'pinia'

// APIs
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Interfaces
import {
  ITaxMatrixItem,
  ITaxMatrixUpdatePayload,
} from '@/interfaces/customs/accounts-payable/TaxMatrix'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/tax-matrix`

export const useTaxMatrixStoreV1 = defineStore('tax-matrix-store-v1', {
  state: () => ({
    tax_matrices_list: [] as ITaxMatrixItem[],
    tax_matrix_response: null as ITaxMatrixItem | null,
  }),

  actions: {
    async _getTaxMatrixList() {
      await executeApi()
        .get(URL_PATH)
        .then((response) => {
          const {
            data: { data: items = [] },
            message,
            success,
          } = response.data as {
            data: { data: unknown[] }
            message?: string
            success?: boolean
          }

          this.tax_matrices_list = items as ITaxMatrixItem[]

          showAlert(
            message ?? 'Listado obtenido exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getTaxMatrixByType(taxType: string) {
      await executeApi()
        .get(`${URL_PATH}/${taxType}`)
        .then((response) => {
          const { data, message, success } = response.data as {
            data: unknown
            message?: string
            success?: boolean
          }

          this.tax_matrix_response = data as ITaxMatrixItem

          showAlert(
            message ?? 'Registro obtenido exitosamente.',
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const msg = showCatchError(error)
          showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _updateTaxMatrix(taxType: string, payload: ITaxMatrixUpdatePayload) {
      let success = false
      await executeApi()
        .put(`${URL_PATH}/${taxType}`, payload)
        .then((response) => {
          const { message, success: ok } = response.data as {
            message?: string
            success?: boolean
          }
          success = !!ok
          showAlert(
            message ??
              (success
                ? 'Matriz actualizada exitosamente.'
                : 'No se pudo actualizar la matriz.'),
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
      return success
    },

    getMatrixByType(taxType: string): ITaxMatrixItem | undefined {
      return this.tax_matrices_list.find(
        (matrix) => matrix.tax_type === taxType
      )
    },
  },
})

import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import {
  IAuthorizationPayload,
  IDetailGroupItem,
  IDispersionLetter,
  ITreasuryGenerateDispersionGroupLetter,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES_DISPERSION_GROUP_LETTERS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useDispersionLetterStoreV1 = defineStore(
  'dispersion-letter-store-v1',
  {
    state: () => ({
      version: 'v1',
      dispersion_group_letter_list:
        [] as ITreasuryGenerateDispersionGroupLetter[],
      dispersion_group_letter_pages: { currentPage: 1, lastPage: 1 },
      dispersion_group_letter_details: [] as IDetailGroupItem[],
      dispersion_group_letter_details_pages: { currentPage: 1, lastPage: 1 },

      letter_list: [] as IDispersionLetter[],
      letter_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      selected_letter: null as IDispersionLetter | null,
    }),

    actions: {
      async _getListGroupAction(params: string) {
        this.dispersion_group_letter_list = []

        await executeApi()
          .get(
            `${URL_PATH_TREASURIES_DISPERSION_GROUP_LETTERS}/listGroups?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.dispersion_group_letter_list = response.data.data.data ?? []
              this.dispersion_group_letter_pages = {
                currentPage: response.data.data.current_page ?? 1,
                lastPage: response.data.data.last_page ?? 1,
              }
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

      async _getDetailGroupAction(params: string) {
        this.dispersion_group_letter_details = []

        await executeApi()
          .get(
            `${URL_PATH_TREASURIES_DISPERSION_GROUP_LETTERS}/listBreakdown?paginate=1&${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.dispersion_group_letter_details =
                response.data?.data?.data ?? []
              this.dispersion_group_letter_details_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }
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

      async _generateAuthorization(payload: IAuthorizationPayload) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_TREASURIES_DISPERSION_GROUP_LETTERS}/generateAuthorization`,
            payload
          )
          .then((response) => {
            success = response.data?.success ?? false

            return showAlert(
              response.data?.message,
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

      async _generateLetter(payload: { group_id: number; format_id: number }) {
        let blob: Blob | null = null
        const { group_id, format_id } = payload

        await executeApi()
          .post(
            `${URL_PATH_TREASURIES_DISPERSION_GROUP_LETTERS}/generateLetter`,
            { group_id, format_id },
            { responseType: 'blob' }
          )
          .then((response) => {
            blob = response.data

            const success = response.status === 200
            const msg = success
              ? 'Carta generada correctamente'
              : 'Error al generar la carta'

            const group = this.dispersion_group_letter_list.find(
              (g) => g.id === group_id
            )

            const business = group ? group.business_code : '[Negocio]'
            const bank = group ? group.bank_code : '[Banco]'
            const date =
              group && group.date
                ? (() => {
                    const d = new Date(group.date)
                    const year = d.getFullYear()
                    const month = String(d.getMonth() + 1).padStart(2, '0')
                    const day = String(d.getDate()).padStart(2, '0')
                    return `${year}-${month}-${day}`
                  })()
                : '[Fecha]'

            const fileName = `Carta_${bank}_${business}_${date}.pdf`.replace(
              /\s+/g,
              '_'
            )

            if (blob && success) {
              useUtils().downloadBlob(blob, fileName)
            }

            showAlert(
              msg,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch(async (error) => {
            const text = await error.response.data.text()
            const json = JSON.parse(text)
            showAlert(json?.message, 'error', undefined, TIMEOUT_ALERT)
          })

        return blob
      },

      _cleanLetterData() {
        this.letter_list = []
        this.letter_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },

      _selectLetter(letter: IDispersionLetter) {
        this.selected_letter = letter
      },
    },
  }
)

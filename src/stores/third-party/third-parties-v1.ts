import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IBasicDataForm, IThirdParty } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

// Constants
const URL_PATH_THIRD_PARTIES = 'assets/api/assets/third-parties'
const TIMEOUT_ALERT = 3000

export const useThirdPartiesStoreV1 = defineStore('third-parties-v1', {
  state: () => ({
    version: 'v1',
    exist_client: false as boolean,
    third_request: null as IThirdParty | null,
    basic_data_form: null as IBasicDataForm | null,
    wasPersonLoaded: false as boolean,
  }),
  actions: {
    async _verifyExistThirdParty(
      data: { document: number; type: number },
      alert: boolean = true,
      client: boolean = false
    ): Promise<boolean> {
      let success = false
      this.exist_client = false
      await executeApi()
        .get(
          `${URL_PATH_THIRD_PARTIES}/valid-exists?document_type_id=${data.type}&document=${data.document}`
        )
        .then((response) => {
          success = response.data.success
          if (response.data.success) {
            this.third_request = response.data?.data ?? null

            if (this.third_request?.is_customer) {
              this.exist_client = true
            }
          }
          if (alert || (success && !client)) {
            showAlert(
              client
                ? response.data.message
                : 'Tercero ya se encuentra registrado',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          }
        })
        .catch((error) => {
          this.third_request = null
          this.exist_client = false
          success = false
          if (alert && success) {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          }
        })

      return success
    },

    _setBasicDataState(state: IBasicDataForm | null = null) {
      this.basic_data_form = null
      if (state) {
        this.basic_data_form = state
      }
    },

    _setPersonLoadedState(state: boolean) {
      this.wasPersonLoaded = state
    },

    _clearData() {
      this.exist_client = false
      this.third_request = null
      this._setBasicDataState(null)
      this._setPersonLoadedState(false)
    },
  },
})

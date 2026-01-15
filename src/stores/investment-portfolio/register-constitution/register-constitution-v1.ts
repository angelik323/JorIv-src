import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
import {
  IRegisterConstitutionConditions,
  IRegisterConstitutionCurrencyLocal,
  IRegisterConstitutionForeignCurrency,
  IRegisterConstitutionGeneric,
  IRegisterConstitutionValuesForeign,
} from '@/interfaces/customs/'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterConstitutionStoreV1 = defineStore(
  'register-constitution-store-v1',
  {
    state: () => ({
      data_constitution_list: [] as [],
      data_constitution_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_generic: {} as IRegisterConstitutionGeneric | null,
      data_information_values: {} as IRegisterConstitutionValuesForeign | null,
      data_information_conditions: {} as IRegisterConstitutionConditions | null,
      data_value_money: {} as {
        currency_identifier?: string | null
        currency_local_value: number | string | null
        currency_conversion_factor: number | string | null
      },
      referenceLocalTabs: {} as {
        genericData?: boolean
        valuesData?: boolean
      },
      referenceTabs: {
        valuePosition: 0,
      },
    }),
    actions: {
      async _getCurrencyForeignAndLocalConstitution(params: string) {
        this.data_constitution_list = []
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/fic-participation-constitution-list/list?paginate=1&${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_constitution_list = response.data.data.data ?? []
              this.data_constitution_pages.currentPage =
                response.data.data?.current_page ?? 0
              this.data_constitution_pages.lastPage =
                response.data.data?.last_page ?? 0
              return showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            return showAlert(
              showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _createCurrencyLocal(payload: IRegisterConstitutionCurrencyLocal) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/fic-participations-local-currency/new`,
            payload
          )
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
      async _createCurrencyForeign(
        payload: IRegisterConstitutionForeignCurrency
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/fic-participations-foreign-currency/new`,
            payload
          )
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
      _setDataInformationGeneric(data: IRegisterConstitutionGeneric | null) {
        this.data_information_generic = data ? { ...data } : null
      },
      _setDataInformationValues(
        data: IRegisterConstitutionValuesForeign | null
      ) {
        this.data_information_values = data ? { ...data } : null
      },
      _setDataInformationConditions(
        data: IRegisterConstitutionConditions | null
      ) {
        this.data_information_conditions = data ? { ...data } : null
      },
      _setReferenceTabs(value: { valuePosition: number }) {
        this.referenceTabs = { ...value }
      },
      _setDataValueMoney(value: {
        currency_identifier?: string | null
        currency_local_value: number | string | null
        currency_conversion_factor: number | string | null
      }) {
        this.data_value_money = {
          ...value,
        }
      },
      _setReferenceLocalTabs(value: {}) {
        this.referenceLocalTabs = { ...value }
      },
    },
  }
)

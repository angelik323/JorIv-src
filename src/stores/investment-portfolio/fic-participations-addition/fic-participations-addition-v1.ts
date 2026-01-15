import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
import { useAlert, useShowError } from '@/composables'
import { IErrors } from '@/interfaces/global'

import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

import {
  IParticipationsAdditionLocalCurrencyCreate,
  IParticipationsAdditionForeignCurrencyCreate
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useFicParticipationsAdditionStoreV1 = defineStore(
  'fic-participations-addition-store-v1',
  {
    state: () => ({
      version: 'v1',
      emitter_id: 0,
      participation_currency_value: 0,
      trm: '',
      currency: 0,
      coin_value: '',
      constitution_value_origin_currency: 0,
      currency_conversion: '0',
      number_days: 0
    }),

    actions: {
      async _createFicParticipationsAdditionLocalCurrency(data: Partial<IParticipationsAdditionLocalCurrencyCreate>){
        let success = false

        await executeApi()
          .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/fic-participations-addition-local-currency/new`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

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

        return success
      },

      async _createFicParticipationsAdditionForeignCurrency(data: Partial<IParticipationsAdditionForeignCurrencyCreate>){
        let success = false

        await executeApi()
          .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/fic-participations-addition-foreign-currency/new`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

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

        return success
      },

      _setDataEmitterId(
        data: number | 0
      ) {
        this.emitter_id = data ? data : 0
      },

      _setDataParticipationCurrencyValue(
        data: number | 0
      ) {
        this.participation_currency_value = data ? data : 0
      },

      _setDataCurrency(
        trm: string | '',
        value: number | 0,
        coin_value: string | '',
        constitution_value_origin_currency: number | 0,
        currency_conversion: string | '',
      ) {
        this.trm = trm ? trm : ''
        this.currency = value ? value : 0
        this.coin_value = coin_value ? coin_value : ''
        this.constitution_value_origin_currency = constitution_value_origin_currency ?? 0
        this.currency_conversion = currency_conversion ? currency_conversion : '0'
      },

      _setDataNumberDays(number_days: number){
        this.number_days = number_days ? number_days : 0
      },

      _resetStore(){
        this.emitter_id = 0
        this.participation_currency_value = 0
        this.trm = ''
        this.currency = 0
        this.coin_value = ''
        this.currency_conversion = '0'
        this.number_days = 0
      }
    }
  }
)
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

import {
  IActionTransfer,
  IBankTransferDetail,
  IBankTransferFilter,
  IBankTransferInitialForm,
  IBankTransferOriginToDestinyState,
  IBankTransferTypeAction,
  IBankTranslateSuccess,
  IBankTrasferCreateAndUpdate,
  IFormOfficesFilter,
  IFormTransfer,
  IOriginInfo,
} from '@/interfaces/customs'
import { useAlert, useShowError } from '@/composables'

import { URL_PATH_TREASURIES } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBankTransferStoreV1 = defineStore('bank-transfer-store-v1', {
  state: () => ({
    currentBankTransferTab: 'origin-data' as IBankTransferTypeAction,
    currentTRM: null as number | null,
    cardOriginInfo: null as null | IOriginInfo,
    cardDestinyInfo: null as null | IOriginInfo,
    formFilterInitial: null as IBankTransferInitialForm | null,
    filterForm: null as IBankTransferFilter | null,
    formOrigin: null as IBankTransferDetail | null,
    formDestiny: null as IBankTransferDetail | null,
    formCreateAndUpdateOrigin: null as IBankTrasferCreateAndUpdate | null,
    formCreateAndUpdateDestiny: null as IBankTrasferCreateAndUpdate | null,
    formOriginToDestiny: null as IBankTransferOriginToDestinyState | null,
    bankTransferId: null as number | null,
  }),

  actions: {
    async _resetAllBankTransfer() {
      this.currentTRM = null
      this.filterForm = null
      this.formOrigin = null
      this.formDestiny = null
      this.cardOriginInfo = null
      this.cardDestinyInfo = null
    },

    async _updateFormCreateAndUpdateOrigin(
      dataInfo: IBankTrasferCreateAndUpdate
    ) {
      this.formCreateAndUpdateOrigin = dataInfo
    },
    async _updateFormCreateAndUpdateDestiny(
      dataInfo: IBankTrasferCreateAndUpdate
    ) {
      this.formCreateAndUpdateDestiny = dataInfo
    },

    async _updateTransferBankTab(tab: IBankTransferTypeAction) {
      this.currentBankTransferTab = tab
    },

    async _updateOriginCard(cardInfo: IOriginInfo | null) {
      this.cardOriginInfo = cardInfo
    },

    async _updateDestinyCard(cardInfo: IOriginInfo | null) {
      this.cardDestinyInfo = cardInfo
    },

    async _updateOriginToDestinyForm(info: IFormTransfer) {
      this.formOriginToDestiny = {
        value: info.costValue,
        bank_account_balance: info.bankAccountBalance,
        investment_plan_balance: info.investmentPlanBalance,
      }
    },

    async _updateOriginForm(info: IFormTransfer) {
      this.formOrigin = {
        business_trust_id: info.businessId,
        movement_id: info.movementValue,
        bank_id: info.bankDescription,
        bank_account_id: info.bankAccountValue,
        found_id: info.fundValue,
        investment_plans_id: info.inversionPlan,
        means_of_payment_id: info.paymentMethod,
        trust_investment_plan: info.inversionPlan,
        foreign_currency_value: info.amountInForeignCurrency,
        coin: info.currencyValue,
        trm: info.trmValue,
        value: info.costValue,
        cost_center_id: info.costCenter,
        cash_flow_id: info.cashFlow,
        bank_account_balance: info.bankAccountBalance,
        investment_plan_balance: info.investmentPlanBalance,
      }
    },

    async _updateDestinyForm(info: IFormTransfer) {
      this.formDestiny = {
        business_trust_id: info.businessId,
        movement_id: info.movementValue,
        bank_id: info.bankDescription,
        bank_account_id: info.bankAccountValue,
        found_id: info.fundValue,
        investment_plans_id: info.inversionPlan,
        type_receive_id: info.paymentMethod,
        trust_investment_plan: info.inversionPlan,
        foreign_currency_value: info.amountInForeignCurrency,
        coin: info.currencyValue,
        trm: info.trmValue,
        value: info.costValue,
        cost_center_id: info.costCenter,
        cash_flow_id: info.cashFlow,
        bank_account_balance: info.bankAccountBalance,
        investment_plan_balance: info.investmentPlanBalance,
      }
    },

    async _updateFilterForm(info: IFormOfficesFilter, officeLabel: string) {
      this.filterForm = {
        date: info.date,
        office_id: info.fiduciaryOffice,
        name_office: info.fiduciaryOfficeName,
        observations: info.instructionsView,
      }

      this.formFilterInitial = {
        ...this.filterForm,
        office_label: officeLabel,
      }
    },

    async _updateBankTransferConfirm(
      bankTransferId: number,
      payload: IBankTransferFilter
    ) {
      await executeApi()
        .put(
          `${URL_PATH_TREASURIES}/bank-transfers/confirm/${bankTransferId}`,
          {
            ...payload,
          }
        )
        .then((response) => {
          const { message } = response.data

          const validateId = response.data.data.id || null

          this.bankTransferId = validateId

          showAlert(message, 'success')
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error')
        })
    },

    async _createDestinyBankTransfer(
      info: IBankTrasferCreateAndUpdate,
      bankTransferId: number | null,
      actions: IActionTransfer
    ) {
      let success: IBankTranslateSuccess = {
        status: false,
        id: null,
      }

      const payload = {
        ...info,
        bank_transfer_id: bankTransferId,
      }

      await executeApi()
        .post(`${URL_PATH_TREASURIES}/bank-transfers/${actions}`, {
          ...payload,
        })
        .then((response) => {
          const { message } = response.data

          success = response.data
            ? {
                status: true,
                id: response.data.data.id,
              }
            : {
                status: false,
                id: null,
              }

          showAlert(message, success ? 'success' : 'error')
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error')
        })
    },

    async _createBankTransfer(
      info: IBankTrasferCreateAndUpdate,
      actions: IActionTransfer
    ) {
      let success: IBankTranslateSuccess = {
        status: false,
        id: null,
      }

      const sanitizePayload = (
         
        obj: Record<string, any>,
        keysToRemove: string[]
         
      ): Record<string, any> => {
        const cleanObj = { ...obj }

        keysToRemove.forEach((key) => {
          if (key in cleanObj) {
            delete cleanObj[key]
          }
        })

        if (Array.isArray(cleanObj.details)) {
          cleanObj.details = cleanObj.details.map(
             
            (detail: Record<string, any>) => {
              const cleanDetail = { ...detail }
              keysToRemove.forEach((key) => {
                if (key in cleanDetail) {
                  delete cleanDetail[key]
                }
              })
              return cleanDetail
            }
          )
        }

        return cleanObj
      }

      const keysToRemove = ['bank_transfer_id']

      const payload =
        actions === 'origins'
          ?  
            sanitizePayload(info as Record<string, any>, keysToRemove)
          : info

      await executeApi()
        .post(`${URL_PATH_TREASURIES}/bank-transfers/${actions}`, {
          ...payload,
        })
        .then((response) => {
          const { message } = response.data

          const validateId = response.data.data.id || null

          this.bankTransferId = validateId

          success = response.data
            ? {
                status: true,
                id: response.data.data.id,
              }
            : {
                status: false,
                id: null,
              }

          showAlert(message, success ? 'success' : 'error')
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error')
        })
    },
  },

  persist: true,
})

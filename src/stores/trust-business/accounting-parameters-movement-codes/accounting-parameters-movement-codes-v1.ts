// pinia
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'

// interfaces
import {
  IAccountingParametersMovementCodesParameter,
  IAccountingParametersMovementCodes,
  ICodesBusinessTrust,
  IAccountingParametersMovementCodesParameterResponse,
} from '@/interfaces/customs'

export const useAccountingParametersMovementCodesStoreV1 = defineStore(
  'accounting-parameters-movement-codes',
  {
    state: () => ({
      version: 'v1',
      accounting_parameters_movement_codes_list:
        [] as IAccountingParametersMovementCodes[],
      accounting_parameters_movement_codes_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      accounting_parameters_movement_codes_request:
        null as IAccountingParametersMovementCodes | null,

      row_selected: null as IAccountingParametersMovementCodes | null,
      max_id: null as number | null,

      // codes nfi
      codes_business_trust_list: [] as ICodesBusinessTrust[],

      // parameters
      accounting_parameters_movement_codes_parameters_list:
        [] as IAccountingParametersMovementCodesParameter[],
      max_id_parameters: null as number | null,
    }),
    actions: {
      async _getListAction() {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/accounting-block/list`)
          .then((response) => {
            if (response.data.success) {
              this.accounting_parameters_movement_codes_list =
                response.data?.data?.data?.map(
                  (item: IAccountingParametersMovementCodes) => ({
                    ...item,
                    _uid: item.id,
                  })
                ) ?? []

              //
              this.max_id = useUtils().getMaxId(
                this.accounting_parameters_movement_codes_list,
                'id'
              )

              this.accounting_parameters_movement_codes_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _createAccountingParametersMovementCodes(
        data: IAccountingParametersMovementCodes[]
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/accounting-block/new`, {
            accountig_blocks: data,
          })
          .then((response) => {
            success = response.data.success

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            success = false
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _getCodeDescription(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/accounting-block/list-business-trusts?${params}`
          )
          .then((response) => {
            this.codes_business_trust_list = response.data?.data?.data ?? []

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _getParameters(id: number) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/accounting-block/show/${id}`)
          .then((response) => {
            this.accounting_parameters_movement_codes_parameters_list =
              response.data?.data?.parameters?.map(
                (
                  item: IAccountingParametersMovementCodesParameterResponse
                ) => ({
                  ...item,
                  _uid: item.id,
                  movement_code_id: item.movement_code_id?.id ?? undefined,
                  ncp_cost_center_id: item.ncp_cost_center_id?.id ?? undefined,
                  ncp_specific: item.ncp_specific?.id ?? undefined,
                  np_cost_center_id: item.np_cost_center_id?.id ?? undefined,
                  np_specific: item.np_specific?.id ?? undefined,
                  offsetting_accounting_account_id:
                    item.offsetting_accounting_account_id?.id ?? undefined,
                  split_accounting_account_id:
                    item.split_accounting_account_id?.id ?? undefined,
                  sub_voucher_id: item.sub_voucher_id?.id ?? undefined,
                  voucher_id: item.voucher_id?.id ?? undefined,
                })
              ) ?? []

            this.max_id_parameters = useUtils().getMaxId(
              this.accounting_parameters_movement_codes_parameters_list,
              'id'
            )

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _createAccountingParametersMovementCodesParameters(
        data: IAccountingParametersMovementCodesParameter[],
        id: number
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/accounting-params/new/${id}`, {
            parameters: data,
          })
          .then((response) => {
            success = response.data.success

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            success = false
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _deleteAccountingParametersMovementCodesParameters(
        id: number
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .delete(`${TRUST_BUSINESS_API_URL}/accounting-block/${id}`)
          .then((response) => {
            success = response.data.success

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            success = false
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _deleteAccountingParametersMovementCodes(
        id: number
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .delete(
            `${TRUST_BUSINESS_API_URL}/accounting-block/params-accounting-account/${id}`
          )
          .then((response) => {
            success = response.data.success

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            success = false
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      async _clearDataCodes() {
        this.codes_business_trust_list = []
      },

      _setMaxId(num: number) {
        this.max_id = num
      },

      _setMaxIdParameters(num: number) {
        this.max_id_parameters = num
      },

      _setRowSelected(row: IAccountingParametersMovementCodes | null) {
        this.row_selected = row
      },
    },
  }
)

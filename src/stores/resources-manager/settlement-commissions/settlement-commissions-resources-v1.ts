/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { ISelectorResources } from '@/interfaces/customs/Filters'
import {
  IBillingThirdParty,
  IBillingTrustByBusinessCodeResource,
  ITypeCommisionsResource,
  IMovementCodesAccountingParametersResource,
  IAccountingParameter,
  IAccountingParameterOption,
  IBusinessTrustsCommissionsWithBusiness,
  ICalculationBase,
} from '@/interfaces/customs/resources/Settlement-commissions'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  commissions_class_catalog: [] as IResource[],
  commissions_class_catalog_with_name: [] as IResource[],
  commissions_type_catalog: [] as IResource[],
  commissions_type_catalog_with_name: [] as IResource[],
  commission_types: [] as ITypeCommisionsResource[],
  calculation_types: [] as IResource[],
  comission_settlement_statuses: [] as IResource[],
  periodicities: [] as IResource[],
  business_trusts_billing_trusts: [] as IResource[],
  business_trusts_commissions: [] as IResource[],
  business_trusts_thirdparty_billing: [] as IResource[],
  business_trusts_accounting_parameters: [] as IResource[],
  billing_trusts_by_business_code: [] as IBillingTrustByBusinessCodeResource[],
  third_party_billings: [] as IBillingThirdParty[],
  movement_codes_accounting_parameters:
    [] as IMovementCodesAccountingParametersResource[],
  accounting_parameters: [] as IAccountingParameterOption[],
  billing_trusts: [] as IResource[],
  business_trusts_commissions_with_business: [] as IResource[],
  calculation_bases: [] as ICalculationBase[],
})

export const useSettlementCommissionsResourcesV1 = defineStore(
  'settlement-commissions-resources-v1',
  {
    state: initialState,
    actions: {
      resetKeys(keys: (keyof ReturnType<typeof initialState>)[]) {
        const initial = initialState()
        const state = this.$state as unknown as Record<string, unknown>
        const initState = initial as Record<string, unknown>

        keys.forEach((key) => {
          state[key] = initState[key]
        })
      },

      assignCommissionsClassCatalog(comissionsClass: ISelectorResources[]) {
        this.commissions_class_catalog = comissionsClass.map((item) => ({
          label: item.name,
          value: item.id,
        }))

        this.commissions_class_catalog_with_name = comissionsClass.map(
          (item) => ({
            label: item.name,
            value: item.name,
          })
        )
      },
      assignCommissionsTypeCatalog(types: ISelectorResources[]) {
        this.commissions_type_catalog = types.map((type) => ({
          label: type.name,
          value: type.id,
        }))
        this.commissions_type_catalog_with_name = types.map((type) => ({
          label: type.name,
          value: type.name,
        }))
      },

      assignCommissionsType(types: []) {
        this.commission_types = types.map((type: ITypeCommisionsResource) => ({
          ...type,
          label: (type.code ?? '') + ' - ' + (type.description ?? ''),
          value: type.id ?? '',
          description: type.description,
        }))
      },

      assignCalculationTypes(types: string[]) {
        this.calculation_types = types.map((type) => ({
          label: type,
          value: type,
        }))
      },

      assignComissionSettlementStatuses(statuses: ISelectorResources[]) {
        this.comission_settlement_statuses = statuses.map((status) => ({
          label: status.name ?? '',
          value: status.id ?? '',
        }))
      },

      assignPeriodicities(types: string[]) {
        this.periodicities = types.map((item) => ({
          label: item,
          value: item,
        }))
      },

      assignThirdPartyBillings(thirdParties: never[]) {
        this.third_party_billings = thirdParties.map(
          (item: IBillingThirdParty) => ({
            ...item,
            label:
              item.third_party_document_type +
              ' - ' +
              item.third_party_document +
              ' - ' +
              item.third_party_name,
            value: Number(item.id),
          })
        )
      },

      assignBusinessTrustsBillingTrusts(businessTrusts: ISelectorResources[]) {
        this.business_trusts_billing_trusts = businessTrusts.map((item) => ({
          label:
            item.business_code_snapshot + ' - ' + item.business_name_snapshot,
          value: Number(item.business_code_snapshot),
        }))
      },

      assignBusinessTrustsCommissions(businessTrusts: ISelectorResources[]) {
        this.business_trusts_commissions = businessTrusts.map((item) => ({
          label:
            item.business_name_snapshot + ' - ' + item.business_code_snapshot,
          value: Number(item.business_code_snapshot),
        }))
      },

      assignBusinessTrustsThirdpartyBilling(
        businessTrusts: ISelectorResources[]
      ) {
        this.business_trusts_thirdparty_billing = businessTrusts.map(
          (item) => ({
            label:
              item.business_name_snapshot + ' - ' + item.business_code_snapshot,
            value: Number(item.business_code_snapshot),
          })
        )
      },

      assignBusinessTrustsAccountingParameters(
        businessTrusts: ISelectorResources[]
      ) {
        this.business_trusts_accounting_parameters = businessTrusts.map(
          (item) => ({
            label:
              item.business_code_snapshot + ' - ' + item.business_name_snapshot,
            value: Number(item.business_code_snapshot),
          })
        )
      },

      assignBussinessTrustsByBusinessCode(businessTrusts: never[]) {
        this.billing_trusts_by_business_code = businessTrusts.map(
          (item: IBillingTrustByBusinessCodeResource) => ({
            ...item,
            label: item.code + ' - ' + item.periodicity,
            value: Number(item.id),
          })
        )
      },

      assignMomentumCodesAccountingParameters(codes: never[]) {
        this.movement_codes_accounting_parameters = codes.map(
          (item: IMovementCodesAccountingParametersResource) => ({
            ...item,
            label: item.business_movement_name_snapshot ?? '',
            value: item.business_movement_code_snapshot,
          })
        )
      },

      assignAccountingParameters(accountingParameters: never[]) {
        this.accounting_parameters = accountingParameters.map(
          (item: IAccountingParameter) => ({
            ...item,
            label: item.business_movement_name_snapshot,
            value: item.billing_trusts_id,
          })
        )
      },

      assignBillingTrusts(billingTrusts: never[]) {
        this.billing_trusts = billingTrusts.map(
          (item: IBillingTrustByBusinessCodeResource) => ({
            ...item,
            label: item.code + ' - ' + item.periodicity,
            value: Number(item.id),
          })
        )
      },

      assignBusinessTrustsCommissionsWithBusiness(businessTrusts: never[]) {
        this.business_trusts_commissions_with_business = businessTrusts.map(
          (item: IBusinessTrustsCommissionsWithBusiness) => ({
            ...item,
            label: item.business_code + ' - ' + item.business_name,
            value: item.business_id,
          })
        )
      },

      async getResources(params: string) {
        const customHandlers: Record<
          string,
          (value: any, key: string | undefined) => void
        > = {
          commission_class_catalogs: this.assignCommissionsClassCatalog,
          commission_type_catalogs: this.assignCommissionsTypeCatalog,
          commission_types: this.assignCommissionsType,
          calculation_types: this.assignCalculationTypes,
          business_status_snapshot: this.assignComissionSettlementStatuses,
          periodicities: this.assignPeriodicities,
          third_party_billings: this.assignThirdPartyBillings,
          business_trusts_billing_trusts:
            this.assignBusinessTrustsBillingTrusts,
          business_trusts_commissions: this.assignBusinessTrustsCommissions,
          business_trusts_thirdparty_billing:
            this.assignBusinessTrustsThirdpartyBilling,
          business_trusts_accounting_parameters:
            this.assignBusinessTrustsAccountingParameters,
          billing_trusts_by_business_code:
            this.assignBussinessTrustsByBusinessCode,
          movement_codes_accounting_parameters:
            this.assignMomentumCodesAccountingParameters,
          accounting_parameters: this.assignAccountingParameters,
          billing_trusts: this.assignBillingTrusts,
          business_trusts_commissions_with_business:
            this.assignBusinessTrustsCommissionsWithBusiness,
        }

        await executeApi()
          .get(`${URL_PATH_SETTLEMENT_COMMISSIONS}/select-tables${params}`)
          .then((response) => {
            if (!response.status) return
            Object.entries(response.data.data).forEach(([key, value]) => {
              if (
                !value ||
                typeof value === 'string' ||
                value instanceof String
              )
                return
              if (customHandlers[key]) {
                customHandlers[key](value, key)
              } else if (key in this.$state) {
                ; (this as any)[key] = value
              }
            })
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
          })
      },
    },
  }
)

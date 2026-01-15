// Core - Pinia - API
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// interfaces
import { IErrors, IResource } from '@/interfaces/global'
import {
  HandlerFn,
  IGenericResource,
  IFixedAssetResource,
  IConfigurationType,
  IBusinessTrustType,
  IBusinessTrustSubtype,
  IBusinessAsset,
  IFilterImparment,
  IFixedAssetLocationsResource,
  IResponsibleResource,
  IResponsibleOption,
  IFixedAssetForSaleResource,
  IFixedAssetConfigurationSubtypeResource,
} from '@/interfaces/customs/resources'
import { ISelectorResources } from '@/interfaces/customs/Filters'

// imports
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'

// composables
import { useAlert, useShowError } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  code: [] as IResource[],
  asset_class: [] as IResource[],
  type: [] as IResource[],
  affectation_type: [] as ISelectorResources[],
  fixed_assets_source: [] as IFixedAssetResource[],
  asset_number: [] as IGenericResource[],
  configuration_type: [] as IFixedAssetResource[],
  transaction_side: [] as IFixedAssetResource[],
  novelty: [] as IFixedAssetResource[],
  business_trust_configuration_accountings: [] as IFixedAssetResource[],
  business_trusts_uge: [] as ISelectorResources[],
  uge: [] as ISelectorResources[],
  statuses_uge: [] as ISelectorResources[],
  physical_condition: [] as IFixedAssetResource[],
  asset_rating: [] as IFixedAssetResource[],
  visit_reason: [] as IFixedAssetResource[],
  business_trust_visit_records: [] as IFixedAssetResource[],
  configuration_types_visit_records: [] as IFixedAssetResource[],
  business_trusts_uge_impairment: [] as IConfigurationType[],
  business_trusts_type: [] as IBusinessTrustType[],
  business_trusts_subtypes: [] as IBusinessTrustSubtype[],
  fixed_asset_values: [] as IBusinessAsset[],
  approval_status: [] as IFixedAssetResource[],
  fixed_assets: [] as IFixedAssetResource[],
  approval_statuses: [] as IFixedAssetResource[],
  authorization_statuses: [] as IFixedAssetResource[],
  purchase_order_numbers: [] as IFixedAssetResource[],
  transaction_types: [] as IFixedAssetResource[],
  accounts_payable_status: [] as IFixedAssetResource[],
  transaction_type: [] as IFixedAssetResource[],
  novelty_configuration_accountings: [] as IFixedAssetResource[],
  impairments: [] as IFilterImparment[],
  impairments_business_trust: [] as IFilterImparment[],
  impairments_types: [] as IFilterImparment[],
  impairments_status: [] as IFilterImparment[],
  business_trust_register: [] as IFixedAssetResource[],
  configuration_type_register: [] as IFixedAssetResource[],
  record_type: [] as IFixedAssetResource[],
  register_status: [] as IFixedAssetResource[],
  fixed_asset_distribution_type: [] as IFixedAssetResource[],
  formated_locations: [] as IFixedAssetResource[],
  formated_third_parties: [] as IFixedAssetResource[],
  fixed_asset_statuses: [] as IFixedAssetResource[],
  fixed_asset_record_type: [] as IFixedAssetResource[],
  transactions_configuration_subtypes: [] as IFixedAssetResource[],
  fixed_asset_reference: [] as IFixedAssetResource[],
  fixed_asset_measurement_model: [] as IFixedAssetResource[],
  location_types: [] as IFixedAssetResource[],
  locations: [] as IFixedAssetLocationsResource[],
  consolidation_sources: [] as IGenericResource[],
  fixed_assets_types: [] as IGenericResource[],
  fixed_assets_subtypes: [] as IGenericResource[],
  business_trust_account_structures: [] as IGenericResource[],
  fixed_assets_types_new: [] as IGenericResource[],
  fixed_assets_subtypes_new: [] as IGenericResource[],
  responsibles_by_fixed_assets: [] as IResponsibleResource[],
  responsibles_by_fixed_assets_options: [] as IResponsibleOption[],
  statuses_fixed_assets: [] as ISelectorResources[],
  novelty_code: [] as IFixedAssetResource[],
  fixed_assets_for_sales: [] as IFixedAssetForSaleResource[],
  fixed_assets_configuration_subtypes:
    [] as IFixedAssetConfigurationSubtypeResource[],
})

export const useFixedAssetsResourcesV1 = defineStore(
  'fixed-assets-resources-v1',
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
      assignCode(configuration_type_code: []) {
        this.code =
          configuration_type_code.map(
            (item: ISelectorResources & { code: number }) => ({
              id: item.id,
              value: item.code,
              label: String(item.code ?? ''),
              configuration_type_code: item.code,
            })
          ) ?? []
      },
      assignAssetClass(asset_class: []) {
        this.asset_class =
          asset_class.map(
            (item: ISelectorResources & { asset_class: string }) => ({
              id: item.id,
              value: item.value,
              label: item.label ?? '',
              asset_class: item.value,
            })
          ) ?? []
      },
      assignType(type: []) {
        this.type =
          type.map((item: ISelectorResources & { type: string }) => ({
            id: item.id,
            value: item.value,
            label: item.label ?? '',
            type: String(item.value),
          })) ?? []
      },
      assingAffectationTypes(affectation_type: ISelectorResources[]) {
        this.affectation_type = affectation_type.map(
          (item: ISelectorResources) => ({
            ...item,
            label: item.label,
            value: item.value,
          })
        )
      },

      assingConfigurationTypeClass(configuration_type: IFixedAssetResource[]) {
        this.configuration_type = configuration_type.map(
          (item: IFixedAssetResource) => ({
            ...item,
            label: item.label,
            value: item.id,
          })
        )
      },

      assignConfigurationTransactionSide(
        transaction_side: IFixedAssetResource[]
      ) {
        this.transaction_side = transaction_side.map(
          (item: IFixedAssetResource) => ({
            ...item,
            label: item.label,
            value: item.value,
          })
        )
      },

      assignConfigurationNovelty(novelty: IFixedAssetResource[]) {
        this.novelty = novelty.map((item: IFixedAssetResource) => ({
          ...item,
          label: `${item.code} - ${item.description}`,
          value: item.id,
        }))
      },

      assignBusinesTrustConfigurationAccountings(
        business_trust_configuration_accountings: IFixedAssetResource[]
      ) {
        this.business_trust_configuration_accountings =
          business_trust_configuration_accountings.map(
            (item: IFixedAssetResource) => ({
              ...item,
              value: item.value,
            })
          )
      },

      assignBusinessUge(business_trusts_uge: ISelectorResources[]) {
        this.business_trusts_uge = business_trusts_uge.map(
          (item: ISelectorResources) => ({
            ...item,
            label: item.label ?? item.name ?? '',
            value: item.value ?? item.id ?? null,
          })
        )
      },

      assignTypeUge(uge: ISelectorResources[]) {
        this.uge = uge.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.id} - ${item.description}`,
          value: item.id,
        }))
      },
      assigStatusUge(statuses_uge: ISelectorResources[]) {
        this.statuses_uge = statuses_uge.map((item: ISelectorResources) => ({
          ...item,
          label: item.status,
          value: item.id,
        }))
      },

      assignPhysicalCondition(physical_condition: IFixedAssetResource[]) {
        this.physical_condition = physical_condition.map(
          (item: IFixedAssetResource) => ({
            ...item,
          })
        )
      },

      assignAssetRating(asset_rating: IFixedAssetResource[]) {
        this.asset_rating = asset_rating.map((item: IFixedAssetResource) => ({
          ...item,
        }))
      },

      assignVisitReason(visit_reason: IFixedAssetResource[]) {
        this.visit_reason = visit_reason.map((item: IFixedAssetResource) => ({
          ...item,
        }))
      },

      assingBusinessTrustVisitRecords(
        business_trust_visit_records: IFixedAssetResource[]
      ) {
        this.business_trust_visit_records = business_trust_visit_records.map(
          (item: IFixedAssetResource) => ({
            ...item,
            label: `${item.business_code} - ${item.name}`,
            value: item.id,
          })
        )
      },

      assignConfigurationTypeVisitRecords(
        configuration_types_visit_records: IFixedAssetResource[]
      ) {
        this.configuration_types_visit_records =
          configuration_types_visit_records.map(
            (item: IFixedAssetResource) => ({
              ...item,
              label: `${item.code} - ${item.description}`,
              value: item.id,
            })
          )
      },

      assingType(type: []) {
        this.type = type
      },

      assingAssetNumber(asset_number: []) {
        this.asset_number =
          asset_number.map((item: IGenericResource) => ({
            ...item,
            value: item.id ?? '',
            label: item.label,
          })) ?? []
      },

      assignApprovalStatus(approval_statuses: IFixedAssetResource[]) {
        this.approval_statuses =
          approval_statuses.map((item: IFixedAssetResource) => ({
            ...item,
            value: item.value ?? '',
            label: item.label,
          })) ?? []
      },
      assignAuthorizationStatus(authorization_statuses: IFixedAssetResource[]) {
        this.authorization_statuses =
          authorization_statuses.map((item: IFixedAssetResource) => ({
            ...item,
            value: item.value ?? '',
            label: item.label,
          })) ?? []
      },
      assignPurchaseOrderNumbers(
        purchase_order_numbers: IFixedAssetResource[]
      ) {
        this.purchase_order_numbers =
          purchase_order_numbers.map((item: IFixedAssetResource) => ({
            ...item,
            value: item.id ?? '',
            label: item.name,
          })) ?? []
      },
      assignTransactionTypes(transaction_types: IFixedAssetResource[]) {
        this.transaction_types =
          transaction_types.map((item: IFixedAssetResource) => ({
            ...item,
            value: item.value ?? '',
            label: item.label,
          })) ?? []
      },
      assignConsolidatioSources(consolidation_sources: IGenericResource[]) {
        this.consolidation_sources =
          consolidation_sources.map((item: IGenericResource) => ({
            ...item,
            value: item.value ?? '',
            label: item.label,
          })) ?? []
      },
      assignAssetTypes(fixed_assets_types: IGenericResource[]) {
        this.fixed_assets_types =
          fixed_assets_types.map((item: IGenericResource) => ({
            ...item,
            value: item.value ?? '',
            label: item.label,
          })) ?? []

        this.fixed_assets_types_new =
          fixed_assets_types.map((item: IGenericResource) => ({
            ...item,
            value: item.value ?? '',
            label: item.label,
          })) ?? []
      },
      assignAssetSubtypes(fixed_assets_subtypes: IGenericResource[]) {
        this.fixed_assets_subtypes =
          fixed_assets_subtypes.map((item: IGenericResource) => ({
            ...item,
            value: item.value ?? '',
            label: item.label,
          })) ?? []

        this.fixed_assets_subtypes_new =
          fixed_assets_subtypes.map((item: IGenericResource) => ({
            ...item,
            value: item.value ?? '',
            label: item.label,
          })) ?? []
      },

      assignResponsiblesAssets(
        responsibles_by_fixed_assets: IResponsibleResource[]
      ) {
        // 1. Guardas la data cruda
        this.responsibles_by_fixed_assets = responsibles_by_fixed_assets

        // 2. Generas las opciones del selector
        this.responsibles_by_fixed_assets_options = responsibles_by_fixed_assets
          .filter((item) => !!item.responsible)
          .map((item): IResponsibleOption => {
            const document = item.responsible?.document ?? ''
            const businessName =
              item.responsible?.legal_person?.business_name ?? ''

            return {
              id: item.responsible_id,
              value: item.responsible_id,
              document,
              business_name: businessName,
              label: `${document} - ${businessName}`.trim(),
            }
          })
      },

      assignAccountsPayableStatus(
        accounts_payable_status: IFixedAssetResource[]
      ) {
        this.accounts_payable_status =
          accounts_payable_status.map((item: IFixedAssetResource) => ({
            ...item,
            value: item.value ?? '',
            label: item.label,
          })) ?? []
      },
      assignTransactionType(transaction_type: IFixedAssetResource[]) {
        this.transaction_type =
          transaction_type.map((item: IFixedAssetResource) => ({
            ...item,
            value: item.id ?? '',
            label: item.name,
          })) ?? []
      },

      assignNoveltyConfigurationAccountings(
        novelty_configuration_accountings: []
      ) {
        this.novelty_configuration_accountings =
          novelty_configuration_accountings.map(
            (item: IFixedAssetResource) => ({
              ...item,
              value: item.id,
              label: `${item.code} - ${item.description}`,
            })
          ) ?? []
      },

      assingBusiness_trusts_uge_impairment(
        business_trusts_uge_impairment: IConfigurationType[]
      ) {
        this.business_trusts_uge_impairment =
          business_trusts_uge_impairment.map((item) => ({
            ...item,
            value: item.business_trust_id,
            label: item.business_info,
          }))

        this.business_trusts_type = business_trusts_uge_impairment.flatMap(
          (item) =>
            item.configuration_types.map((t) => ({
              ...t,
              business_trust_id: item.business_trust_id,
              value: t.type_id,
              label: t.type_info,
            }))
        )

        this.business_trusts_subtypes = business_trusts_uge_impairment.flatMap(
          (item) =>
            item.configuration_types.flatMap((type) =>
              type.subtypes.map((st) => ({
                ...st,
                business_trust_id: item.business_trust_id,
                type_id: type.type_id,
                value: st.subtype_id,
                label: st.subtype_info,
              }))
            )
        )
      },

      assingFixed_asset_values(fixed_asset_values: IBusinessAsset[]) {
        this.fixed_asset_values = fixed_asset_values.map(
          (item: IBusinessAsset) => ({
            ...item,
            label: `${item.id} - ${item.reference}`,
            value: item.id,
          })
        )
      },
      assingImpairments(impairments: IFilterImparment[]) {
        this.impairments = impairments.map((item: IFilterImparment) => ({
          ...item,
          label: item.id,
          value: item.id,
        }))
      },
      assingImpairmentsBusiness(
        impairments_business_trust: IFilterImparment[]
      ) {
        this.impairments_business_trust = impairments_business_trust.map(
          (item: IFilterImparment) => ({
            ...item,
            label: item.raw,
            value: item.id,
          })
        )
      },
      assignFixedAssets(fixed_assets: IFixedAssetResource[]) {
        this.fixed_assets = fixed_assets.map((item: IFixedAssetResource) => ({
          ...item,
          label:
            item.label ?? item.name ?? item.description ?? `Activo ${item.id}`,
          value: item.id,
        }))
      },

      assignLocationTypes(location_types: IFixedAssetResource[]) {
        this.location_types = location_types.map(
          (item: IFixedAssetResource) => ({
            ...item,
            label: item.name,
            value: item.id,
          })
        )
      },

      assingImpairmentsTypes(impairments_types: IFilterImparment[]) {
        this.impairments_types = impairments_types.map(
          (item: IFilterImparment) => ({
            ...item,
            label: item.label,
            value: item.id,
          })
        )
      },
      assingImpairmentsStatus(impairments_status: IFilterImparment[]) {
        this.impairments_status = impairments_status.map(
          (item: IFilterImparment) => ({
            ...item,
            label: item.label,
          })
        )
      },
      assignLocations(locations: IFixedAssetLocationsResource[]) {
        this.locations = locations.map(
          (item: IFixedAssetLocationsResource) => ({
            ...item,
            label: item.address,
            value: item.id,
          })
        )
      },
      assignStatusesFixedAssets(statuses_fixed_assets: ISelectorResources[]) {
        this.statuses_fixed_assets = statuses_fixed_assets.map(
          (item: ISelectorResources) => ({
            ...item,
            label: item.status ?? item.label ?? '',
            value: item.id,
          })
        )
      },
      assignNoveltyCode(novelty_code: IFixedAssetResource[]) {
        this.novelty_code =
          novelty_code.map((item: IFixedAssetResource) => ({
            ...item,
            label: `${item.id} - ${item.description}`,
            value: item.id,
          })) ?? []
      },

      assignFixedAssetsForSales(
        fixed_assets_for_sales: IFixedAssetForSaleResource[]
      ) {
        this.fixed_assets_for_sales = fixed_assets_for_sales.map(
          (item: IFixedAssetForSaleResource) => ({
            ...item,
            label: `${item.id} - ${item.license_plate}`,
            value: item.id,
          })
        )
      },
      assignFixedAssetsConfigurationSubtypes(
        fixed_assets_configuration_subtypes: IFixedAssetConfigurationSubtypeResource[]
      ) {
        this.fixed_assets_configuration_subtypes =
          fixed_assets_configuration_subtypes.map(
            (item: IFixedAssetConfigurationSubtypeResource) => ({
              ...item,
              value: item.fixed_asset_code,
              label:
                item.label ??
                `${item.fixed_asset_code} - ${item.type_description}`,
            })
          ) ?? []
        this.business_trusts_uge_impairment.map((item: IConfigurationType) => ({
          ...item,
          value: item.business_trust_id,
          label: item.business_info,
        }))

        this.business_trusts_type =
          this.business_trusts_uge_impairment?.flatMap(
            (item) =>
              item.configuration_types?.map((t) => ({
                ...t,
                business_trust_id: item.business_trust_id,
                value: t.type_id,
                label: t.type_info,
              })) ?? []
          ) ?? []

        // Extraer subtypes
        this.business_trusts_subtypes =
          this.business_trusts_uge_impairment?.flatMap(
            (item) =>
              item.configuration_types?.flatMap(
                (type) =>
                  type.subtypes?.map((st) => ({
                    ...st,
                    business_trust_id: item.business_trust_id,
                    type_id: type.type_id,
                    value: st.subtype_id,
                    label: st.subtype_info,
                  })) ?? []
              ) ?? []
          ) ?? []
      },

      assignTransactionsConfigurationSubtypes(transactions_configuration_subtypes: IFixedAssetResource[]) {
        this.transactions_configuration_subtypes = transactions_configuration_subtypes.map((item: IFixedAssetResource) => ({
          ...item,
          label: item.label,
          value: item.transaction_code ?? item.id,
        }))
      },

      async getResources(params: string) {
        const customHandlers: Record<string, HandlerFn> = {
          affectation_type: this.assingAffectationTypes as HandlerFn,
          asset_number: this.assingAssetNumber as HandlerFn,
          configuration_type: this.assingConfigurationTypeClass as HandlerFn,
          transaction_side: this
            .assignConfigurationTransactionSide as HandlerFn,
          novelty: this.assignConfigurationNovelty as HandlerFn,
          business_trust_configuration_accountings: this
            .assignBusinesTrustConfigurationAccountings as HandlerFn,
          configuration_type_code: this.assignCode as HandlerFn,
          business_trusts_uge: this.assignBusinessUge as HandlerFn,
          uge: this.assignTypeUge as HandlerFn,
          asset_class: this.assignAssetClass as HandlerFn,
          type: this.assignType as HandlerFn,
          fixed_assets_source: this.assingType as HandlerFn,

          statuses_uge: this.assigStatusUge as HandlerFn,
          physical_condition: this.assignPhysicalCondition as HandlerFn,
          asset_rating: this.assignAssetRating as HandlerFn,
          visit_reason: this.assignVisitReason as HandlerFn,
          business_trust_visit_records: this
            .assingBusinessTrustVisitRecords as HandlerFn,
          configuration_types_visit_records: this
            .assignConfigurationTypeVisitRecords as HandlerFn,
          business_trusts_uge_impairment: this
            .assingBusiness_trusts_uge_impairment as HandlerFn,
          fixed_asset_values: this.assingFixed_asset_values as HandlerFn,
          approval_status: this.assignApprovalStatus as HandlerFn,
          purchase_order_numbers: this.assignPurchaseOrderNumbers as HandlerFn,
          accounts_payable_status: this
            .assignAccountsPayableStatus as HandlerFn,
          transaction_type: this.assignTransactionType as HandlerFn,
          novelty_configuration_accountings: this
            .assignNoveltyConfigurationAccountings as HandlerFn,
          impairments: this.assingImpairments as HandlerFn,
          impairments_business_trust: this
            .assingImpairmentsBusiness as HandlerFn,
          impairments_types: this.assingImpairmentsTypes as HandlerFn,
          impairments_statuses: this.assingImpairmentsStatus as HandlerFn,
          fixed_assets: this.assignFixedAssets as HandlerFn,
          approval_statuses: this.assignApprovalStatus as HandlerFn,
          authorization_statuses: this.assignAuthorizationStatus as HandlerFn,

          transaction_types: this.assignTransactionTypes as HandlerFn,

          location_types: this.assignLocationTypes as HandlerFn,
          locations: this.assignLocations as HandlerFn,

          consolidation_sources: this.assignConsolidatioSources as HandlerFn,
          fixed_assets_types: this.assignAssetTypes as HandlerFn,
          fixed_assets_subtypes: this.assignAssetSubtypes as HandlerFn,
          responsibles_by_fixed_assets: this
            .assignResponsiblesAssets as HandlerFn,
          responsibles_by_fixed_assets_options: this
            .assignResponsiblesAssets as HandlerFn,
          statuses_fixed_assets: this.assignStatusesFixedAssets as HandlerFn,
          novelty_code: this.assignNoveltyCode as HandlerFn,
          fixed_assets_for_sales: this.assignFixedAssetsForSales as HandlerFn,
          transactions_configuration_subtypes: this.assignTransactionsConfigurationSubtypes as HandlerFn,
          fixed_assets_configuration_subtypes: this
            .assignFixedAssetsConfigurationSubtypes as HandlerFn,
        }

        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/select-tables${params}`)
          .then((response) => {
            if (!response.status) return
            const state = this.$state as unknown as Record<string, unknown>
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
                state[key] = value
              }
            })
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
          })
      },
    },
    persist: true,
  }
)

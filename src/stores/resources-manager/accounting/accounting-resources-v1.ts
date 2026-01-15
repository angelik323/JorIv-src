/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import {
  ISelectorResources,
  IStructureChartAccount,
  IAccountStructureResource,
  IThirdPartyResource,
  IAccountChartResource,
  IBusinessTrustResource,
  IReceiptTypeResource,
  IVoucherStatusResource,
  ICatalogLimitGroups,
  IStructure,
  IRevertVouchersResource,
  IAccountClosingParameterThirdPartyResource,
  IStatusResource,
  IBusinessWithAccounting,
  IRawBusinessTrust,
  IAnnualPeriodClosingResource,
  IResourceEquivalenceStructure,
  IGenericResource,
  IAccountChartByAccountStructure,
  IBusinessTrustPerClosurePeriodResource,
  IPucAccountingResource,
  IStructureLevel,
  IAccountStructureTrust,
  IBudgetAccountStructureResource,
  IAccountingStructureResource,
  IFormattedThirdPartyResource,
  IBusinessTrustPrincipalStructureResource,
  IAvailableCostCenterStructuresResource,
  IAccountClosingParameterThirdPartyResourceFormat,
  IAccountGroupResource,
  IBusinessTransferParameter,
  IAccountStructures,
  IBusinessTrustSelectorResource,
  IChartStructure,
  IConsecutiveResource,
  IBudgetStructuresGenerate,
  IRestatementGenericResource,
  IConsolidateProcessResource,
  IVoucherUploadsResource,
  IBusinessTrustForPeriodOpeningResource,
  IAccountingBusinessResource,
} from '@/interfaces/customs'
import { IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { formatDate } = useUtils()

const initialState = () => ({
  version: 'v1',
  account_chart_types: [] as IResource[],
  account_chart_structures: [] as IResource[],
  account_chart_options: [] as IResource[],
  account_chart_purposes: [] as IResource[],
  account_chart_by_account_structure: [] as IAccountChartByAccountStructure[],
  account_group_by_code: [] as IAccountGroupResource[],
  account_charts_by_structure: [] as IGenericResource[],
  account_structures_available: [] as IResource[],
  account_structure_types: [] as IResource[],
  account_structure_statuses: [] as IResource[],
  account_structures: [] as IResource[],
  account_structures_code_purpose: [] as IResource[],
  cost_center_structure_options: [] as IResource[],
  vouchers_validation_status: [] as IStatusResource[],
  account_structures_active: [] as IResource[],
  catalog_limit_types: [] as IResource[],
  catalog_limit_groups: {} as ICatalogLimitGroups,
  catalog_limit_natures: [] as IResource[],
  account_closing_events: [] as IResource[],
  account_closing_natures: [] as IResource[],
  available_accounting_structures: [] as IAccountStructureResource[],
  account_structures_for_params: [] as IAccountStructureResource[],
  accounting_closing_parameter_account_chart: [] as IResource[],
  accounting_closing_parameter_third_parties:
    [] as IAccountClosingParameterThirdPartyResource[],
  accounting_closing_parameter_cost_centers: [] as IResource[],
  accounts_charts: [] as IAccountChartResource[],
  third_parties: [] as IThirdPartyResource[],
  third_parties_label: [] as IThirdPartyResource[],
  business_trust: [] as IBusinessTrustResource[],
  sub_receipt_types: [] as ISelectorResources[],
  receipt_types: [] as IReceiptTypeResource[],
  homologation_receipt_types: [] as IReceiptTypeResource[],
  deferred_receipt_types: [] as IReceiptTypeResource[],
  voucher_natures: [] as IResource[],
  voucher_status: [] as IVoucherStatusResource[],
  cost_center: [] as IResource[],
  available_cost_center_structures: [] as IResource[],
  available_cost_center_structures_code_label:
    [] as IAvailableCostCenterStructuresResource[],
  available_account_charts: [] as IResource[],
  cost_center_types: [] as IResource[],
  cost_center_structures: [] as IResource[],
  cost_center_structures_id_value: [] as IResource[],
  tree_status: [] as IResource[],
  bussines_parent: [] as IResource[],
  bussines_child: [] as IResource[],
  account_structures_with_purpose: [] as ISelectorResources[],
  accounting_chart_operative_by_structure: [] as IResource[],
  business_trust_account: [] as IAccountStructureTrust[],
  business_trusts_with_description_by_account_structure:
    [] as IBusinessTrustResource[],
  business_trusts_with_description_by_account_structure_code:
    [] as IBusinessTrustResource[],
  third_parties_by_business: [] as IThirdPartyResource[],
  business_trust_label: [] as ISelectorResources[],
  business_trust_label_sort_by_code: [] as ISelectorResources[],
  deferred_impairment_account_structures: [] as ISelectorResources[],
  deferred_impairment_business_trusts: [] as ISelectorResources[],
  deferred_impairment_range_types: [] as ISelectorResources[],
  deferred_impairment_natures: [] as ISelectorResources[],
  deferred_impairment_accounts: [] as ISelectorResources[],
  deferred_impairment_receipt_types: [] as ISelectorResources[],
  deferred_impairment_sub_receipt_types: [] as ISelectorResources[],
  deferred_schedule_business_trusts: [] as IBusinessTrustResource[],
  puc_accounts_by_structure: [] as ISelectorResources[],
  account_by_structure: [] as ISelectorResources[],
  puc_source_account_structures: [] as ISelectorResources[],
  puc_equivalences_account_structures: [] as ISelectorResources[],
  puc_equivalence_fiscal_account_structures: [] as ISelectorResources[],
  puc_account_equivalence_types: [] as ISelectorResources[],
  account_structures_active_revert_vouchers: [] as IResource[],
  daily_closing_business_by_account_structure: [] as IRevertVouchersResource[],
  cost_structures_by_chart_account: [] as IResource[],
  cost_center_codes_by_structure: [] as IResource[],
  accounting_third_parties_with_document: [] as IResource[],
  accounts_by_structure: [] as IResource[],
  account_structures_for_settlement: [] as IResource[],
  receipt_types_by_structure: [] as IReceiptTypeResource[],
  sub_receipt_types_by_type: [] as IReceiptTypeResource[],
  businesses_by_reexpression: [] as IResource[],
  structure_by_business: [] as IResource[],
  accounts_by_business: [] as IResource[],
  business_by_code: [] as ISelectorResources[],
  account_structures_by_businness: [] as ISelectorResources[],
  accounting_structure_from_to_business: [] as IResource[],
  account_chart_structure_details: [] as IResource[],
  structure_levels: [] as IStructureLevel[],
  structure_levels_report: [] as IGenericResource[],
  business_trusts_basic: [] as IResource[],
  amount_types: [] as ISelectorResources[],
  business_trusts_with_description: [] as IBusinessWithAccounting[],
  business_parent: [] as IBusinessWithAccounting[],
  consolidator_business_trust_with_account_structure:
    [] as ISelectorResources[],
  receipt_types_manual_without_cancellation_subtypes:
    [] as ISelectorResources[],
  voucher_consecutives_by_business_trust_and_receipt_type:
    [] as ISelectorResources[],
  voucher_statuses_v2: [] as ISelectorResources[],
  voucher_type_types: [] as ISelectorResources[],
  account_structures_accounting_accounts: [] as IResource[],
  not_consolidator_business_trust: [] as IResource[],
  account_chart_structure_accounting: [] as IResource[],
  account_structures_available_for_store: [] as IResource[],
  template: [] as ISelectorResources[],
  source_account_structures: [] as IResourceEquivalenceStructure[],
  equivalent_account_structures: [] as IResourceEquivalenceStructure[],
  patrimony_limit_type: [] as IGenericResource[],
  voucher_consecutives_codes: [] as IResourceEquivalenceStructure[],
  voucher_consecutives_ids: [] as IResourceEquivalenceStructure[],
  business_trusts_per_clousure_period:
    [] as IBusinessTrustPerClosurePeriodResource[],
  third_parties_by_account_range: [] as IResource[],
  cost_centers_by_account_range: [] as IResource[],
  business_trust_receipt_types: [] as IResource[],
  business_trust_structures: [] as IResource[],
  accounts_by_structure_id: [] as IPucAccountingResource[],
  report_types: [] as IResource[],
  opening_record_structures: [] as IResource[],
  accounting_chart_operative_by_structure_annual: [] as IResource[],
  vouchers_mappings_process_name_types: [] as IGenericResource[],
  vouchers_mappings_process_types: [] as IGenericResource[],
  business_trusts_by_account_structure_and_equivalence:
    [] as IBusinessTrustResource[],
  vouchers_mapping_process_statuses: [] as IStatusResource[],
  vouchers_mapping_process_logs_statuses: [] as IStatusResource[],
  third_parties_by_account_range_period_anual: [] as IResource[],
  business_trusts_by_date_range: [] as IGenericResource[],
  account_structures_code_active_revert_vouchers: [] as IResource[],
  budget_item_structure: [] as IGenericResource[],
  chart_of_account_structures: [] as IGenericResource[],
  resource_catalog_structures: [] as IGenericResource[],
  accounting_account_structures: [] as IAccountingStructureResource[],
  business_trusts_for_period_opening:
    [] as IBusinessTrustForPeriodOpeningResource[],
  third_parties_formatted: [] as IGenericResource[],
  type_operators: [] as IGenericResource[],
  type_nature: [] as IGenericResource[],
  catalog_limit_groups_balance: [] as IGenericResource[],
  catalog_limit_groups_results: [] as IGenericResource[],
  catalog_limit_groups_control: [] as IGenericResource[],
  account_structures_payment_concepts: [] as IAccountStructures[],
  budget_account_structures: [] as IGenericResource[],
  cost_center_active: [] as IGenericResource[],
  business_trust_principal_structures: [] as IGenericResource[],
  account_closing_natures_full: [] as IGenericResource[],
  closing_third_party_types: [] as IGenericResource[],
  accounts_chart: [] as IGenericResource[],
  account_structures_accounting_concepts: [] as IGenericResource[],
  accounting_closing_parameter_third_parties_format:
    [] as IFormattedThirdPartyResource[],
  sub_receipt_types_voucher: [] as ISelectorResources[],
  validation_vouchers_process_result: [] as IGenericResource[],
  account_structures_reexpresion: [] as IGenericResource[],
  business_trusts_by_structure_and_closing_type:
    [] as IRestatementGenericResource[],
  status_by_id: [] as IGenericResource[],
  liability_accounts: [] as IResource[],
  expense_accounts: [] as IResource[],
  business_trusts_selector: [] as IBusinessTrustSelectorResource[],

  business_transfer_trusts_selector: [] as IGenericResource[],
  cost_center_structures_by_business_and_account_structure:
    [] as IAccountStructures[],
  account_chart_structure_code_accounting: [] as IChartStructure[],
  voucher_consecutives_pendings_to_authorization: [] as IConsecutiveResource[],
  budget_structures_generate: [] as IBudgetStructuresGenerate[],
  business_trusts_to_consolidate: [] as IAccountingBusinessResource[],
  consolidate_status: [] as IGenericResource[],
  vouchers_upload_process_statuses: [] as ISelectorResources[],
  vouchers_uploaded_codes: [] as IGenericResource[],
  business_trusts_all_permission: [] as IBusinessTrustSelectorResource[],
  report_modules: [] as IGenericResource[],
  business_classes: [] as IGenericResource[],
  unit_businesses: [] as IGenericResource[],
  business_list_without_permissions: [] as IBusinessTrustResource[],
  levels_structure: [] as IGenericResource[],
  consolidate_process: [] as IGenericResource[],
  process_consolidate_status: [] as IConsolidateProcessResource[],
  budget_structures: [] as IBudgetStructuresGenerate[],
  budget_structures_area: [] as IBudgetStructuresGenerate[],
  anullment_voucher_statuses: [] as IGenericResource[],
  voucher_authorization_statuses: [] as IGenericResource[],
  reporte_third_filter_type_person: [] as IGenericResource[],
  receipt_types_with_sub_types: [] as IAccountingStructureResource[],
  voucher_uploads: [] as IVoucherUploadsResource[],
  presentation_business_report_headers: [] as IGenericResource[],
  responsible_report_signatures: [] as IGenericResource[],
  type_report_signatures: [] as IGenericResource[],
  report_template_signatures: [] as IGenericResource[],
  report_template_logos: [] as IGenericResource[],
  template_reports: [] as ISelectorResources[],
})

export const useAccountingResourcesV1 = defineStore('accounting-resources-v1', {
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
    assignMapIdName(resources: [], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: ISelectorResources | IResource) => ({
          ...item,
          value: item.id,
          label: `${item.name}`,
        })) || []
    },
    assignMapLabelValue(resources: [], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: ISelectorResources | IResource) => ({
          ...item,
          value: item.id,
          label: `${item.name}`,
        })) || []
    },
    assignAccountStructureStatuses(account_structure_statuses: []) {
      this.account_structure_statuses =
        account_structure_statuses?.map((element: IStatusResource) => {
          return {
            ...element,
            value: element.id ?? '',
            label: `${element.status}`,
          }
        }) ?? []
    },
    assignAccountStructureTypes(source_account_structures: []) {
      this.source_account_structures =
        source_account_structures?.map((element: IResource) => {
          return {
            ...element,
            value: element.id ?? '',
            label: `${element.type}`,
          }
        }) ?? []
    },
    assignAccountStructures(account_structures: []) {
      this.account_structures =
        account_structures?.map((item: IResource) => {
          return {
            ...item,
            value: item.id ?? '',
            label: `${item.code} - ${item.purpose ?? item.structure}`,
          }
        }) ?? []

      this.account_structures_code_purpose =
        account_structures
          ?.reduce((acc: IResource[], item: IResource) => {
            if (!acc.some((i) => i.structure === item.structure)) {
              acc.push({
                ...item,
                value: `${item.structure}`,
                label: `${item.structure}`,
              })
            }
            return acc
          }, [])
          .sort((a, b) => (a.value < b.value ? -1 : 1)) ?? []

      this.cost_center_structure_options =
        account_structures.map((item: IResource) => ({
          ...item,
          label: `${item.structure}`,
          value: item.id ?? '',
          purpose: item.purpose,
          type: item.type,
        })) ?? []

      this.account_structures_payment_concepts =
        account_structures?.map((item: IAccountStructures) => {
          return {
            ...item,
            value: item.id ?? '',
            label: `${item.code} - ${item.purpose}`,
          }
        }) ?? []

      this.budget_account_structures =
        account_structures.map((item: IAccountStructureResource) => ({
          ...item,
          label: `${item.code} - ${item.purpose}`,
          value: item.id ?? '',
        })) ?? []

      this.account_structures_reexpresion = account_structures.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.structure} - ${item.purpose}`,
        })
      )
    },
    assignAvailableAccountingStructures(available_accounting_structures: []) {
      this.available_accounting_structures =
        available_accounting_structures?.map(
          (item: IAccountStructureResource) => ({
            ...item,
            value: item.id,
            label: `${item.structure}`,
          })
        ) ?? []

      this.account_structures_for_params = available_accounting_structures.map(
        (item: IAccountStructureResource) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.structure} - ${item.purpose}`,
        })
      )
    },
    assignAccountingClosingParameterAccountChart(
      accounting_closing_parameter_account_chart: []
    ) {
      this.accounting_closing_parameter_account_chart =
        accounting_closing_parameter_account_chart?.map((item: IResource) => ({
          value: item.id ?? '',
          label: `${item.code}`,
        })) ?? []
    },
    assignAccountingClosingParameterThirdParties(
      accounting_closing_parameter_third_parties: []
    ) {
      this.accounting_closing_parameter_third_parties =
        accounting_closing_parameter_third_parties?.map(
          (item: IAccountClosingParameterThirdPartyResource) => ({
            ...item,
            value: item.id,
            label: `${item.document ?? ''} - ${
              item.name ?? item.business_name
            } ${item.last_name ?? ''}`,
          })
        ) ?? []
      this.accounting_closing_parameter_third_parties_format =
        accounting_closing_parameter_third_parties?.map(
          (item: IAccountClosingParameterThirdPartyResourceFormat) => ({
            ...item,
            value: item.id ?? '',
            label:
              item.document_type?.abbreviation +
              ' - ' +
              item.document +
              ' - ' +
              item.name,
            formatted_name: item.label ?? '',
          })
        )
    },
    assignAccountingClosingParameterCostCenters(
      accounting_closing_parameter_cost_centers: []
    ) {
      this.accounting_closing_parameter_cost_centers =
        accounting_closing_parameter_cost_centers?.map((item: IResource) => ({
          value: item.id ?? '',
          label: `${item.name}`,
        })) ?? []
    },
    assignAccountStructuresAvailable(account_structures_available: []) {
      this.account_structures_available =
        account_structures_available.map((item: IStructureChartAccount) => ({
          ...item,
          value: item.id ?? '',
          label: item.purpose
            ? `${item.code} - ${item.purpose}`
            : `${item.code ?? 'Sin información'}`,
          nature: item.status?.status ?? '',
          name: `${item.purpose}`,
        })) ?? []
    },
    assignAccountCharts(accounts_charts: []) {
      this.accounts_charts =
        accounts_charts?.map((item: IAccountChartResource) => ({
          ...item,
          label: `${item.code} - ${item.name}`,
          value: item.id,
        })) ?? []
    },
    assignAccountingThirdParties(third_parties: []) {
      this.third_parties =
        third_parties.map((item: IThirdPartyResource) => ({
          ...item,
          label: `${item.document} - ${item.commercial_registration ?? ''}`,
          value: item.id,
        })) ?? []

      this.third_parties_label =
        third_parties.map((item: IThirdPartyResource) => ({
          ...item,
          label: `${item.document_type?.abbreviation} - ${item.document} - ${
            item.natural_person
              ? item.natural_person.full_name ?? ''
              : item.legal_person?.business_name ?? ''
          }`,
          value: item.id,
        })) ?? []
    },
    assignAccountingBusinessTrust(business_trust: []) {
      this.business_trust =
        business_trust.map((item: IBusinessTrustResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.business_code} - ${item.name}`,
          code: item.business_code,
        })) ?? []

      this.business_trust_label = business_trust
        .sort((a: ISelectorResources, b: ISelectorResources) => a.id - b.id)
        .map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.business_code} - ${item.name}`,
        }))

      this.business_trust_label_sort_by_code = business_trust
        .sort((a: ISelectorResources, b: ISelectorResources) =>
          a.business_code.localeCompare(b.business_code, undefined, {
            numeric: true,
            sensitivity: 'base',
          })
        )
        .map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.business_code} - ${item.name}`,
        }))

      this.assignAccountingBusinessAccountTrust(
        business_trust as IBusinessTrustResource[]
      )
    },

    assignAccountingBusinessAccountTrust(
      business_trust: IBusinessTrustResource[] = []
    ) {
      this.business_trust_account = business_trust
        .map((bt) => bt.account?.accounting_structure)
        .filter((s): s is IAccountStructureTrust => Boolean(s))
        .map((s) => ({
          ...s,
          value: s.id,
          label: `${s.code} - ${s.purpose ?? ''}`,
        }))
    },
    assignVoucherStatuses(voucher_status: []) {
      this.voucher_status =
        voucher_status?.map((item: IVoucherStatusResource) => ({
          ...item,
          value: item.id,
          label: item.status,
        })) ?? []
    },
    assignCostCenters(cost_center: []) {
      this.cost_center =
        cost_center?.map((item: IResource) => ({
          ...item,
          label: `${item.code} - ${item.name}`,
          value: item.id ?? '',
        })) ?? []
    },
    assignAccountChartStructures(account_chart_structures: []) {
      this.account_chart_options =
        account_chart_structures.map((item: IResource) => ({
          value: item.id ?? '',
          label: `${item.structure}`,
        })) ?? []
    },
    assignAvailableCostCenterStructures(available_cost_center_structures: []) {
      this.available_cost_center_structures =
        available_cost_center_structures.map((element: IResource) => {
          return {
            ...element,
            value: element.id ?? '',
            label: element.structure ?? '',
          }
        }) ?? []

      this.available_cost_center_structures_code_label =
        available_cost_center_structures.map(
          (element: IAvailableCostCenterStructuresResource) => {
            return {
              ...element,
              value: element.id ?? 0,
              label: `${element.code} - ${element.purpose}`,
            }
          }
        ) ?? []
    },
    assignAvailablaAccountCharts(available_account_charts: []) {
      this.available_account_charts =
        available_account_charts.map((element: IResource) => {
          return {
            ...element,
            value: element.id ?? '',
            label: element.structure ?? '',
          }
        }) ?? []
    },
    assignCostCenterStructures(cost_center_structures: []) {
      this.cost_center_structures =
        cost_center_structures?.map((element: IResource) => {
          return {
            ...element,
            value: element.structure ?? '',
            label: element.structure ?? '',
          }
        }) ?? []

      this.cost_center_structures_id_value =
        cost_center_structures?.map((element: IResource) => ({
          ...element,
          value: element.id ?? 0,
          label: `${element.code} - ${element.purpose}`,
        })) ?? []
    },
    assignTreeStatus(tree_status: []) {
      this.tree_status = tree_status.map((status: IStatusResource) => {
        return {
          ...status,
          value: status.id ?? '',
          label: status.status,
        }
      })
    },
    assignBusinessParent(bussines_parent: []) {
      this.bussines_parent = bussines_parent.map((item: IResource) => {
        return {
          ...item,
          value: item.id ?? '',
          label: `${item.business_code} - ${item.name}`,
        }
      })
    },
    assignBusinessChild(bussines_child: []) {
      this.bussines_child = bussines_child.map((item: IResource) => {
        return {
          ...item,
          value: item.id ?? '',
          label: item.business_code ?? '',
          label_code_name: `${item.business_code} - ${item.name}`,
        }
      })
    },
    assignAccountStructuresWithPurpose(account_structures_with_purpose: []) {
      this.account_structures_with_purpose =
        account_structures_with_purpose.map((item: ISelectorResources) => {
          return {
            ...item,
            value: item.id,
            label: item.code_purpose,
          }
        })
    },
    assignAccountStructuresAccountingAccounts(
      account_structures_accounting_accounts: []
    ) {
      this.account_structures_accounting_accounts =
        account_structures_accounting_accounts.map(
          (item: ISelectorResources) => {
            return {
              value: item.id,
              label: item.code_purpose,
            }
          }
        )
    },
    assignNotConsolidatorBusinessTrust(not_consolidator_business_trust: []) {
      this.not_consolidator_business_trust =
        not_consolidator_business_trust.map(
          (item: IAnnualPeriodClosingResource) => {
            return {
              ...item,
              value: item.id,
              label: item.business,
              current_period: item.current_period,
              business_code: item.business_code,
            }
          }
        )
    },
    assignTreasuryAccountStructures(account_structures: []) {
      this.account_structures =
        account_structures.map((item: ISelectorResources) => ({
          label: item.code,
          value: item.id,
          purpose: item.purpose,
          structure: item.structure,
        })) ?? []
    },
    assignVoucherValidationStatus(vouchers_validation_status: []) {
      this.vouchers_validation_status =
        vouchers_validation_status?.map((item: IStatusResource) => {
          return {
            ...item,
            value: item.id ?? '',
            label: item.status,
          }
        }) ?? this.vouchers_validation_status
    },
    assignAccountStructuresActive(account_structures_active: []) {
      this.account_structures_active =
        account_structures_active?.map((item: IResource) => {
          return {
            ...item,
            value: item.id ?? '',
            label: item.structure ?? '',
          }
        }) ?? this.account_structures_active

      this.account_structures_active_revert_vouchers =
        account_structures_active
          ?.map((item: IResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.code} - ${item.purpose}`,
            }
          })
          .sort((a, b) => Number(a.code) - Number(b.code)) ??
        this.account_structures_active_revert_vouchers

      this.account_structures_code_active_revert_vouchers =
        account_structures_active
          ?.map((item: IResource) => {
            return {
              ...item,
              value: item.code ?? '',
              label: `${item.code} - ${item.purpose}`,
            }
          })
          .sort((a, b) => Number(a.code) - Number(b.code)) ??
        this.account_structures_code_active_revert_vouchers

      this.account_structures_by_businness =
        account_structures_active?.map((item: ISelectorResources) => {
          return {
            ...item,
            value: item.code,
            label: `${item.code} - ${item.purpose}`,
          }
        }) ?? this.account_structures_by_businness
    },
    assignAccountingChartOperativeByStructure(
      accounting_chart_operative_by_structure: []
    ) {
      this.accounting_chart_operative_by_structure =
        accounting_chart_operative_by_structure.map((item: IStructure) => {
          return {
            ...item,
            value: item.id,
            label: `${item.code_name}`,
            code: item.code,
          }
        })

      this.accounting_chart_operative_by_structure_annual =
        accounting_chart_operative_by_structure.map((item: IStructure) => {
          return {
            ...item,
            value: item.code,
            label: `${item.code_name}`,
          }
        })
    },
    assignBusinessTrustsWithStructureByAccountStructure(
      business_trusts_with_description_by_account_structure: []
    ) {
      this.business_trusts_with_description_by_account_structure =
        business_trusts_with_description_by_account_structure.map(
          (item: IBusinessTrustResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: `${item.business_description}`,
            }
          }
        )
      this.accounting_structure_from_to_business =
        business_trusts_with_description_by_account_structure.map(
          (item: IBusinessTrustResource) => {
            return {
              value: item.id ?? '',
              label: (item.business_description ?? '').replace('+', ' - '),
            }
          }
        )

      this.business_trusts_with_description_by_account_structure_code =
        business_trusts_with_description_by_account_structure.map(
          (item: IBusinessTrustResource) => {
            return {
              ...item,
              value: item.id ?? '',
              label: item.business_description ?? '',
            }
          }
        )
    },
    assignThirdPartiesByBusiness(third_parties_by_business: []) {
      this.third_parties_by_business = third_parties_by_business.map(
        (item: IThirdPartyResource) => {
          return {
            ...item,
            value: item.id,
            label: item.document,
            code: item.business_code,
          }
        }
      )
    },
    assignAccountChartByAccountStructure(
      account_chart_by_account_structure: []
    ) {
      this.account_chart_by_account_structure =
        account_chart_by_account_structure.map(
          (item: IAccountChartByAccountStructure) => {
            return {
              ...item,
              value: item.id,
              label: item.code_account,
            }
          }
        )

      this.account_charts_by_structure = account_chart_by_account_structure.map(
        (item: IAccountChartByAccountStructure) => {
          return {
            ...item,
            value: item.id,
            label: item.code_account,
          }
        }
      )
    },
    assignAccountGroupByCode(account_group_by_code: []) {
      this.account_group_by_code = account_group_by_code.map(
        (item: IAccountGroupResource) => {
          return {
            ...item,
            value: item.id,
            label: `${item.code} - ${item.name}`,
          }
        }
      )

      this.account_group_by_code = account_group_by_code.map(
        (item: IAccountGroupResource) => {
          return {
            ...item,
            value: item.id,
            label: `${item.code} - ${item.name}`,
          }
        }
      )
    },
    assignDeferredImpairmentBusinessTrusts(
      deferred_impairment_business_trusts: []
    ) {
      this.deferred_impairment_business_trusts =
        deferred_impairment_business_trusts
      this.deferred_schedule_business_trusts =
        deferred_impairment_business_trusts.map(
          (item: IBusinessTrustResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.business_code} - ${item.name}`,
          })
        )
    },
    assignDeferredImpairmentAccounts(deferred_impairment_accounts: []) {
      this.deferred_impairment_accounts = deferred_impairment_accounts.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.name}`,
          name: item.name,
        })
      )
    },
    assignDeferredImpairmentReceiptTypes(
      deferred_impairment_receipt_types: []
    ) {
      this.deferred_impairment_receipt_types =
        deferred_impairment_receipt_types.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.name}`,
        }))
    },
    assignDeferredImpairmentSubReceiptTypes(
      deferred_impairment_sub_receipt_types: []
    ) {
      this.deferred_impairment_sub_receipt_types =
        deferred_impairment_sub_receipt_types.map(
          (item: ISelectorResources) => ({
            ...item,
            value: item.id,
            label: `${item.code} - ${item.name}`,
          })
        )
    },
    assignSubReceiptTypes(sub_receipt_type: []) {
      this.sub_receipt_types = sub_receipt_type.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.name}`,
        })
      )
      this.sub_receipt_types_voucher = sub_receipt_type.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.value,
          label: item.label,
        })
      )
    },
    assignAccountsByStructure(list: IPucAccountingResource[]) {
      this.accounts_by_structure = list

      const mapped = (list ?? []).map((item) => ({
        ...item,
        label: `${item.code ?? ''} - ${item.name ?? ''}`,
        value: item.id ?? 0,
        code: item.code ?? '',
        type: item.type ?? '',
      }))

      this.puc_accounts_by_structure = mapped as unknown as ISelectorResources[]
      this.accounts_by_structure = mapped as unknown as IResource[]

      this.liability_accounts = mapped.filter((account) => {
        const code = String(account.code ?? '')
        return code.startsWith('2')
      }) as unknown as IResource[]

      this.expense_accounts = mapped.filter((account) => {
        const code = String(account.code ?? '')
        return code.startsWith('5')
      }) as unknown as IResource[]

      const structuresMap = new Map<number, IResource>()

      list.forEach((item) => {
        const itemWithStructure = item as IPucAccountingResource & {
          account_structure?: {
            id: number
            code: string
            structure?: string
          }
        }

        const structure = itemWithStructure.account_structure
        if (structure && structure.id) {
          structuresMap.set(structure.id, {
            id: structure.id,
            value: structure.id,
            label: `${structure.code} - ${structure.structure ?? ''}`,
          } as IResource)
        }
      })

      this.account_structures_for_settlement = Array.from(
        structuresMap.values()
      )

      this.accounts_by_structure_id = list.map(
        (item: IPucAccountingResource) => ({
          ...item,
          label: `${item.code} - ${item.name}`,
          value: item.id ?? 0,
        })
      )
    },

    assignSourceAccountStructure(source_account_structures: []) {
      this.source_account_structures = source_account_structures?.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.purpose}`,
        })
      )
    },
    assignEquivalenceAccountStructures(equivalent_account_structures: []) {
      this.equivalent_account_structures = equivalent_account_structures?.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.purpose}`,
        })
      )
    },
    assignEquivalenceFiscalAccountStructures(
      equivalence_fiscal_account_structures: []
    ) {
      this.puc_equivalence_fiscal_account_structures =
        equivalence_fiscal_account_structures?.map(
          (item: ISelectorResources) => ({
            ...item,
            value: item.id,
            label: `${item.code} - ${item.purpose}`,
          })
        )
    },
    assignAccountEquivalenceTypes(account_equivalence_types: []) {
      this.puc_account_equivalence_types = account_equivalence_types?.map(
        (item: ISelectorResources, index: number) => ({
          ...item,
          value: index + 1,
          label: item.label,
        })
      )
    },
    assignDailyClosingBusinessByAccountStructure(
      daily_closing_business_by_account_structure: []
    ) {
      this.daily_closing_business_by_account_structure =
        daily_closing_business_by_account_structure?.map(
          (item: IRevertVouchersResource) => ({
            ...item,
            label: `${item.business_code} - ${item.name}`,
            value: item.id,
          })
        )
    },
    assignCostStructuresByChartAccount(cost_structures_by_chart_account: []) {
      this.cost_structures_by_chart_account =
        cost_structures_by_chart_account.map((item: ISelectorResources) => ({
          label: item.code,
          value: item.id,
        }))
    },
    assignCostCenterCodesByStructure(cost_center_codes_by_structure: []) {
      this.cost_center_codes_by_structure = cost_center_codes_by_structure.map(
        (item: ISelectorResources) => ({
          label: item.code,
          value: item.id,
        })
      )
    },
    assignAccountingThirdPartiesWithDocument(
      accounting_third_parties_with_document: []
    ) {
      this.accounting_third_parties_with_document =
        accounting_third_parties_with_document.map(
          (item: ISelectorResources) => ({
            value: item.id,
            label: `${item.full_name_code}`,
          })
        ) ?? []
    },
    assignReceiptTypes(receipt_types: []) {
      this.receipt_types = receipt_types.map((item: IReceiptTypeResource) => {
        return {
          ...item,
          code: item.value,
          value: item.id ?? 0,
          label: `${item.value} - ${item.label}`,
        }
      })
      this.homologation_receipt_types = receipt_types.map(
        (item: IReceiptTypeResource) => {
          return {
            ...item,
            code: item.value,
            value: item.id ?? 0,
            label: `${item.value} - ${item.label}`,
          }
        }
      )
      this.deferred_receipt_types = receipt_types.map(
        (item: IReceiptTypeResource) => ({
          ...item,
          label: `${item.value} - ${item.label}`,
          value: item.id ?? 0,
        })
      )
    },
    assignReceiptTypesByStructure(receipt_types_by_structure: []) {
      this.receipt_types_by_structure =
        receipt_types_by_structure.map((item: IReceiptTypeResource) => ({
          value: item.id ?? 0,
          label: `${item.code}`,
          code: item.code,
        })) ?? []
    },
    assignSubReceiptTypeByType(sub_receipt_types_by_type: []) {
      this.sub_receipt_types_by_type =
        sub_receipt_types_by_type.map((item: IReceiptTypeResource) => ({
          value: item.id ?? 0,
          label: `${item.code}`,
          code: item.code,
        })) ?? []
    },
    assignBusinessByReexpression(businesses_by_reexpression: []) {
      this.businesses_by_reexpression =
        businesses_by_reexpression.map((item: IResource) => ({
          value: item.id ?? 0,
          label: `${item.business_description}`,
        })) ?? []
    },
    assignStructureByBusiness(structure_by_business: []) {
      this.structure_by_business =
        structure_by_business.map((item: IResource) => ({
          value: item.id ?? 0,
          label: `${item.code_purpose}`,
        })) ?? []
    },
    assignAccountsByBussiness(accounts_by_business: []) {
      this.accounts_by_business =
        accounts_by_business.map((item: IResource) => ({
          value: item.id ?? 0,
          label: `${item.code_name}`,
        })) ?? []
    },
    assignBusinessByBode(business_by_code: []) {
      this.business_by_code =
        business_by_code.map((item: ISelectorResources) => {
          return {
            ...item,
            value: item.business_code,
            label: item.business_code,
            name: item.name,
            accounting_structure_code:
              item.account.accounting_structure?.code ?? '',
            accounting_structure_purpose:
              item.account.accounting_structure?.purpose ?? '',
          }
        }) ?? []
    },
    assignAccountChartStructureDetails(account_chart_structure_details: []) {
      this.account_chart_structure_details =
        account_chart_structure_details.map((item: IResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code} - ${item.purpose}`,
        }))
    },
    assignStructureLevels(structure_levels: IStructureLevel[]) {
      this.structure_levels = structure_levels.map((item) => {
        const min = typeof item.min_level === 'number' ? item.min_level : 1
        const max = typeof item.max_level === 'number' ? item.max_level : min

        return {
          id: item.id,
          value: item.id,
          label: String(item.code_purpose ?? ''),
          min_level: min,
          max_level: max,
          code_purpose: item.code_purpose,
        } as IStructureLevel
      })

      const seen = new Set<number>()
      const expanded: IGenericResource[] = []

      for (const it of this.structure_levels) {
        const min = it.min_level ?? 1
        const max = it.max_level ?? min
        const from = Math.min(min, max)
        const to = Math.max(min, max)

        for (let level = from; level <= to; level++) {
          if (!seen.has(level)) {
            expanded.push({ value: level, label: `Nivel - ${level}` })
            seen.add(level)
          }
        }
      }

      expanded.sort((a, b) => Number(a.value) - Number(b.value))
      this.structure_levels_report = expanded
    },
    assingAccountingResources(business_trusts_basic: []) {
      this.business_trusts_basic = business_trusts_basic.map(
        (item: ISelectorResources) => ({
          value: item.id,
          label: `${item.business_code} - ${item.name}`,
          code: item.business_code,
        })
      )
    },
    assignAmountTypes(amount_types: []) {
      this.amount_types = amount_types.map((item: ISelectorResources) => ({
        ...item,
        value: item.value,
        label: item.label,
      }))
    },
    accountingBusinessDetail(business_trusts_with_description: []) {
      this.business_trusts_with_description =
        business_trusts_with_description.map((item: IRawBusinessTrust) => ({
          ...item,
          value: item.id,
          label: item.business_description,
        }))
    },
    accountingTemplate(template: []) {
      this.template = template.map((item: ISelectorResources) => ({
        ...item,
        value: item.id,
        label: item.name,
      }))

      this.template_reports = template.map((item: ISelectorResources) => ({
        ...item,
        value: item.id,
        label: `${item.code} - ${item.name}`,
      }))
    },

    assignConsolidatorBusinessTrustWithAccountStructure(
      consolidator_business_trust_with_account_structure: []
    ) {
      this.consolidator_business_trust_with_account_structure =
        consolidator_business_trust_with_account_structure.map(
          (item: ISelectorResources) => ({
            ...item,
            value: item.id,
            label: `${item.business_code} - ${item.name}`,
            accounting_structure_code: `${item.account?.accounting_structure?.code} - ${item.account?.accounting_structure?.purpose}`,
          })
        )
    },
    assignReceiptTypesManualWithoutCancellationSubtypes(
      receipt_types_manual_without_cancellation_subtypes: []
    ) {
      this.receipt_types_manual_without_cancellation_subtypes =
        receipt_types_manual_without_cancellation_subtypes.map(
          (item: ISelectorResources) => ({
            ...item,
            value: item.id,
            label: `${item.code} - ${item.name}`,
          })
        )
    },
    assignVoucherConsecutivesByBusinessTrustAndReceiptType(
      voucher_consecutives_by_business_trust_and_receipt_type: []
    ) {
      this.voucher_consecutives_by_business_trust_and_receipt_type =
        voucher_consecutives_by_business_trust_and_receipt_type.map(
          (item: ISelectorResources) => ({
            ...item,
            value: item.code,
            label: String(item.code ?? ''),
          })
        )
      this.voucher_consecutives_ids =
        voucher_consecutives_by_business_trust_and_receipt_type.map(
          (item: IResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.code}`,
          })
        )
      this.voucher_consecutives_codes =
        voucher_consecutives_by_business_trust_and_receipt_type.map(
          (item: IResource) => ({
            ...item,
            value: item.code ?? '',
            label: `${item.code}`,
          })
        )
    },
    assignVoucherStatusesV2(voucher_statuses: []) {
      this.voucher_statuses_v2 = [
        { value: 'ALL', label: 'Todos' } as ISelectorResources,
        ...(voucher_statuses?.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: item.status,
        })) ?? []),
      ]
    },
    assingAccountChartStructureAccounting(
      account_chart_structure_accounting: []
    ) {
      this.account_chart_structure_accounting =
        account_chart_structure_accounting.map((item: IResource) => ({
          ...item,
          value: `${item.code}`,
          label: `${item.code} - ${item.purpose}`,
        }))
    },
    assingaccountStructuresAvailableForStore(
      account_structures_available_for_store: []
    ) {
      this.account_structures_available_for_store =
        account_structures_available_for_store.map((item: IResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.code} - ${item.purpose}`,
        }))
    },
    assignVoucherTypeTypes(voucher_type_types: []) {
      this.voucher_type_types = voucher_type_types || []
    },
    assignBusinessTrustsPerClousurePeriod(
      business_trusts: {
        id: number
        business: string
        current_period: string
        business_code: string
      }[]
    ) {
      this.business_trusts_per_clousure_period = business_trusts.map(
        (item) => ({
          ...item,
          value: item.id,
          label: item.business,
          code: item.business_code,
        })
      )
    },
    assingaccountThirdPartiesForStore(third_parties_by_account_range: []) {
      this.third_parties_by_account_range = third_parties_by_account_range.map(
        (item: IResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.document} - ${item.name}`,
        })
      )

      this.third_parties_by_account_range_period_anual =
        third_parties_by_account_range.map((item: IResource) => ({
          ...item,
          value: item.document ?? '',
          label: `${item.document} - ${item.name}`,
        }))
    },
    assingaccountCostCenterForStore(cost_centers_by_account_range: []) {
      this.cost_centers_by_account_range = cost_centers_by_account_range.map(
        (item: IResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.code} - ${item.name}`,
        })
      )
    },

    assignBusinessTrustReceiptType(business_trust_receipt_types: []) {
      this.business_trust_receipt_types =
        business_trust_receipt_types.map((item: ISelectorResources) => ({
          label: `${item.code} - ${item.name}`,
          value: item.id,
        })) ?? []
    },
    assignBusinessTrustStructure(business_trust_structures: []) {
      this.business_trust_structures =
        business_trust_structures.map((item: ISelectorResources) => ({
          label: `${item.code} - ${item.purpose}`,
          value: item.id,
        })) ?? []
    },
    assignTypesReports(report_types: []) {
      this.report_types =
        report_types.map((item: ISelectorResources) => ({
          label: item.name,
          value: item.id,
        })) ?? []
    },
    assignOpeningRecordStructures(opening_record_structures: []) {
      this.opening_record_structures =
        opening_record_structures.map((item: ISelectorResources) => ({
          label: `${item.code} - ${item.purpose}`,
          value: item.id,
        })) ?? []
    },
    assingVouchersMappingProcessStatuses(
      vouchers_mapping_process_statuses: []
    ) {
      this.vouchers_mapping_process_statuses =
        vouchers_mapping_process_statuses.map((item: IStatusResource) => ({
          ...item,
          value: item.id ?? 0,
          label: item.status,
        }))
    },
    assignBusinessTrustsByAccountStructureAndEquivalence(
      business_trusts_by_account_structure_and_equivalence: []
    ) {
      this.business_trusts_by_account_structure_and_equivalence =
        business_trusts_by_account_structure_and_equivalence
          .map((item: IBusinessTrustResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.business_code} - ${item.name}`,
          }))
          .sort((a, b) => Number(a.code) - Number(b.code)) ?? []
    },
    assignVouchersMappingProcessLogsStatuses(
      vouchers_mapping_process_logs_statuses: []
    ) {
      this.vouchers_mapping_process_logs_statuses =
        vouchers_mapping_process_logs_statuses.map((item: IStatusResource) => ({
          ...item,
          value: item.id ?? 0,
          label: item.status,
        }))
    },
    assignBusinessTrustByDateRange(business_trusts_by_date_range: []) {
      this.business_trusts_by_date_range = business_trusts_by_date_range.map(
        (item: IResource) => ({
          ...item,
          value: item.id ?? '',
          label: item.business_code_name ?? '',
        })
      )
    },
    assignMapBudgetItemsResource(resources: [], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: IBudgetAccountStructureResource) => ({
          label: item.code_purpose,
          value: item.id,
        })) ?? []
    },
    assignAccountingAccountStructures(accounting_account_structures: []) {
      this.accounting_account_structures = accounting_account_structures.map(
        (item: IAccountingStructureResource) => ({
          ...item,
          value: item.id || 0,
          label: `${item.code} - ${item.purpose}`,
        })
      )
    },
    assignThirdPartyFormatted(third_parties_formatted: []) {
      this.third_parties_formatted = third_parties_formatted.map(
        (item: IFormattedThirdPartyResource) => ({
          ...item,
          label: item.formatted_name,
          value: item.id || 0,
        })
      )
    },
    assignAccountChart(accounts_chart: []) {
      this.accounts_chart = accounts_chart.map((item: IGenericResource) => ({
        ...item,
        value: item.id ?? '',
        label: `${item.code} - ${item.name}`,
      }))
    },

    assignCostCenterActive(cost_center_active: []) {
      this.cost_center_active = cost_center_active.map(
        (item: IGenericResource) => ({
          ...item,
          value: item.id || '',
          label: `${item.code} - ${item.name}`,
        })
      )
    },
    assignBusinessTrustPrincipalStructures(
      business_trust_principal_structures: []
    ) {
      this.business_trust_principal_structures =
        business_trust_principal_structures.map(
          (item: IBusinessTrustPrincipalStructureResource) => ({
            value: item.account_structure_id,
            label: `${item.account_structure.code} - ${item.account_structure.purpose}`,
          })
        )
    },
    assignValidationVouchersProcessResult(
      validation_vouchers_process_result: []
    ) {
      this.validation_vouchers_process_result =
        validation_vouchers_process_result
    },
    assignBussinessTrustsSelector(
      business_trusts_selector: IBusinessTrustSelectorResource[]
    ) {
      this.business_trusts_selector = business_trusts_selector.map((item) => ({
        ...item,
        label: item.business,
        value: item.id,
        description: item.business,
        validity_year: item.budget?.validity,
      }))

      this.business_transfer_trusts_selector = business_trusts_selector.map(
        (item: IBusinessTransferParameter) => ({
          ...item,
          label: item.business,
          value: item.id || 0,
          description: item.name,
        })
      )
    },
    assignBusinessTrustConsolidate(business_trusts_to_consolidate: []) {
      this.business_trusts_to_consolidate = business_trusts_to_consolidate.map(
        (item: ISelectorResources) => ({
          ...item,
          label: `${item.code} - ${item.name}`,
          value: Number(item.code),
        })
      )
    },

    assignCostCenterStructuresByBusinessAndAccountStructure(data: []) {
      this.cost_center_structures_by_business_and_account_structure = data.map(
        (item: IAccountStructures) => ({
          ...item,
          value: item.id ?? '',
          label: item.purpose ?? '',
        })
      )
    },

    assignChartStructure(data: []) {
      this.account_chart_structure_code_accounting = data.map(
        (item: IChartStructure) => ({
          ...item,
          label: `${item.code} - ${item.type}`,
          value: item.id ?? 0,
        })
      )
    },
    assignPendingConsecutives(pending_consecutives: never[]) {
      this.voucher_consecutives_pendings_to_authorization =
        pending_consecutives.map((item: IConsecutiveResource) => ({
          ...item,
          value: item.consecutive_code || 0,
          label: String(item.consecutive_code || ''),
          label_with_date_and_type: `${formatDate(
            item.registration_date,
            'YYYY-MM-DD'
          )} - ${item.receipt_type_code} - ${item.consecutive_code}`,
        }))
    },
    assignBusinessTrustsAllPermission(business_trusts_all_permission: []) {
      this.business_trusts_all_permission = business_trusts_all_permission.map(
        (item: IBusinessTrustSelectorResource) => ({
          ...item,
          value: item.id,
          label: `${item.business_code} - ${item.name}`,
        })
      )
    },

    assignBusinessTrustByStructureAndClosingType(
      business_trusts_by_structure_and_closing_type: []
    ) {
      this.business_trusts_by_structure_and_closing_type =
        business_trusts_by_structure_and_closing_type.map(
          (item: ISelectorResources) => ({
            ...item,
            value: Number(item.business_code),
            label: `${item.business_code} - ${item.name}`,
          })
        )
    },
    assignStatusByIdAccountingRestatement(status_by_id: []) {
      this.status_by_id = status_by_id.map((item: ISelectorResources) => ({
        ...item,
        value: item.id,
        label: item.status,
      }))
    },
    assignConsolidateStatus(consolidate_status: []) {
      this.consolidate_status = consolidate_status.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: item.status,
        })
      )
    },
    assignVoucherUploadProcessStatus(vouchers_upload_process_statuses: []) {
      this.vouchers_upload_process_statuses =
        vouchers_upload_process_statuses.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: item.status,
        }))
    },
    assignVoucherUploadedCodes(vouchers_uploaded_codes: []) {
      this.vouchers_uploaded_codes = vouchers_uploaded_codes.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: item.code,
        })
      )
    },
    assignBusinessList(business_list_without_permissions: []) {
      this.business_list_without_permissions =
        business_list_without_permissions.map(
          (item: IBusinessTrustResource) => ({
            ...item,
            value: item.business_code ?? 0,
            label: `${item.business_code} - ${item.name}`,
          })
        )
    },
    assignBusinessTrustsOpening(business_trusts_for_period_opening: []) {
      this.business_trusts_for_period_opening =
        business_trusts_for_period_opening.map(
          (item: IBusinessTrustForPeriodOpeningResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.business_code} - ${item.name}`,
          })
        )
    },
    assignProcessConsolidateStatus(consolidate_process: []) {
      this.consolidate_process = consolidate_process.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: item.status,
        })
      )
    },
    assignProcessConsolidate(process_consolidate_status: []) {
      this.process_consolidate_status = process_consolidate_status.map(
        (item: IConsolidateProcessResource) => ({
          ...item,
          value: item.id ?? '',
          label: item.process_code ?? '',
        })
      )
    },

    assignBudgetStructuresGenerate(data: IBudgetStructuresGenerate[]) {
      this.budget_structures = data.map((item) => ({
        ...item,
        value: item.id ?? '',
        label: item.code_name,
      }))
      this.budget_structures_area = data.map((item) => ({
        ...item,
        value: item.area_id ?? item.id ?? '',
        label: item.code_name,
      }))
      this.budget_structures_generate = data
    },
    assignAnullmentVoucherStatuses(
      anullment_voucher_statuses: IGenericResource[]
    ) {
      this.anullment_voucher_statuses = anullment_voucher_statuses
    },
    assignVoucherAuthorizationStatuses(
      voucher_authorization_statuses: ISelectorResources[]
    ) {
      this.voucher_authorization_statuses = voucher_authorization_statuses.map(
        (item) => ({
          value: `${item.id}`,
          label: item.status,
        })
      )
    },

    assignVoucherUploads(voucher_uploads: []) {
      this.voucher_uploads = voucher_uploads.map(
        (item: IVoucherUploadsResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code} - ${formatDate(
            item.uploaded_at,
            'YYYY-MM-DD'
          )} - ${item.creator.name}`,
        })
      )
    },

    assingReceiptTypesWithSubTypes(
      receipt_types_with_sub_types: IAccountingStructureResource[]
    ) {
      this.receipt_types_with_sub_types = receipt_types_with_sub_types.map(
        (item) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.code} - ${item.name}`,
        })
      )
    },
    assignReportTemplateSignatures(report_template_signatures: []) {
      this.report_template_signatures = report_template_signatures.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id || 0,
          label: item.user.name || '',
        })
      )
    },
    assignReportTemplateLogos(report_template_logos: []) {
      this.report_template_logos = report_template_logos.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: item.app_name || '',
        })
      )
    },
    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (value: any, key: string | undefined) => void
      > = {
        account_structure_statuses: this.assignAccountStructureStatuses,
        account_structures: this.assignAccountStructures,
        available_accounting_structures:
          this.assignAvailableAccountingStructures,
        accounting_closing_parameter_account_chart:
          this.assignAccountingClosingParameterAccountChart,
        accounting_closing_parameter_third_parties:
          this.assignAccountingClosingParameterThirdParties,
        accounting_closing_parameter_cost_centers:
          this.assignAccountingClosingParameterCostCenters,
        account_structures_available: this.assignAccountStructuresAvailable,
        accounts_charts: this.assignAccountCharts,
        account_chart_by_account_structure:
          this.assignAccountChartByAccountStructure,
        account_group_by_code: this.assignAccountGroupByCode,
        third_parties: this.assignAccountingThirdParties,
        third_parties_label: this.assignAccountingThirdParties,
        business_trust: this.assignAccountingBusinessTrust,
        voucher_status: this.assignVoucherStatuses,
        cost_center: this.assignCostCenters,
        account_chart_structures: this.assignAccountChartStructures,
        available_cost_center_structures:
          this.assignAvailableCostCenterStructures,
        available_account_charts: this.assignAvailablaAccountCharts,
        cost_center_structures: this.assignCostCenterStructures,
        tree_status: this.assignTreeStatus,
        bussines_parent: this.assignBusinessParent,
        bussines_child: this.assignBusinessChild,
        account_structures_with_purpose:
          this.assignAccountStructuresWithPurpose,
        vouchers_validation_status: this.assignVoucherValidationStatus,
        account_structures_active: this.assignAccountStructuresActive,
        accounting_chart_operative_by_structure:
          this.assignAccountingChartOperativeByStructure,
        business_trusts_with_description_by_account_structure:
          this.assignBusinessTrustsWithStructureByAccountStructure,
        third_parties_by_business: this.assignThirdPartiesByBusiness,
        deferred_impairment_business_trusts:
          this.assignDeferredImpairmentBusinessTrusts,
        deferred_impairment_accounts: this.assignDeferredImpairmentAccounts,
        deferred_impairment_receipt_types:
          this.assignDeferredImpairmentReceiptTypes,
        deferred_impairment_sub_receipt_types:
          this.assignDeferredImpairmentSubReceiptTypes,
        accounts_by_structure: this.assignAccountsByStructure,
        source_account_structures: this.assignSourceAccountStructure,
        source_account_structures_generic: this.assignSourceAccountStructure,
        equivalent_account_structures: this.assignEquivalenceAccountStructures,
        equivalence_fiscal_account_structures:
          this.assignEquivalenceFiscalAccountStructures,
        account_equivalence_types: this.assignAccountEquivalenceTypes,
        daily_closing_business_by_account_structure:
          this.assignDailyClosingBusinessByAccountStructure,
        cost_structures_by_chart_account:
          this.assignCostStructuresByChartAccount,
        cost_center_codes_by_structure: this.assignCostCenterCodesByStructure,
        accounting_third_parties_with_document:
          this.assignAccountingThirdPartiesWithDocument,
        receipt_types: this.assignReceiptTypes,
        receipt_types_by_structure: this.assignReceiptTypesByStructure,
        sub_receipt_types_by_type: this.assignSubReceiptTypeByType,
        businesses_by_reexpression: this.assignBusinessByReexpression,
        structure_by_business: this.assignStructureByBusiness,
        accounts_by_business: this.assignAccountsByBussiness,
        business_by_code: this.assignBusinessByBode,
        business_trusts_with_description: this.accountingBusinessDetail,
        account_chart_structure_details:
          this.assignAccountChartStructureDetails,
        structure_levels: this.assignStructureLevels,
        consolidator_business_trust_with_account_structure:
          this.assignConsolidatorBusinessTrustWithAccountStructure,
        receipt_types_manual_without_cancellation_subtypes:
          this.assignReceiptTypesManualWithoutCancellationSubtypes,
        voucher_consecutives_by_business_trust_and_receipt_type:
          this.assignVoucherConsecutivesByBusinessTrustAndReceiptType,
        voucher_statuses_v2: this.assignVoucherStatusesV2,
        amount_types: this.assignAmountTypes,
        business_trusts_basic: this.assingAccountingResources,
        voucher_type_types: this.assignVoucherTypeTypes,
        account_structures_accounting_accounts:
          this.assignAccountStructuresAccountingAccounts,
        not_consolidator_business_trust:
          this.assignNotConsolidatorBusinessTrust,
        account_chart_structure_accounting:
          this.assingAccountChartStructureAccounting,
        account_structures_available_for_store:
          this.assingaccountStructuresAvailableForStore,
        template: this.accountingTemplate,
        puc_equivalences_account_structures:
          this.assignEquivalenceAccountStructures,
        business_trusts_per_clousure_period:
          this.assignBusinessTrustsPerClousurePeriod,
        third_parties_by_account_range: this.assingaccountThirdPartiesForStore,
        cost_centers_by_account_range: this.assingaccountCostCenterForStore,
        business_trust_receipt_types: this.assignBusinessTrustReceiptType,
        business_trust_structures: this.assignBusinessTrustStructure,
        business_trust_account: this.assignAccountingBusinessAccountTrust,
        report_types: this.assignTypesReports,
        accounting_chart_operative_by_structure_annual:
          this.assignAccountingChartOperativeByStructure,
        vouchers_mapping_process_statuses:
          this.assingVouchersMappingProcessStatuses,
        vouchers_mapping_process_logs_statuses:
          this.assignVouchersMappingProcessLogsStatuses,
        business_trusts_by_account_structure_and_equivalence:
          this.assignBusinessTrustsByAccountStructureAndEquivalence,
        third_parties_by_account_range_period_anual:
          this.assingaccountThirdPartiesForStore,
        business_trusts_by_date_range: this.assignBusinessTrustByDateRange,
        budget_item_structure: this.assignMapBudgetItemsResource,
        chart_of_account_structures: this.assignMapBudgetItemsResource,
        resource_catalog_structures: this.assignMapBudgetItemsResource,
        accounting_account_structures: this.assignAccountingAccountStructures,
        third_parties_formatted: this.assignThirdPartyFormatted,
        business_trusts_selector: this.assignBussinessTrustsSelector,
        cost_center_active: this.assignCostCenterActive,
        business_trust_principal_structures:
          this.assignBusinessTrustPrincipalStructures,
        sub_receipt_types: this.assignSubReceiptTypes,
        accounts_chart: this.assignAccountChart,
        accounting_closing_parameter_third_parties_format:
          this.assignAccountingClosingParameterThirdParties,
        sub_receipt_types_voucher: this.assignSubReceiptTypes,
        validation_vouchers_process_result:
          this.assignValidationVouchersProcessResult,
        business_transfer_trusts_selector: this.assignBussinessTrustsSelector,
        cost_center_structures_by_business_and_account_structure:
          this.assignCostCenterStructuresByBusinessAndAccountStructure,
        account_chart_structure_code_accounting: this.assignChartStructure,
        voucher_consecutives_pendings_to_authorization:
          this.assignPendingConsecutives,
        account_structures_reexpresion: this.assignAccountStructures,
        business_trusts_by_structure_and_closing_type:
          this.assignBusinessTrustByStructureAndClosingType,
        status_by_id: this.assignStatusByIdAccountingRestatement,
        accounts_by_structure_id: this.assignAccountsByStructure,
        business_trusts_to_consolidate: this.assignBusinessTrustConsolidate,
        consolidate_status: this.assignConsolidateStatus,
        business_trusts_for_period_opening: this.assignBusinessTrustsOpening,
        report_modules: this.assignMapIdName,
        business_list_without_permissions: this.assignBusinessList,
        business_trusts_all_permission: this.assignBusinessTrustsAllPermission,
        process_consolidate_status: this.assignProcessConsolidateStatus,
        consolidate_process: this.assignProcessConsolidate,
        budget_structures_generate: this.assignBudgetStructuresGenerate,
        vouchers_upload_process_statuses: this.assignVoucherUploadProcessStatus,
        anullment_voucher_statuses: this.assignAnullmentVoucherStatuses,
        voucher_authorization_statuses: this.assignVoucherAuthorizationStatuses,
        receipt_types_with_sub_types: this.assingReceiptTypesWithSubTypes,
        voucher_uploads: this.assignVoucherUploads,
        report_template_signatures: this.assignReportTemplateSignatures,
        report_template_logos: this.assignReportTemplateLogos,
        template_reports: this.accountingTemplate,
      }

      await executeApi()
        .get(`${URL_PATH_ACCOUNTING}/select-tables${params}`)
        .then((response) => {
          if (!response.status) return

          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              customHandlers[key](value, key)
            } else if (key in this.$state) {
              ;(this as any)[key] = value
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
})

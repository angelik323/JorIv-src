/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  IGenericResource,
  ISelectorResources,
  IStatusResource,
  ICollectiveInvestmentFunds,
  IRegionalResource,
  IMovementsCodesResource,
  IFiduciaryInvestmentPlanResource,
  IFicsFundResource,
  IFicsPrintGroupResource,
  IFilterFundResource,
  IFreezeResourcesGeneric,
  IFundResource,
  IInfoCollectiveInvestmentFunds,
} from '@/interfaces/customs'
import { IFicBankAccount } from '@/interfaces/customs/fics/BulkUpload'
import { IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_FICS } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  movements: [] as IResource[],
  offices_fics: [] as ISelectorResources[],
  offices: [] as ISelectorResources[],
  offices_code_label: [] as ISelectorResources[],
  status_business_line: [] as ISelectorResources[],
  bank_account_movements: [] as IResource[],
  movement_types_by_ids: [] as IResource[],
  movement_types_movement_codes: [] as ISelectorResources[],
  movement_classes_movement_codes: [] as ISelectorResources[],
  movement_nature_movement_codes: [] as ISelectorResources[],
  movement_group_movement_codes: [] as ISelectorResources[],
  origin_module_movement_codes: [] as ISelectorResources[],
  grounds_blocking_investment_status: [] as IStatusResource[],
  funds: [] as IFundResource[],
  funds_code: [] as IFundResource[],
  funds_code_label: [] as IFundResource[],
  fiduciary_investment_plans_code_label:
    [] as IFiduciaryInvestmentPlanResource[],
  accounting_blocks: [] as ISelectorResources[],
  fund_types: [] as ISelectorResources[],
  auxiliar_accounting_parameter: [] as ISelectorResources[],
  business_lines_active: [] as IGenericResource[],
  participation_types_active: [] as IGenericResource[],
  fiduciary_commissions: [] as ICollectiveInvestmentFunds[],
  fiduciary_commissions_fixed: [] as ICollectiveInvestmentFunds[],
  system_operation_channels: [] as IGenericResource[],
  consolidation_options: [] as IGenericResource[],
  calculation_unit: [] as IGenericResource[],
  term_basis: [] as IGenericResource[],
  status_investment_plan_status_modification: [] as IGenericResource[],
  commission_assumed: [] as IGenericResource[],
  structure: [] as IGenericResource[],
  send_types: [] as IGenericResource[],
  participation_types_codes: [] as IResource[],
  accounting_parameter_counter_part_types: [] as ISelectorResources[],
  fiduciary_investment_plans: [] as IFiduciaryInvestmentPlanResource[],
  monetary_operation_columns: [] as IResource[],
  regions: [] as IRegionalResource[],
  funts_to_investment_plans: [] as IFicsFundResource[],
  statuses_fiduciary_investment_plans: [] as IGenericResource[],
  status_investment_plan_to_filter: [] as IGenericResource[],
  print_groups: [] as IFicsPrintGroupResource[],
  fic_profiles: [] as IGenericResource[],
  fic_business_lines: [] as IGenericResource[],
  identification_types_for_plans: [] as IGenericResource[],
  status_fip_account_management: [] as IGenericResource[],
  movements_codes: [] as IGenericResource[],
  movements_codes_nfi: [] as IGenericResource[],
  monetary_operation_templates: [] as IGenericResource[],
  templates: [] as IGenericResource[],
  adjustment_class_movements_list: [] as ISelectorResources[],
  adjustment_balance_types: [] as ISelectorResources[],
  adjustment_movement_codes_list: [] as ISelectorResources[],
  adjustment_types: [] as ISelectorResources[],
  funds_fics: [] as IFicsFundResource[],
  fiduciary_investment_plans_treasury: [] as IFiduciaryInvestmentPlanResource[],
  fiduciary_investment_plans_by_holder: [] as IFreezeResourcesGeneric[],
  blocking_reasons_on_investment_plans: [] as ISelectorResources[],
  accounting_block_destinations: [] as ISelectorResources[],
  account_types: [] as ISelectorResources[],
  status_extracts: [] as IGenericResource[],
  extract_types: [] as IGenericResource[],
  pt_not_consolidated_without_fund: [] as IGenericResource[],
  fund_business_trusts: [] as IGenericResource[],
  plan_business_trusts: [] as ISelectorResources[],
  status_operation_investment_plans: [] as IGenericResource[],
  number_operation_investment_plans: [] as IGenericResource[],
  banks_collective_investment_funds: [] as IResource[],
  statuses: [] as IGenericResource[],
  plan_accounts: [] as IGenericResource[],
  info_collective_investment_funds: [] as IInfoCollectiveInvestmentFunds[],
  fic_bank_accounts_operations: [] as IFicBankAccount[],
  assigned_sequence: [] as IGenericResource[],
  participation_types_codes_assigned_sequence: [] as IGenericResource[],
  movements_accounting_parameters: [] as IResource[],
})

export const useFicResourcesV1 = defineStore('fic-resources-v1', {
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
    assignMapIdIndex(resources: [], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map(
          (item: ISelectorResources | IResource, index: number) => ({
            ...item,
            value: index + 1,
          })
        ) || []
    },
    assignMapIdCodeDescription(resources: [], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: ISelectorResources | IResource) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.description}`,
        })) || []
    },
    assignMovements(movements: []) {
      this.movements =
        movements.map((item: IResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''} - ${item.description ?? ''}`,
          description: item?.description,
        })) ?? []
    },
    assignMovementsCodes(movements_codes: []) {
      this.movements_codes =
        movements_codes.map((item: IMovementsCodesResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code} - ${item.description} - ${item.movement_type.code} - ${item.movement_class.code} - ${item.movement_class_nature.code}`,
          description: item?.description,
        })) ?? []
      this.movements_codes_nfi =
        movements_codes.map((item: IMovementsCodesResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code} - ${item.description}`,
          description: item?.description,
        })) ?? []
    },

    assignFicOffices(offices: []) {
      this.offices_fics = offices.map((item: ISelectorResources) => ({
        ...item,
        label: `${item.office_code} - ${item.office_description}`,
        value: item.id ?? null,
        nameOffice: item.office_description,
      }))

      this.offices =
        offices.map((item: ISelectorResources) => {
          return {
            ...item,
            value: item.id,
            label: `${item.office_code ?? ''} - ${
              item.office_description ?? ''
            }`,
            name: item.office_description,
          }
        }) ?? []

      this.offices_code_label =
        offices.map((item: ISelectorResources) => {
          return {
            ...item,
            value: item.id,
            label: `${item.office_code ?? ''} - ${
              item.office_description ?? ''
            }`,
            name: item.office_description,
          }
        }) ?? []
    },
    assignBusinessLineStatuses(resources: [], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: ISelectorResources) => ({
          ...item,
          label: item.status,
          value: item.id,
        })) || []
    },

    assignFunds(funds: []) {
      this.funds = funds.map((item: IFundResource) => ({
        ...item,
        label: `${item.fund_code} - ${item.fund_name}`,
        value: item.id ?? 0,
        description: item?.description,
      }))
      this.funds_code_label = funds.map((item: IFundResource) => ({
        ...item,
        label: `${item.fund_code}`,
        value: item.id,
        description: item?.description,
      }))

      this.funds_fics = funds.map((item: IFicsFundResource) => ({
        ...item,
        label: `${item.fund_code} - ${item.fund_name}`,
        value: item.id ?? 0,
        description: item?.description,
      }))
      this.funds_code = funds.map((item: IFundResource) => ({
        ...item,
        id: item.id,
        code: item.fund_code,
        name: item.fund_name,
        description: item.fund_name,
        label: item.fund_code || '',
        value: item.id ?? 0,
      }))
    },

    assignGroundBlockingInvestmentStatus(
      status_blocking_reason_investment: []
    ) {
      this.grounds_blocking_investment_status =
        status_blocking_reason_investment.map((q: IStatusResource) => ({
          ...q,
          value: String(q.id),
          label: q.status,
        })) || []
    },
    assignFiduciaryInvestmentPlans(fiduciary_investment_plans: []) {
      this.fiduciary_investment_plans =
        fiduciary_investment_plans.map(
          (item: IFiduciaryInvestmentPlanResource) => ({
            ...item,
            label: `${item.code}`,
            label_code_name: item.collective_investment_fund?.code_name,
            value: item.id,
            fundId: item.collective_investment_fund_id,
            code: item.code,
          })
        ) || []

      this.fiduciary_investment_plans_treasury =
        fiduciary_investment_plans.map(
          (item: IFiduciaryInvestmentPlanResource) => ({
            ...item,
            label: `${item.code} - ${item.status.status}`,
            label_code_name: item.collective_investment_fund?.code_name,
            value: item.id,
          })
        ) || []
    },
    assignAccountingBlocks(accounting_blocks: []) {
      this.accounting_blocks =
        accounting_blocks.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.id}`,
        })) ?? []
    },

    assignFundTypes(fund_types: []) {
      this.fund_types =
        fund_types.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.abbreviation} (${item.description})`,
        })) ?? []
    },

    assingRegions(regions: []) {
      this.regions = regions.map((item: IRegionalResource) => ({
        ...item,
        value: item.id,
        label: `${item.regional_code} - ${item.regional_description}`,
      }))
    },

    assignAuxiliarAccountingParameter(auxiliar_accounting_parameter: []) {
      this.auxiliar_accounting_parameter =
        auxiliar_accounting_parameter.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.description} (${item.abbreviation})`,
        })) ?? []
    },
    assignParticipationTypesCodes(resources: []) {
      this.participation_types_codes =
        resources.map((item: IResource) => ({
          ...item,
          value: item.code ?? '',
          label: `${item.code ?? ''} - ${item.description ?? ''}`,
        })) ?? []
      this.participation_types_codes_assigned_sequence =
        resources.map((item: IResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.code ?? ''} - ${item.description ?? ''}`,
        })) ?? []
    },
    assignFundsToInvestmentPlans(resources: []) {
      this.funts_to_investment_plans =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.fund_code} - ${item.fund_name}`,
        })) ?? []
    },
    assignAccountingParameterCounterPartTypes(resources: []) {
      this.accounting_parameter_counter_part_types =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.label,
          label: `${item.label}`,
        })) ?? []
    },
    assignMonetaryOperationColumns(resources: []) {
      this.monetary_operation_columns =
        resources.map((item: IResource) => ({
          ...item,
          value: String(item.id),
          label: `${item.name}`,
        })) ?? []
    },
    assignStatusesFiduciaryInvestmentPlans(resources: []) {
      this.statuses_fiduciary_investment_plans =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.status}`,
        })) ?? []
    },

    assignStatusInvestmenPlanToFilter(resources: []) {
      this.status_investment_plan_to_filter =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.status}`,
        })) ?? []
    },

    assignPrintGroups(resources: []) {
      this.print_groups =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.description}`,
        })) ?? []
    },

    assignFicProfiles(resources: []) {
      this.fic_profiles =
        resources.map((item: IFilterFundResource) => ({
          ...item,
          value: item.users?.id ?? '',
          label: item.users?.name ?? '',
        })) ?? []
    },

    assignFicBussinessLines(resources: []) {
      this.fic_business_lines =
        resources.map((item: IFilterFundResource) => ({
          ...item,
          value: item.id,
          label: `${item.business_line?.code} - ${item.business_line?.description}`,
        })) ?? []
    },

    assignIdentificationTypesForPlans(resources: []) {
      this.identification_types_for_plans = resources ?? []
    },

    assignStatusFipAccountManagement(resources: []) {
      this.status_fip_account_management =
        resources.map((item: ISelectorResources) => ({
          value: item.id,
          label: item.status,
        })) ?? []
    },
    assignMonetaryOperationTemplates(resources: []) {
      this.monetary_operation_templates =
        resources.map((item: ISelectorResources) => ({
          value: item.value,
          label: item.label,
        })) ?? []
    },
    assignTemplates(resources: []) {
      this.templates =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: item.description,
        })) ?? []
    },

    assignAdjustmentClassMovementsList(resources: []) {
      this.adjustment_class_movements_list =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.value,
          label: item.label,
        })) ?? []
    },

    assignAdjustmentBalanceTypes(resources: []) {
      this.adjustment_balance_types =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.value,
          label: item.label,
        })) ?? []
    },

    assignAdjustmentMovementCodesList(resources: []) {
      this.adjustment_movement_codes_list =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.value,
          label: item.label,
        })) ?? []
    },

    assignAdjustmentTypes(resources: []) {
      this.adjustment_types =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.value,
          label: item.label,
        })) ?? []
    },

    assignInvestmentPlanByHolder(fiduciary_investment_plans_by_holder: []) {
      this.fiduciary_investment_plans_by_holder =
        fiduciary_investment_plans_by_holder.map(
          (item: IFreezeResourcesGeneric) => ({
            ...item,
            label: `${item.code} - ${item.collective_investment_fund?.fund_name}`,
            value: item.id ?? 0,
            description: item.collective_investment_fund?.fund_name,
          })
        ) ?? []
    },

    assignBlockingReasonsOnInvestmentPlans(resources: []) {
      this.blocking_reasons_on_investment_plans =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.description}`,
        })) ?? []
    },

    assignAccountingBlockDestinations(accounting_blocks_destinations: []) {
      this.accounting_block_destinations =
        accounting_blocks_destinations.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.id}`,
        })) ?? []
    },

    assingAccountTypes(resources: []) {
      this.account_types =
        resources.map((item: ISelectorResources) => ({
          ...item,
          value: item.value,
          label: item.label,
        })) ?? []
    },
    assignFundBusinessTrusts(fund_business_trusts: []) {
      this.fund_business_trusts = fund_business_trusts.map(
        (item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.business_code} - ${item.name}`,
        })
      )
    },
    assignPlanBusinessTrusts(plan_business_trusts: []) {
      this.plan_business_trusts = plan_business_trusts.map(
        (item: ISelectorResources) => ({
          ...item,
          label: item.business_code
            ? `${item.business_code} - ${item.name}`
            : '',
          value: item.id,
          code: item.business_code,
        })
      )
    },
    assignStatusOperationInvestmentPlans(
      status_operation_investment_plans: []
    ) {
      this.status_operation_investment_plans =
        status_operation_investment_plans.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.status}`,
          value: item.id,
        }))
    },
    assignNumberOperationInvestmentPlans(
      number_operation_investment_plans: []
    ) {
      this.number_operation_investment_plans =
        number_operation_investment_plans.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.operation_number}`,
          value: item.operation_number,
        }))
    },
    assignBanksCollectiveInvestmentFunds(
      banks_collective_investment_funds: []
    ) {
      this.banks_collective_investment_funds =
        banks_collective_investment_funds.map((item: ISelectorResources) => ({
          label: item.bank_code
            ? `${item.bank_code} - ${item.description}`
            : item.description ?? '',
          value: item.id ?? null,
          description: item.description ?? null,
        })) ?? []

      this.banks_collective_investment_funds =
        this.banks_collective_investment_funds.filter((bank) => !!bank.value)
    },
    assignFicsStatuses(statuses: []) {
      this.statuses = statuses.map((item: ISelectorResources) => ({
        ...item,
        label: item.status,
        value: item.id,
      }))
    },

    assignPlanAccounts(plan_accounts: []) {
      this.plan_accounts =
        plan_accounts.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: item.account_number,
        })) ?? []
    },

    assignCollectiveInvestmentFunds(collective_investment_funds: []) {
      this.info_collective_investment_funds =
        collective_investment_funds.map(
          (item: IInfoCollectiveInvestmentFunds) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.fund_code} - ${item.fund_name}`,
          })
        ) ?? []
    },

    assignFicBankAccountsOperations(fic_bank_accounts_operations: []) {
      this.fic_bank_accounts_operations =
        fic_bank_accounts_operations?.map((item: IFicBankAccount) => {
          const bankAccounts = Array.isArray(item.bank_account)
            ? item.bank_account
            : item.bank_account
            ? [item.bank_account]
            : []

          return {
            ...item,
            bank_account: bankAccounts.map((acc) => ({
              ...acc,
              bank_id: acc.bank_id,
              value: acc.id ?? 0,
              label: `${acc.account_number ?? ''} - ${acc.account_name ?? ''}`,
            })),
          }
        }) ?? []
    },
    assignMovementsAccountingParameters(movements: []) {
      this.movements_accounting_parameters =
        movements.map((item: IResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.code ?? ''} - ${item.description ?? ''}`,
          description: item?.description,
        })) ?? []
    },

    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (value: any, key: string | undefined) => void
      > = {
        movements: this.assignMovements,
        offices: this.assignFicOffices,
        status_business_line: this.assignBusinessLineStatuses,
        bank_account_movements: this.assignMapIdCodeDescription,
        movement_types_by_ids: this.assignMapIdName,
        movement_types_movement_codes: this.assignMapIdCodeDescription,
        movement_classes_movement_codes: this.assignMapIdCodeDescription,
        movement_nature_movement_codes: this.assignMapIdCodeDescription,
        movement_group_movement_codes: this.assignMapIdCodeDescription,
        origin_module_movement_codes: this.assignMapIdCodeDescription,
        status_blocking_reason_investment:
          this.assignGroundBlockingInvestmentStatus,
        funds: this.assignFunds,
        accounting_blocks: this.assignAccountingBlocks,
        fund_types: this.assignFundTypes,
        auxiliar_accounting_parameter: this.assignAuxiliarAccountingParameter,
        business_lines_active: this.assignMapIdCodeDescription,
        participation_types_active: this.assignMapIdCodeDescription,
        fiduciary_commissions: this.assignMapIdCodeDescription,
        fiduciary_commissions_fixed: this.assignMapIdCodeDescription,
        system_operation_channels: this.assignMapIdName,
        commission_assumed: this.assignMapIdIndex,
        search_funds: this.assignMapIdName,
        status_investment_plan_status_modification:
          this.assignBusinessLineStatuses,
        participation_types_codes: this.assignParticipationTypesCodes,
        accounting_parameter_counter_part_types:
          this.assignAccountingParameterCounterPartTypes,
        funts_to_investment_plans: this.assignFundsToInvestmentPlans,
        monetary_operation_columns: this.assignMonetaryOperationColumns,
        regions: this.assingRegions,
        statuses_fiduciary_investment_plans:
          this.assignStatusesFiduciaryInvestmentPlans,
        status_investment_plan_to_filter:
          this.assignStatusInvestmenPlanToFilter,
        print_groups: this.assignPrintGroups,
        fic_profiles: this.assignFicProfiles,
        fic_business_lines: this.assignFicBussinessLines,
        identification_types_for_plans: this.assignIdentificationTypesForPlans,
        status_fip_account_management: this.assignStatusFipAccountManagement,
        movements_codes: this.assignMovementsCodes,
        monetary_operation_templates: this.assignMonetaryOperationTemplates,
        templates: this.assignTemplates,
        adjustment_class_movements_list:
          this.assignAdjustmentClassMovementsList,
        adjustment_movement_codes_list: this.assignAdjustmentMovementCodesList,
        adjustment_types: this.assignAdjustmentTypes,
        funds_fics: this.assignFunds,
        adjustment_balance_types: this.assignAdjustmentBalanceTypes,
        funds_code: this.assignFunds,
        fiduciary_investment_plans_by_holder: this.assignInvestmentPlanByHolder,
        blocking_reasons_on_investment_plans:
          this.assignBlockingReasonsOnInvestmentPlans,
        accounting_block_destinations: this.assignAccountingBlockDestinations,
        account_types: this.assingAccountTypes,
        fiduciary_investment_plans: this.assignFiduciaryInvestmentPlans,
        consolidation_options: this.assignMapIdCodeDescription,
        pt_not_consolidated_without_fund: this.assignMapIdCodeDescription,
        fund_business_trusts: this.assignFundBusinessTrusts,
        plan_business_trusts: this.assignPlanBusinessTrusts,
        status_operation_investment_plans:
          this.assignStatusOperationInvestmentPlans,
        number_operation_investment_plans:
          this.assignNumberOperationInvestmentPlans,
        banks_collective_investment_funds:
          this.assignBanksCollectiveInvestmentFunds,
        statuses: this.assignFicsStatuses,
        plan_accounts: this.assignPlanAccounts,
        get_info_collective_investment_funds:
          this.assignCollectiveInvestmentFunds,
        fic_bank_accounts_operations: this.assignFicBankAccountsOperations,
        participation_types_codes_assigned_sequence:
          this.assignParticipationTypesCodes,
        movements_accounting_parameters:
          this.assignMovementsAccountingParameters,
      }

      await executeApi()
        .get(`${URL_PATH_FICS}/select-tables${params}`)
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

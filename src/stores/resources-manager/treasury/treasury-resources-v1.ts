/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  ISelectorResources,
  IStructureChartAccount,
  IResourceThirdParty,
  IBusinessTrustResource,
  IAccountStructuresByType,
  IAccountingBlockCollectionChartResource,
  IThirdPartyResource,
  IQuotasIssuingPermitsResource,
  IMeanOfPaymentResource,
  ILetterFormatCodeOption,
  ILetterFormatStatus,
  IGenericResource,
  IBusinessBankAccounts,
  ICheckbookResource,
  ISelectorNumResource,
  ISelectorResourceResource,
  ILetterFormatVariableItem,
  ITreauryCancellationsResource,
  IBankAndAccountsResource,
  IBankTrasladeResource,
  IBankListResource,
  ICheckBookInquiryCheckbookResource,
  ICheckBookInquiryBusinessResources,
  IVariablesResource,
  ICheckDataResource,
  ICollectionTypeResource,
  ITreasuryNumberTransferResource,
  IBusinessBankAccountsAuthorization,
  IBanksByBanksAccounts,
  IDispersionLetterStatus,
  IDispersionLetterBusiness,
  IDispersionLetterBanks,
  IGenericwithDateAt,
  IGenerateScatterGroupGeneric,
  IFormatDefinitionMask,
  IBankAccountWithCoinResource,
  ITreasuryMovementCodeExpenseResource,
  ITreasuryBulkUploadsResource,
  IBankingNetworkUploads,
  IPaymentsWithCode,
} from '@/interfaces/customs'

import { IBranchOptions, IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_TREASURIES } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  treasury_type_receive: [] as IResource[],
  third_party_nit: [] as IResourceThirdParty[],
  banks_initial_balance: [] as ISelectorResources[],
  days: [] as IResource[],
  channel: [] as IResource[],
  bank_branches_contacts: [] as IResource[],
  account_structures: [] as IResource[],
  account_structure_structures: [] as IResource[],
  account_structure_purposes: [] as IResource[],
  cash_flow_structure_types: [] as IResource[],
  cash_flow_structure_natures: [] as IResource[],
  cash_flow_structure_activity_groups: [] as IResource[],
  treasury_cancellation_code_type: [] as IResource[],
  sub_receipt_type: [] as IResource[],
  receipt_type: [] as IResource[],
  receipt_type_with_code: [] as IResource[],
  movement_code_override: [] as IResource[],
  nature_movement_codes_list: [] as IResource[],
  operation_movement_codes_list: [] as IResource[],
  dispersion_types: [] as IResource[],
  transaction_types: [] as IResource[],
  type_funds_transfers: [] as IResource[],
  type_means_of_payments: [] as IResource[],
  type_registrations: [] as IResource[],
  reason_return_apply: [] as IResource[],
  reason_return_status: [] as IResource[],
  users_movement_vouchers_request: [] as IResource[],
  account_structures_available: [] as IResource[],
  business_trust: [] as IBusinessTrustResource[],
  banking_network_uploads: [] as IResource[],
  business_trust_on_bank_account_movement: [] as IBusinessTrustResource[],
  bank_branches: [] as IBranchOptions[],
  account_structures_block: [] as IResource[],
  treasury_movement_codes: [] as IResource[],
  commission_rate: [] as IResource[],
  collection_concepts_codes: [] as IResource[],
  accounting_account_contrapart: [] as IResource[],
  third_type: [] as IResource[],
  accounting_account: [] as IResource[],
  account_structures_by_type: {} as IAccountStructuresByType,
  collection_concepts: [] as IResource[],
  accounting_accounts: [] as IResource[],
  cost_centers: [] as IResource[],
  budget_categories: [] as IResource[],
  max_code_collection_blocks: 0,
  business_trusts_egreso: [] as ISelectorResources[],
  payments: [] as ISelectorResources[],
  payments_with_code: [] as IPaymentsWithCode[],
  cost_center_egreso: [] as IResource[],
  bank_account: [] as IBankAccountWithCoinResource[],
  bank_accounts_with_name: [] as IBankAccountWithCoinResource[],
  cash_flow_structure_egreso: [] as IResource[],
  active_third_parties: [] as IResource[],
  bank_account_third_party: [] as IResource[],
  document_type: [] as IResource[],
  movement: [] as ISelectorResources[],
  movement_with_description: [] as ISelectorResources[],
  movement_egreso: [] as ISelectorResources[],
  banks_third_party: [] as ISelectorResources[],
  banks_third_parties: [] as ISelectorResources[],
  bank_branches_third_party: [] as ISelectorResources[],
  available: [] as IResource[],
  third_party_types: [] as IResource[],
  operational_account_charts: [] as IResource[],
  operational_cost_centers: [] as IResource[],
  account_chart_id: [] as IResource[],
  cost_center_structure_id: [] as IResource[],
  aux_type: [] as ISelectorResources[],
  cash_flow_structures: [] as IResource[],
  third_party_id: [] as IResource[],
  origin: [] as IResource[],
  formatType: [] as IResource[],
  validationType: [] as IResource[],
  fileExtension: [] as IResource[],
  fileType: [] as IResource[],
  numericMask: [] as IResource[],
  valueMask: [] as IResource[],
  dateMask: [] as IResource[],
  registerType: [] as IResource[],
  constant: [] as IResource[],
  mask: [] as IResource[],
  variables: [] as IVariablesResource[],
  justification: [] as IResource[],
  cities: [] as IResource[],
  reasons_bank_return: [] as ISelectorResources[],
  bank_account_business: [] as IResource[],
  operation_types: [] as IResource[],
  account_types: [] as IResource[],
  product_types: [] as IResource[],
  bank_account_accounting_account_gmf: [] as IResource[],
  bank_account_cost_centers: [] as IResource[],
  gmf_decimals: [] as IResource[],
  movement_treasury: [] as IResource[],
  validate_balance: [] as IResource[],
  bank_account_accounting_account: [] as IResource[],
  type_thirParty: [] as IResource[],
  bank_account_cost_center: [] as IResource[],
  bank_account_accounting_accounts: [] as IResource[],
  bank_accounts_balances: [] as ISelectorResources[],
  account_types_equivalences: [] as IResource[],
  third_parties: [] as IThirdPartyResource[],
  banks: [] as IResource[],
  banks_code: [] as IResource[],
  types_encrypt: [] as IResource[],
  type_receive: [] as ISelectorResources[],
  operation_collection_types: [] as ICollectionTypeResource[],
  type_receive_with_name: [] as ISelectorResources[],
  bank_accounts_income: [] as ISelectorResources[],
  bank_account_status: [] as IResource[],
  business_trusts_dipersion: [] as ISelectorResources[],
  banks_dispersion: [] as ISelectorResources[],
  dispersion_file_bank_accounts: [] as IGenericResource[],
  banks_dispersion_generate: [] as IGenericResource[],
  bank_account_dispersion: [] as ISelectorResources[],
  dispersion_group: [] as ISelectorResources[],
  account_structures_collection: [] as ISelectorResources[],
  collection_concept_type: [] as ISelectorResources[],
  collection_concept_status: [] as ISelectorResources[],
  bank_account_third_party_quotas: [] as IQuotasIssuingPermitsResource[],
  means_of_payments: [] as IMeanOfPaymentResource[],
  treasury_closing_status: [] as ISelectorResources[],
  treasury_closing_types: [] as ISelectorResources[],
  treasury_cancellation_codes: [] as IGenericResource[],
  treasury_cancellation_types: [] as IGenericResource[],
  treasury_movement_vouchers: [] as IGenericResource[],
  treasury_number_transfers: [] as IGenericResource[],
  business_bank_accounts: [] as IBusinessBankAccounts[],
  sub_receipt_types: [] as IGenericResource[],
  treasury_periods: [] as IGenericResource[],
  receipt_types: [] as IGenericResource[],
  checkbooks: [] as IGenericResource[],
  bank_account_third_parties: [] as IResource[],
  financial_info: [] as IResource[],
  financial_estate: [] as IResource[],
  users_grantor_request: [] as IResource[],
  grantor_states: [] as IResource[],
  business_bank_accounts_check: [] as IBankAndAccountsResource[],
  checks: [] as ISelectorNumResource[],
  banks_record_expenses: [] as ISelectorResources[],
  banks_bank_accounts: [] as ISelectorResources[],
  letter_format_codes: [] as ILetterFormatCodeOption[],
  letter_format_options: [] as ILetterFormatCodeOption[],
  letter_format_statuses: [] as ILetterFormatStatus[],
  cost_center: [] as ISelectorResourceResource[],
  letter_format_variables: [] as ILetterFormatVariableItem[],
  treasury_closing_business: [] as ISelectorResources[],
  movement_egreso_label: [] as ISelectorResources[],
  business_banks_bulk: [] as IGenericResource[],
  business_bank_accounts_bulk: [] as IBusinessBankAccountsAuthorization[],
  business_bank_accounts_with_name: [] as IBusinessBankAccounts[],
  treasury_bank_accounts_with_name: [] as IBusinessBankAccounts[],
  remote_authorization_statuses: [] as IResource[],
  remote_authorization_modules: [] as IResource[],
  check_book_inquiry_checkbooks: [] as ICheckBookInquiryCheckbookResource[],
  check_book_inquiry_businesses: [] as ICheckBookInquiryBusinessResources[],
  dispersion_file_bank_structures: [] as IGenerateScatterGroupGeneric[],
  treasury_movement_code_expense: [] as ITreasuryMovementCodeExpenseResource[],
  treasury_movement_codes_cesiones: [] as ISelectorResources[],
  business_trust_cesion: [] as IBusinessTrustResource[],
  record_expenses: [] as IGenericResource[],
  reasons_for_bank_return: [] as ISelectorResources[],
  dispersion_letter_status: [] as IDispersionLetterStatus[],
  dispersion_letter_business: [] as IDispersionLetterBusiness[],
  dispersion_letter_banks: [] as IDispersionLetterBanks[],
  payments_investment: [] as IGenericResource[],
  bank_account_investment: [] as IGenericResource[],
  business_bank_accounts_authorization: [] as IGenericResource[],
  business_bank_accounts_authorization_id_bank: [] as IGenericResource[],
  banks_by_banks_accounts: [] as IGenericResource[],
  bank_accounts_fics: [] as IResource[],
  banks_label_code: [] as IGenericResource[],
  response_bank_file_types: [] as IGenericResource[],
  response_bank_formats: [] as IGenericResource[],
  response_bank_dispersion_groups: [] as IGenericwithDateAt[],
  third_parties_fics: [] as IGenericResource[],
  movement_statuses: [] as IGenericResource[],
  business_trusts_dipersion_from: [] as ISelectorResources[],
  business_trusts_dipersion_up: [] as ISelectorResources[],
  banks_dispersion_up: [] as ISelectorResources[],
  banks_dispersion_from: [] as ISelectorResources[],
  bank_account_dispersion_from: [] as ISelectorResources[],
  banking_network_upload_request_types: [] as IGenericResource[],
  bank_structures: [] as ISelectorResources[],
  banking_network_upload_statuses: [] as ISelectorResources[],
  format_masks: [] as IFormatDefinitionMask[],
  sub_receipt_type_with_code: [] as IGenericResource[],
  business_trusts_dipersion_generate: [] as ISelectorResources[],
  business_trusts: [] as IGenericResource[],
  bank_account_movement_business: [] as IGenericResource[],
  bank_account_movements_from_business: [] as IGenericResource[],
  bank_account_movements_to_business: [] as IGenericResource[],
  bank_account_movements_from_bank: [] as IGenericResource[],
  bank_account_movements_to_bank: [] as IGenericResource[],
  bank_account_movements_from_bank_account: [] as IGenericResource[],
  bank_account_movements_to_bank_account: [] as IGenericResource[],
  treasury_bulk_uploads: [] as ITreasuryBulkUploadsResource[],
  format_check: [] as IGenericResource[],
  banking_network_uploads_with_details: [] as IBankingNetworkUploads[],
  remote_authorization_processes: [] as IGenericResource[],
  banking_network_uploads_annulated: [] as IGenericResource[],
})

export const useTreasuryResourcesV1 = defineStore('treasury-resources-v1', {
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
    assignMapIdName(resources: never[], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: ISelectorResources | IResource) => ({
          ...item,
          value: item.id,
          label: `${item.name}`,
          category_type: item.category_type ?? null,
        })) || []
    },
    assignMapIdCodeName(resources: never[], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: ISelectorResources | IResource) => ({
          ...item,
          label: `${item.code} - ${item.name}`,
          value: item.id ?? null,
          name: item.name,
        })) || []
    },
    assignAccountStructuresAvailable(account_structures_available: never[]) {
      this.account_structures_available =
        account_structures_available.map((item: IStructureChartAccount) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.code}`,
          nature: item.status?.status ?? '',
          name: `${item.purpose}`,
        })) ?? []
    },
    assignThirdPartyNit(third_party_nit: never[]) {
      this.third_party_nit =
        third_party_nit.map((item: IResourceThirdParty) => ({
          ...item,
          label: `${item.third_party?.document_type?.name} ${item.third_party?.document} ${item.business_name}`,
          value: item.third_party_id ?? null,
        })) ?? []
    },
    assignTreasuryBanks(banks: never[]) {
      this.banks_initial_balance =
        banks.map((item: ISelectorResources) => ({
          ...item,
          label: item.bank_code
            ? `${item.bank_code} - ${item.description}`
            : item.description ?? '',
          value: item.id ?? null,
          code: item.bank_code ?? null,
        })) ?? []

      this.banks_code =
        banks.map((item: ISelectorResources) => ({
          label: item.bank_code ? item.bank_code : item.description ?? '',
          value: item.id ?? null,
          description: item.description ?? null,
        })) ?? []

      this.banks =
        banks.map((item: ISelectorResources) => ({
          label: item.bank_code
            ? `${item.bank_code} - ${item.description}`
            : item.description ?? '',
          value: item.id ?? null,
          description: item.description ?? null,
        })) ?? []

      this.banks_label_code =
        banks.map((item: IGenericResource) => ({
          ...item,
          label: item.code
            ? `${item.code} - ${item.description}`
            : item.description ?? '',
          value: item.id || 0,
        })) ?? []
    },

    assignSubReceiptTypes(sub_receipt_type: never[]) {
      this.sub_receipt_type = sub_receipt_type.map((item: IResource) => ({
        label: item.label ?? item.name ?? item.description ?? String(item.id),
        value: item.id ?? '',
      }))

      this.sub_receipt_type_with_code = sub_receipt_type.map(
        (item: IResource) => ({
          ...item,
          label: `${item.code} - ${item.name}`,
          value: item.id ?? '',
          name: item.name ?? '',
        })
      )
    },
    assignDispersionFileBank(dispersion_file_bank_structures: []) {
      this.dispersion_file_bank_structures =
        dispersion_file_bank_structures.map((item: ISelectorResources) => ({
          label: item.description,
          value: item.id ?? item.value,
          file_extension: item.file_extension?.name
            ? { name: item.file_extension.name }
            : undefined,
          path: item.path,
        }))
    },
    assignReceiptTypes(receipt_type: never[]) {
      this.receipt_type = receipt_type.map((item: IResource) => ({
        label: item.label ?? item.name ?? String(item.id),
        value: item.id ?? item.value,
      }))

      this.receipt_type_with_code = receipt_type.map((item: IResource) => ({
        ...item,
        label: `${item.code} - ${item.name}`,
        value: item.id ?? '',
        name: item.name ?? '',
      }))
    },
    assignUsersMovementVouchers(users_movement_vouchers_request: []) {
      this.users_movement_vouchers_request =
        users_movement_vouchers_request.map((item: IResource) => ({
          label: `${item.name} ${item.last_name}`,
          value: item.id ?? 0,
        }))
    },
    assignTreasuryCancellationsCodes(treasury_cancellation_codes: []) {
      this.treasury_cancellation_codes = treasury_cancellation_codes.map(
        (item: ITreauryCancellationsResource) => ({
          value: item.id ?? 0,
          description: item.type,
          name: item.description,
          label: `${item.cancellation_code} - ${item.description}`,
        })
      )
    },
    assignMoveOverride(MoveOverride: never[]) {
      this.movement_code_override =
        MoveOverride.map((item: IResource) => ({
          label: `${item.code}`,
          value: item.id ?? 0,
        })) ?? []
    },
    assignMovementCodeNatures(nature: never[]) {
      this.nature_movement_codes_list = nature.map((item: IResource) => ({
        label: item.label ?? item.name ?? String(item.id),
        value: item.value,
      }))
    },
    assignOperations(operation: never[]) {
      this.operation_movement_codes_list = operation.map((item: IResource) => ({
        label: item.label ?? item.name ?? String(item.id),
        value: item.value,
      }))
    },
    assignTreasuryMeansOfPayment(treasury_means_of_payment: {
      dispersion_types: never[]
      transaction_types: never[]
      type_funds_transfers: never[]
      type_means_of_payments: never[]
      type_registrations: never[]
    }) {
      this.dispersion_types = treasury_means_of_payment?.dispersion_types ?? []
      this.transaction_types =
        treasury_means_of_payment?.transaction_types ?? []
      this.type_funds_transfers =
        treasury_means_of_payment?.type_funds_transfers ?? []
      this.type_means_of_payments =
        treasury_means_of_payment?.type_means_of_payments ?? []
      this.type_registrations =
        treasury_means_of_payment?.type_registrations ?? []
    },

    assignReasonReturnStatus(reason_return_status: never[]) {
      this.reason_return_status =
        reason_return_status.map((item: ISelectorResources) => ({
          value: item.id,
          label: item.status,
        })) ?? []
    },
    assignTreasuryAccountStructures(account_structures: never[]) {
      this.account_structures =
        account_structures.map((item: ISelectorResources) => ({
          label: item.code,
          value: item.id,
          purpose: item.purpose,
          structure: item.structure,
        })) ?? []
    },
    assignBusinessTrust(business_trust: []) {
      this.business_trust =
        business_trust.map((item: ISelectorResources) => ({
          label: `${item.business_code} - ${item.name}`,
          value: item.id ?? 0,
          name: item.name ?? null,
          business_code: item.business_code ?? null,
          business_type_id: item.business_type_id,
        })) ?? []

      this.business_trust_on_bank_account_movement =
        business_trust.map((item: ISelectorResources) => ({
          label: item.business_code ?? '',
          value: item.id ?? null,
          name: item.name ?? null,
          business_code: item.business_code ?? null,
        })) ?? []
    },
    assignBankingNetworkUploads(banking_network_uploads: []) {
      this.banking_network_uploads =
        banking_network_uploads.map((item: ISelectorResources) => ({
          label: `${item.id}`,
          value: item.id ?? '',
        })) ?? []

      this.banking_network_uploads_with_details =
        banking_network_uploads.map((item: IBankingNetworkUploads) => ({
          ...item,
          label: `${item.id}`,
          value: item.id ?? '',
        })) ?? []
    },
    assignBankBranchesContacts(bank_branches: []) {
      this.bank_branches_contacts =
        bank_branches.map((branch: IResource) => ({
          value: branch.id ?? '',
          label: `${branch.code}  ${branch.name} `,
        })) ?? []
    },
    assignAccountStructuresBlock(account_structures_block: never[]) {
      this.account_structures_block =
        account_structures_block.map((item: IResource) => ({
          value: item.id ?? 0,
          label: `${item.code} - ${item.purpose}`,
          structure: item.structure,
          purpose: item.purpose,
        })) ?? []
    },
    assignTreasuryMovementCodes(treasury_movement_codes: never[]) {
      this.treasury_movement_codes =
        treasury_movement_codes
          ?.slice()
          .sort((a: IResource, b: IResource) => a.code!.localeCompare(b.code!))
          .map((item: IResource) => ({
            value: item.id ?? 0,
            label: `${item.code} - ${item.description}`,
            description: item.description,
            nature: item.nature,
            handles_accounting_offset: item.handles_accounting_offset,
          })) ?? []
    },
    assignCommissionRate(commission_rate: never[]) {
      this.commission_rate =
        commission_rate.map((item: IResource) => ({
          value: item.value ?? 0,
          label: item.label ?? '',
        })) ?? []
    },
    assignCollectionConceptsCodes(collection_concepts_codes: never[]) {
      this.collection_concepts_codes =
        collection_concepts_codes.map((item: IResource) => ({
          value: item.id ?? 0,
          label: `${item.structure_code} - ${item.description}` || '',
        })) ?? []
    },
    assignAccountingAccountCounterpart(accounting_account_contrapart: never[]) {
      this.accounting_account_contrapart =
        accounting_account_contrapart.map((item: ISelectorResources) => ({
          value: item.id,
          label: `${item.code} - ${item.name}`,
          name: item.name,
          account_structure: item.account_structure,
        })) ?? []
    },
    assignAccountingAccount(accounting_account: never[]) {
      this.accounting_account =
        accounting_account.map((item: ISelectorResources) => ({
          value: item.id,
          label: `${item.code} ${item.name}`,
          name: item.name,
          code: item.code,
          account_structure: item.account_structure,
        })) ?? []
    },
    assignAccountStructuresByType(
      account_structures_by_type: IAccountStructuresByType
    ) {
      this.account_structures_by_type = account_structures_by_type ?? {}

      this.collection_concepts =
        this.account_structures_by_type['Catálogo de conceptos recaudo']?.map(
          (item) => ({
            value: item.id,
            label: item.structure,
          })
        ) ?? []
      this.accounting_accounts =
        this.account_structures_by_type['Catálogo de cuentas contables']?.map(
          (item) => ({
            value: item.id,
            label: item.structure,
          })
        ) ?? []
      this.cost_centers =
        this.account_structures_by_type['Catálogo de centros de costo']?.map(
          (item) => ({
            value: item.id,
            label: item.structure,
          })
        ) ?? []
      this.budget_categories =
        this.account_structures_by_type['Catálogo de rubros presupuestal']?.map(
          (item) => ({
            value: item.id,
            label: item.structure,
          })
        ) ?? []
    },
    assignAccountingBlocksCollectionCode(accounting_blocks_collection_code: {
      max_code: number
    }) {
      this.max_code_collection_blocks =
        accounting_blocks_collection_code.max_code ?? 0
    },
    assignBusinessTrustsEgreso(business_trusts_egreso: never[]) {
      this.business_trusts_egreso =
        business_trusts_egreso.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.business_code} - ${item.name}`,
          value: item.id ?? null,
          name: item.name ?? null,
          account: item.account ?? null,
          treasurie: item.treasurie ?? null,
        })) ?? []

      this.bank_account_movement_business =
        business_trusts_egreso.map((item: ISelectorResources) => ({
          label: `${item.business_code} - ${item.name}`,
          value: item.business_code ?? null,
          id: item.id ?? null,
          name: item.name ?? null,
        })) ?? []
    },
    assignPayments(payments: never[]) {
      this.payments =
        payments.map((item: ISelectorResources) => ({
          ...item,
          label: item.description ?? null,
          value: item.id ?? null,
          type_mean_of_payments: item.type_mean_of_payments ?? null,
          authorized_payment: item.authorized_payment ?? null,
          payment_instructions: item.payment_instructions ?? null,
          request_bank_withdrawal: item.request_bank_withdrawal ?? null,
        })) ?? []

      this.payments_with_code =
        payments.map((item: IPaymentsWithCode) => ({
          ...item,
          label: `${item.code} - ${item.description}`,
          value: item.id ?? '',
        })) ?? []

      this.payments_investment = payments.map((item: ISelectorResources) => ({
        value: item.id || item.value || '',
        label: item.type_mean_of_payments || '',
        code: item.code || '',
        description: item.description || '',
      }))
    },
    assignCostCenterEgreso(cost_center_egreso: never[]) {
      this.cost_center_egreso =
        cost_center_egreso.map((item: ISelectorResources) => ({
          label: `${item.code ?? ''} - ${item.name ?? ''}`,
          value: item.id ?? null,
          account_structure: item.account_structure ?? null,
        })) ?? []
    },
    assignBankAccount(bank_account: never[]) {
      this.bank_account =
        bank_account.map((item: IBankAccountWithCoinResource) => ({
          ...item,
          label: item.account_number ?? null,
          value: item.id ?? null,
          coin_type: item.coin_type ?? null,
          name: item.account_number + ' - ' + item.account_name,
        })) ?? []

      this.bank_accounts_with_name =
        bank_account.map((item: IBankAccountWithCoinResource) => ({
          ...item,
          label: `${item.account_number} - ${item.account_name}`,
          value: item.id,
        })) ?? []

      this.bank_accounts_balances =
        bank_account.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.account_number} - ${item.account_name}`,
          value: item.id,
        })) ?? []
      this.bank_account_investment = bank_account.map(
        (item: ISelectorResources) => ({
          value: item.id || item.value || '',
          label: item.account_number || '',
        })
      )
    },
    assignCashFlowStructureEgreso(cash_flow_structure_egreso: never[]) {
      this.cash_flow_structure_egreso = cash_flow_structure_egreso.map(
        (item: ISelectorResources) => ({
          label: `${item.code} - ${item.name}`,
          value: item.id ?? null,
          account_structure: item.account_structure ?? null,
          name: item.name,
        })
      )
    },
    assignActiveThirdParties(third_parties: never[]) {
      this.active_third_parties =
        third_parties.map((item: ISelectorResources) => ({
          label: `${item.document} - ${item.name}`,
          value: item.id ?? null,
          document: item.document ?? null,
        })) ?? []

      this.third_party_id =
        third_parties.map((item: IResource) => ({
          ...item,
          label: item.document + ' - ' + item.name,
          value: item.id ?? 1,
        })) ?? []

      this.third_parties =
        third_parties.map((item: IThirdPartyResource) => ({
          ...item,
          label: `${item.document ?? ''} - ${item.name ?? ''}`,
          value: item.id ?? null,
        })) ?? []

      this.third_parties_fics = third_parties.map(
        (item: ISelectorResources) => ({
          value: item.id ?? null,
          label: `${item.document}`,
          description: item.name ?? null,
        })
      )
    },
    assignBackAccountThirdParty(bank_account_third_party: never[]) {
      this.bank_account_third_party =
        bank_account_third_party.map((item: ISelectorResources) => ({
          label: `${item.account_number} - ${item.account_name}`,
          value: item.id ?? null,
          bank: item.bank ?? null,
        })) ?? []

      this.bank_account_third_party_quotas =
        bank_account_third_party.map((item: IQuotasIssuingPermitsResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.account_number} - ${item.account_name}`,
        })) ?? []
    },
    assignDocumentTypes(document_type: never[]) {
      this.document_type =
        document_type.map((item: ISelectorResources) => ({
          label: item.name ?? null,
          value: item.id ?? null,
        })) ?? []
    },
    assignMovements(movement: never[]) {
      this.movement =
        movement.map((item: ISelectorResources) => ({
          ...item,
          label: item.code,
          value: item.id ?? null,
          receipt_types: item.receipt_types,
          sub_receipt_types: item.sub_receipt_types,
        })) ?? []

      this.movement_with_description =
        movement.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.code} - ${item.description}`,
          value: item.id ?? null,
          receipt_types: item.receipt_types,
          sub_receipt_types: item.sub_receipt_types,
        })) ?? []
    },
    assignMovementEgreso(movement_egreso: never[]) {
      this.movement_egreso =
        movement_egreso.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.code} - ${item.description}`,
          value: item.id ?? null,
          receipt_types: item.receipt_types,
          sub_receipt_types: item.sub_receipt_types,
        })) ?? []

      this.movement_egreso_label =
        movement_egreso.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.code} - ${item.description}`,
          value: item.id ?? null,
          receipt_types: item.receipt_types,
          sub_receipt_types: item.sub_receipt_types,
        })) ?? []
    },
    assignTreasuryMovementExpense(treasury_movement_code_expense: never[]) {
      this.treasury_movement_code_expense =
        treasury_movement_code_expense.map(
          (item: ITreasuryMovementCodeExpenseResource) => ({
            ...item,
            label: `${item.code} - ${item.description}`,
            value: item.id ?? null,
            receipt_types: item.receipt_types,
            sub_receipt_types: item.sub_receipt_types,
          })
        ) ?? []
    },
    assignBankThirdParty(banks_third_party: never[]) {
      this.banks_third_party =
        banks_third_party.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.bank_code} - ${item.description}`,
          value: item.id ?? null,
        })) ?? []
    },
    assignThirdPartyTypes(third_party_types: never[]) {
      this.third_party_types = third_party_types.map((item: IResource) => ({
        value: item.value,
        label: item.label,
      }))
    },
    assignDispersionLetterStatus(dispersion_letter_status: never[]) {
      this.dispersion_letter_status = dispersion_letter_status.map(
        (item: IDispersionLetterStatus) => ({
          ...item,
          value: item.id,
          label: item.status,
        })
      )

      this.dispersion_letter_status.unshift({
        value: '',
        label: 'Todos',
        id: 0,
        status: '',
      })
    },
    assignDispersionLetterBusiness(dispersion_letter_business: never[]) {
      this.dispersion_letter_business = dispersion_letter_business.map(
        (item: IDispersionLetterBusiness) => ({
          ...item,
          value: item.id,
          label: item.business,
        })
      )
    },
    assignDispersionLetterBanks(dispersion_letter_banks: never[]) {
      this.dispersion_letter_banks = dispersion_letter_banks.map(
        (item: IDispersionLetterBanks) => ({
          ...item,
          value: item.id,
          label: `${item.bank_code ?? ''} - ${item.description ?? ''}`,
        })
      )
    },
    assignOperationalAccountCharts(operational_account_charts: never[]) {
      this.operational_account_charts =
        operational_account_charts.map((item: IResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.code ?? ''} - ${item.name ?? ''}`,
          code: item.code,
        })) ?? []
    },
    assignOperationalCostCenter(operational_cost_centers: never[]) {
      this.operational_cost_centers =
        operational_cost_centers.map((item: IResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.code ?? ''} - ${item.name ?? ''}`,
          name: item.name,
        })) ?? []
    },
    assignAccountingBlockCollectionsCharts(
      accounting_block_collections_charts: [
        IAccountingBlockCollectionChartResource
      ]
    ) {
      this.account_chart_id =
        accounting_block_collections_charts[0]?.accounting_structure.accounts_chart.map(
          (item: IResource) => ({
            label: item.name ?? '',
            value: item.id ?? '',
          })
        ) ?? []

      this.cost_center_structure_id =
        accounting_block_collections_charts[0].cost_center_structure.cost_centers.map(
          (item: ISelectorResources) => ({
            label: item.name,
            value: item.id,
          })
        ) ?? []
    },
    assignCounterAuxiliaryType(counter_auxiliary_type: never[]) {
      this.aux_type =
        counter_auxiliary_type.map((item: ISelectorResources) => ({
          ...item,
          label: item.label ?? item.name,
          value: item.value ?? item.id,
        })) ?? []
    },
    assignCashFlowStructures(cash_flow_structures: never[]) {
      this.cash_flow_structures = cash_flow_structures.map(
        (item: IResource) => {
          return {
            value: item.id ?? '',
            label: `${item.code} - ${item.name}`,
          }
        }
      )
    },
    assignCashFlowStructure(cash_flow_structure: never[]) {
      this.cash_flow_structures = cash_flow_structure.map((item: IResource) => {
        return {
          ...item,
          value: item.id ?? '',
          label: `${item.code} - ${item.purpose}`,
        }
      })
    },
    assignReasonForBankReturn(reasonsForBankReturn: never[]) {
      this.reasons_bank_return = reasonsForBankReturn.map(
        (item: ISelectorResources) => ({
          ...item,
          label: item.name,
          value: item.id,
        })
      )
    },
    assignBankAccountBusiness(bank_account_business: never[]) {
      this.bank_account_business =
        bank_account_business.map((item: ISelectorResources) => ({
          label: `${item.business_code} - ${item.name}`,
          value: item.id ?? null,
        })) ?? []
    },
    assignBankAccountCostCenters(bank_account_cost_centers: never[]) {
      this.bank_account_cost_centers =
        bank_account_cost_centers.map((item: ISelectorResources) => ({
          label: `${item.code} - ${item.name}`,
          value: item.id ?? null,
        })) ?? []
    },
    assignMovementTreasury(movement_treasury: never[]) {
      this.movement_treasury =
        movement_treasury.map((item: ISelectorResources) => ({
          label: `${item.code} - ${item.description}`,
          value: item.id ?? null,
        })) ?? []
    },
    assignTreasuryTypeReceipt(treasury_type_receive: never[]) {
      this.treasury_type_receive = treasury_type_receive ?? []
    },
    assignAccountTypes(account_types: never[]) {
      this.account_types_equivalences = account_types.map(
        (item: ISelectorResources, index: number) => ({
          label: item.label,
          value: index + 1,
        })
      )

      this.account_types = account_types.map((item: ISelectorResources) => ({
        label: item.label,
        value: item.value,
      }))
    },
    assignTypesEncrypt(types_encrypt: IResource[]) {
      this.types_encrypt =
        types_encrypt.map((item: IResource) => ({
          ...item,
          label: String(item.value),
        })) ?? []
    },
    assignTypeReceive(typeReceive: never[]) {
      this.type_receive =
        typeReceive.map((item: ISelectorResources) => {
          return {
            ...item,
            value: item.id,
            label: item.description,
            type_receive: item.type_receive ?? '',
          }
        }) ?? []
      this.operation_collection_types =
        typeReceive
          .map((item: ICollectionTypeResource) => {
            return {
              ...item,
              value: item.id ?? 0,
              label: `${item.code}`,
              type_receive: item.type_receive ?? '',
            }
          })
          ?.sort(
            (a: ICollectionTypeResource, b: ICollectionTypeResource) =>
              Number(a.code) - Number(b.code)
          ) ?? []

      this.type_receive_with_name =
        typeReceive
          .map((item: ISelectorResources) => {
            return {
              ...item,
              value: item.id,
              label: `${item.code} - ${item.description}`,
              type_receive: item.type_receive ?? '',
            }
          })
          ?.sort(
            (a: ICollectionTypeResource, b: ICollectionTypeResource) =>
              Number(a.code) - Number(b.code)
          ) ?? []
    },
    assignMeansOfPayment(means_of_payments: never[]) {
      this.means_of_payments = means_of_payments?.map(
        (item: IMeanOfPaymentResource) => ({
          ...item,
          value: item.id,
          label: `${item.code} - ${item.type_mean_of_payments}`,
        })
      )
    },
    assignBankAccountIncomes(bank_accounts_income: never[]) {
      this.bank_accounts_income =
        bank_accounts_income.map((item: ISelectorResources) => {
          return {
            ...item,
            value: item.id ?? null,
            label: `${item.account_number} - ${item.account_name}`,
          }
        }) ?? []
    },
    assignBankAccountStatus(bank_account_status: never[]) {
      this.bank_account_status =
        bank_account_status.map((item: ISelectorResources) => ({
          label: item.status,
          value: item.id ?? null,
        })) ?? []
    },
    assignBusinessTrustDispersion(business_trusts_dipersion: never[]) {
      if (!Array.isArray(business_trusts_dipersion)) return
      this.business_trusts_dipersion =
        business_trusts_dipersion.map((q: ISelectorResources) => ({
          ...q,
          value: String(q.id),
          label: `${q.business_code} - ${q.name}`,
          name: q.name,
        })) || []

      this.business_trusts_dipersion_up =
        business_trusts_dipersion.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          code: item.business_code,
          label: `${item.business_code} - ${item.name}`,
        })) || []

      this.business_trusts_dipersion_generate =
        business_trusts_dipersion.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.business_code} - ${item.name}`,
        })) || []
    },
    assignBanksDispersion(banks_dispersion: never[]) {
      if (!Array.isArray(banks_dispersion)) return
      this.banks_dispersion =
        banks_dispersion.map((q: ISelectorResources) => ({
          ...q,
          value: String(q.id),
          label: `${q.bank_code} - ${q.description}`,
          name: q.description,
        })) || []

      this.banks_dispersion_up =
        banks_dispersion.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.bank_code} - ${item.description}`,
          name: item.description,
        })) || []
      this.banks_dispersion_generate =
        banks_dispersion.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.bank_code} - ${item.description}`,
        })) || []
    },

    assignDispersionFileBankAccounts(dispersion_file_bank_accounts: never[]) {
      if (!Array.isArray(dispersion_file_bank_accounts)) return
      this.dispersion_file_bank_accounts =
        (dispersion_file_bank_accounts.map((q: ISelectorResources) => ({
          ...q,
          value: String(q.id),
          label: `${q.account_number} - ${q.account_name}`,
          name: q.account_name,
        })) as ISelectorResources[]) || []
    },

    assignBankAccountDispersion(bank_account_dispersion: never[]) {
      if (!Array.isArray(bank_account_dispersion)) return

      this.bank_account_dispersion =
        bank_account_dispersion.map((q: ISelectorResources) => ({
          ...q,
          value: String(q.id),
          label: q.account_number,
          name: `${q.account_name}`,
        })) || []
    },
    assignDispersionGroup(dispersion_group: never[]) {
      if (!Array.isArray(dispersion_group)) return

      this.dispersion_group =
        dispersion_group.map((q: ISelectorResources) => ({
          ...q,
          value: q.id,
          label: String(q.id),
        })) || []
    },
    assignStructureConcepts(account_structures_collection: never[]) {
      this.account_structures_collection =
        account_structures_collection.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.code} - ${item.purpose}`,
          value: item.id ?? null,
          purpose: item.purpose ?? null,
        })) ?? []
    },
    assignCollectionConceptType(collection_type: never[]) {
      this.collection_concept_type =
        collection_type.map((item: ISelectorResources) => ({
          ...item,
          label: item.label,
          value: item.value,
        })) ?? []
    },
    assignCollectionConceptStatus(collection_status: never[]) {
      this.collection_concept_status =
        collection_status.map((item: ISelectorResources) => ({
          ...item,
          label: item.status,
          value: item.id,
        })) ?? []
    },
    assignTreasuryClosingStatus(treasury_closing_status: never[]) {
      this.treasury_closing_status =
        treasury_closing_status.map((item: ISelectorResources) => ({
          ...item,
          label: item.status,
          value: item.id,
        })) ?? []
    },
    assignTreasuryClosingTypes(treasury_closing_types: never[]) {
      this.treasury_closing_types =
        treasury_closing_types.map((item: ISelectorResources) => ({
          ...item,
          label: item.label,
          value: item.value,
        })) ?? []
    },
    assignBankThirdParties(banks_third_parties: never[]) {
      this.banks_third_parties =
        banks_third_parties.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.bank_code} - ${item.description}`,
          value: item.id ?? null,
        })) ?? []
    },
    assignTreasuryMovementVouchers(treasury_movement_vouchers: never[]) {
      this.treasury_movement_vouchers =
        treasury_movement_vouchers.map((item: ISelectorResources) => ({
          label: `${item.id} - ${item.code.toString()}`,
          value: item.id ?? 0,
        })) ?? []
    },
    assignBackAccountThirdParties(bank_account_third_parties: never[]) {
      this.bank_account_third_parties =
        bank_account_third_parties.map((item: ISelectorResources) => ({
          label: item.account_number,
          value: item.id,
        })) ?? []
    },

    assignCheckbooks(checkbooks: ICheckbookResource[]): void {
      this.checkbooks = checkbooks.map((item) => ({
        label: item.code,
        value: item.id,
      }))
    },

    assignChecks(checks: ICheckDataResource[]): void {
      this.checks = checks.map((item) => ({
        label: item.consecutive,
        value: item.consecutive,
      }))
    },

    assignFinancialInfo(resource: never[]) {
      this.financial_info =
        resource.map((item: ISelectorResources) => ({
          ...resource,
          label: item.describe_funding_source ?? item.funding_source ?? '',
          value: item.id,
        })) ?? []
    },

    assignFinancialEstate(resource: never[]) {
      this.financial_estate =
        resource.map((item: ISelectorResources) => ({
          ...resource,
          label: item.contractual_relationship ?? item.source_of_goods ?? '',
          value: item.id,
        })) ?? []
    },

    assignReasonReturnApply(reason_return_apply: never[]) {
      this.reason_return_apply =
        reason_return_apply.map((item: ISelectorResources) => ({
          label: item.label,
          value: item.value,
        })) ?? []
    },

    assignUsersGrantorRequest(users_grantor_request: never[]) {
      this.users_grantor_request =
        users_grantor_request.map((item: ISelectorResources) => ({
          label: item.name,
          value: item.id,
        })) ?? []
    },

    assignGrantorStates(grantor_states: never[]) {
      this.grantor_states =
        grantor_states.map((item: ISelectorResources) => ({
          label: item.status,
          value: item.id,
        })) ?? []
    },

    assignTreasuryBanksRecordExpenses(banks_record_expenses: never[]) {
      this.banks_record_expenses =
        banks_record_expenses.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.bank_code} - ${item.description}`,
          value: item.id ?? null,
        })) ?? []
    },

    assignBanksBankAccounts(banks_bank_accounts: never[]) {
      this.banks_bank_accounts =
        banks_bank_accounts.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.bank_code} - ${item.description}`,
          value: item.id ?? null,
        })) ?? []
    },

    assignTreasuryNumberTransfers(treasury_number_transfers: never[]) {
      this.treasury_number_transfers =
        treasury_number_transfers.map(
          (item: ITreasuryNumberTransferResource) => ({
            label: `${item.id} - ${item.observations}`,
            value: item.id ?? 0,
          })
        ) ?? []
    },

    assignLetterFormatCodes(letter_format_codes: never[]) {
      this.letter_format_codes =
        letter_format_codes.map((item: { code: string; name: string }) => ({
          ...item,
          id: item.code,
          label: `${item.code}`,
          value: item.code,
        })) ?? []

      this.letter_format_options =
        letter_format_codes.map((item: { code: string; name: string }) => ({
          ...item,
          id: item.code,
          label: `${item.code} - ${item.name}`,
          value: item.code,
        })) ?? []
    },
    assignLetterFormatStatuses(letter_format_statuses: never[]) {
      this.letter_format_statuses =
        letter_format_statuses.map((item: ILetterFormatStatus) => ({
          ...item,
          label: item.label,
          value: item.value,
        })) ?? []
    },
    assignLetterFormatVariables(letter_format_variables: {
      general?: Record<string, string>
      source_payer?: Record<string, string>
      destination?: Record<string, string>
    }) {
      const toItems = (obj?: Record<string, string>) =>
        Object.entries(obj ?? {}).map(([key, label]) => ({
          key,
          label,
        }))

      this.letter_format_variables = [
        ...toItems(letter_format_variables.general),
        ...toItems(letter_format_variables.source_payer),
        ...toItems(letter_format_variables.destination),
      ]
    },
    assignCostCenter(cost_centers: never[]) {
      if (typeof cost_centers === 'string') return
      this.cost_centers =
        cost_centers.map((item: IBankTrasladeResource) => ({
          label: `${item.code} - ${item.name}`,
          value: item.id ?? null,
        })) ?? []
    },

    assignBusinessBanksAndAccounts(business_bank_accounts: never[]): void {
      const grouped = business_bank_accounts.reduce<
        Record<number, IBankAndAccountsResource>
      >((acc, item: IBankListResource) => {
        const bankId = item.bank.id

        if (!acc[bankId]) {
          acc[bankId] = {
            label: `${item.bank.bank_code} - ${item.bank.description}`,
            value: bankId,
            payload: {
              bank: {
                bank_name: item.bank.description,
                bank_description: item.bank.type,
                bank_code: item.bank.code,
                code: item.bank.bank_code ?? '',
                bank_id: bankId,
              },
              account: [],
            },
          }
        }

        let bank_transfer_balance: number | string = 0
        if (item.balances?.length) {
          bank_transfer_balance = item.balances[0].final_balance_local
        } else if (item.initial_balances?.length) {
          bank_transfer_balance =
            item.initial_balances[0].initial_balance_local_currency
        }
        acc[bankId].payload.account.push({
          label: `${item.account_number} - ${item.account_name}`,
          value: item.id,
          account_name: item.account_name,
          account_id: item.id,
          account_number: item.account_number,
          TRM: +(Math.random() * (4200 - 4000) + 4000).toFixed(2),
          coin_type: item.coin_type,
          balances:
            !item.initial_balances || item.initial_balances.length === 0
              ? 0
              : item.initial_balances[0].initial_balance_local_currency,
          bank_transfer_balance: bank_transfer_balance,
        })

        return acc
      }, {})

      this.business_bank_accounts_check = Object.values(grouped).sort((a, b) =>
        a.label.localeCompare(b.label)
      )

      this.business_bank_accounts_bulk =
        business_bank_accounts.map(
          (item: IBusinessBankAccountsAuthorization) => ({
            ...item,
            label: `${item.account_number} - ${item.account_name}`,
            value: item.id ?? '',
            name: item.account_name,
            bank_id: item.bank_id,
          })
        ) ?? []

      const uniqueBanksMap = new Map<
        number,
        IBusinessBankAccountsAuthorization
      >()
      business_bank_accounts.forEach(
        (item: IBusinessBankAccountsAuthorization) => {
          if (item.bank_id && !uniqueBanksMap.has(Number(item.bank_id))) {
            uniqueBanksMap.set(Number(item.bank_id), item)
          }
        }
      )
      this.business_banks_bulk =
        Array.from(uniqueBanksMap.values()).map(
          (item: IBusinessBankAccountsAuthorization) => ({
            label: `${item.bank?.bank_code} - ${item.bank?.description}`,
            value: item.bank_id ?? '',
            name: item.bank?.description,
          })
        ) ?? []

      this.treasury_bank_accounts_with_name =
        business_bank_accounts
          .map((item: IBusinessBankAccounts['payload']) => ({
            label: `${item.account_number} - ${item.account_name}`,
            value: item.id,
            payload: {
              ...item,
              TRM: +(Math.random() * (4200 - 4000) + 4000).toFixed(2),
            },
          }))
          .sort((a, b) => a.label.localeCompare(b.label)) ?? []

      this.business_bank_accounts_with_name =
        business_bank_accounts.map(
          (item: IBusinessBankAccounts['payload']) => ({
            label: `${item.account_number} - ${item.account_name}`,
            value: item.id,
            payload: {
              ...item,
              TRM: +(Math.random() * (4200 - 4000) + 4000).toFixed(2),
            },
          })
        ) ?? []
      this.business_bank_accounts =
        business_bank_accounts.map(
          (item: IBusinessBankAccounts['payload']) => ({
            label: item.account_number,
            value: item.id,
            payload: {
              ...item,
              TRM: +(Math.random() * (4200 - 4000) + 4000).toFixed(2),
            },
          })
        ) ?? []
    },
    assignTreasuryPeriods(treasury_periods: never[]) {
      this.treasury_periods =
        treasury_periods.map((item: ITreauryCancellationsResource) => ({
          label: item.period,
          value: item.period ?? '',
        })) ?? []
    },
    assignCheckBookInquiryCheckbooks(
      checkbooks: ICheckBookInquiryCheckbookResource[]
    ) {
      this.check_book_inquiry_checkbooks =
        checkbooks.map((item) => ({
          ...item,
          label: item.code,
          value: item.id,
        })) ?? []
    },
    assignCheckBookInquiryBusinesses(
      data: ICheckBookInquiryBusinessResources[]
    ) {
      this.check_book_inquiry_businesses = data
    },

    assignRemoteAuthorizationStatuses(
      remote_authorization_statuses: IResource[]
    ) {
      this.remote_authorization_statuses = Array.isArray(
        remote_authorization_statuses
      )
        ? remote_authorization_statuses.map((item: IResource) => ({
            label: item.name ?? '',
            value: item.id ?? '',
          }))
        : []
    },
    assignRemoteAuthorizationModules(remote_authorization_modules: never[]) {
      this.remote_authorization_modules =
        remote_authorization_modules.map((item: IResource) => ({
          ...item,
          label: item.label,
          value: item.value,
        })) ?? []
    },
    assignTreasuryClosingBusiness(treasury_closing_business: never[]) {
      this.treasury_closing_business =
        treasury_closing_business.map((item: ISelectorResources) => ({
          ...item,
          label: String(item.business),
          value: item.id,
        })) ?? []
    },
    assignTreasuryMovementCodesCesiones(
      treasury_movement_codes_cesiones: never[]
    ) {
      this.treasury_movement_codes_cesiones =
        treasury_movement_codes_cesiones.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.code} - ${item.description}`,
          value: item.id,
        })) ?? []
    },

    assignBusinessTrustCesiones(business_trust_cesion: never[]) {
      this.business_trust_cesion =
        business_trust_cesion.map((item: ISelectorResources) => ({
          label: `${item.business_code} - ${item.name}`,
          value: item.id ?? null,
          name: item.name ?? null,
          business_code: item.business_code ?? null,
          business_type_id: item.business_type_id,
        })) ?? []
    },

    assignRecordExpenses(record_expenses: never[]) {
      this.record_expenses =
        record_expenses.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.id}`,
          value: item.id,
        })) ?? []
    },
    assignBusinessBankAccountsAuthorization(
      business_bank_accounts_authorization: never[]
    ) {
      const banksMap = new Map<number, IBanksByBanksAccounts>()

      this.business_bank_accounts_authorization =
        business_bank_accounts_authorization.map(
          (item: IBusinessBankAccountsAuthorization) => {
            if (
              item.bank &&
              item.bank.id !== undefined &&
              !banksMap.has(item.bank.id)
            ) {
              banksMap.set(item.bank.id, {
                ...item.bank,
                label: `${item.bank.bank_code} - ${item.bank.description}`,
                value: item.bank.id ?? 0,
                bank_account_id: item.id,
              })
            }
            return {
              label: `${item.account_bank} - ${item.account_name}`,
              value: item.id ?? 0,
              bank_id: item.bank?.id ?? null,
            }
          }
        ) ?? []

      this.banks_by_banks_accounts = [...banksMap.values()]
    },
    assignBankAccountsFics(bank_accounts_fics: never[]) {
      this.bank_accounts_fics =
        bank_accounts_fics.map((item: IResource) => ({
          ...item,
        })) ?? []
    },

    assignResponseBankFileTypes(response_bank_file_types: never[]) {
      this.response_bank_file_types =
        response_bank_file_types.map((item: ISelectorResources) => ({
          ...item,
        })) ?? []
    },

    assignResponseBankDispersionGroups(response_bank_dispersion_groups: []) {
      this.response_bank_dispersion_groups =
        response_bank_dispersion_groups.map((item: IGenericwithDateAt) => ({
          ...item,
          label: `${String(item.id ?? '')} - ${item.created_at ?? ''}`,
          value: item.id ?? null,
        })) ?? []
    },

    assignMovementStatuses(movement_statuses: never[]) {
      this.movement_statuses =
        movement_statuses.map((item: ISelectorResources) => ({
          label: item.status,
          value: item.id,
        })) ?? []
    },

    assignBankingNetworkUploadRequestTypes(
      banking_network_upload_request_types: never[]
    ) {
      this.banking_network_upload_request_types =
        banking_network_upload_request_types.map((item: IResource) => ({
          ...item,
        })) ?? []
    },

    assignBankStructures(bank_structures: never[]) {
      this.bank_structures =
        bank_structures.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.code} - ${item.description}`,
          value: item.id,
        })) ?? []
    },

    assignResponseBankFormats(response_bank_formats: never[]) {
      this.response_bank_formats =
        response_bank_formats.map((item: ISelectorResources) => ({
          ...item,
          label: item.code
            ? `${item.code} - ${item.description}`
            : item.description ?? '',
          value: item.id,
        })) ?? []
    },

    assignBankingNetworkUploadStatuses(
      banking_network_upload_statuses: never[]
    ) {
      this.banking_network_upload_statuses =
        banking_network_upload_statuses.map((item: ISelectorResources) => ({
          ...item,
          label: item.status,
          value: item.id,
        })) ?? []
    },

    assignBusinessTrustDispersionFrom(business_trusts_dipersion_from: never[]) {
      if (!Array.isArray(business_trusts_dipersion_from)) return
      this.business_trusts_dipersion_from =
        business_trusts_dipersion_from.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          code: item.business_code,
          label: `${item.business_code} - ${item.name}`,
        })) || []
    },

    assignBanksDispersionFrom(banks_dispersion_from: never[]) {
      this.banks_dispersion_from =
        banks_dispersion_from.map((item: ISelectorResources) => ({
          ...item,
          value: item.id,
          label: `${item.bank_code} - ${item.description}`,
          name: item.description,
        })) || []
    },

    assignBankAccountDispersionFrom(bank_account_dispersion: never[]) {
      if (!Array.isArray(bank_account_dispersion)) return

      this.bank_account_dispersion_from =
        bank_account_dispersion.map((q: ISelectorResources) => ({
          ...q,
          value: String(q.id),
          label: `${q.account_name} - ${q.account_number}`,
          name: `${q.account_name}`,
        })) || []
    },
    assignAccountTypesEquivalences(account_types_equivalences: never[]) {
      this.account_types_equivalences = account_types_equivalences.map(
        (item: ISelectorResources, index: number) => ({
          label: item.label,
          value: index + 1,
        })
      )
    },

    assignFormatMasks(format_mask: never[]) {
      this.format_masks =
        format_mask.map((item: IFormatDefinitionMask) => ({
          ...item,
        })) ?? []
    },

    assignCostCenters(cost_center: never[]) {
      this.cost_center =
        cost_center.map((item: ISelectorResources) => ({
          label: `${item.code} - ${item.name}`,
          value: item.id,
        })) ?? []
    },

    assignBusinessTrusts(business_trusts: never[]) {
      this.business_trusts =
        business_trusts.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.business_code} - ${item.name}`,
          value: item.id,
        })) ?? []
    },

    assignBankAccountMovementsFromBusiness(
      bank_account_movements_from_business: never[]
    ) {
      this.bank_account_movements_from_business =
        bank_account_movements_from_business.map(
          (item: ISelectorResources) => ({
            label: `${item.business_code} - ${item.name}`,
            value: item.business_code ?? null,
            id: item.id ?? null,
            name: item.name ?? null,
          })
        ) ?? []
    },
    assignBankAccountMovementsToBusiness(
      bank_account_movements_to_business: never[]
    ) {
      this.bank_account_movements_to_business =
        bank_account_movements_to_business.map((item: ISelectorResources) => ({
          label: `${item.business_code} - ${item.name}`,
          value: item.business_code ?? null,
          id: item.id ?? null,
          name: item.name ?? null,
        })) ?? []
    },

    assignBankFromAccountMovements(bank_account_movements_from_bank: never[]) {
      this.bank_account_movements_from_bank =
        bank_account_movements_from_bank.map((item: ISelectorResources) => ({
          label: `${item.bank_code} - ${item.description}`,
          value: item.bank_code ?? null,
          id: item.id ?? null,
          name: item.description ?? null,
        })) ?? []
    },

    assignBankToAccountMovements(bank_account_movements_to_bank: never[]) {
      this.bank_account_movements_to_bank =
        bank_account_movements_to_bank.map((item: ISelectorResources) => ({
          label: `${item.bank_code} - ${item.description}`,
          value: item.bank_code ?? null,
          id: item.id ?? null,
          name: item.description ?? null,
        })) ?? []
    },

    assignBankAccountFromAccountMovements(
      bank_account_movements_from_bank_account: never[]
    ) {
      this.bank_account_movements_from_bank_account =
        bank_account_movements_from_bank_account.map(
          (item: ISelectorResources) => ({
            label: `${item.account_number} - ${item.account_name}`,
            value: item.account_number ?? null,
            id: item.id ?? null,
            name: item.account_name ?? '',
          })
        ) ?? []
    },
    assignBankAccountToAccountMovements(
      bank_account_movements_to_bank_account: never[]
    ) {
      this.bank_account_movements_to_bank_account =
        bank_account_movements_to_bank_account.map(
          (item: ISelectorResources) => ({
            label: `${item.account_number} - ${item.account_name}`,
            value: item.account_number ?? null,
            id: item.id ?? null,
            name: item.account_name ?? '',
          })
        ) ?? []
    },
    assignTreasuryBulkUploads(treasury_bulk_uploads: never[]) {
      this.treasury_bulk_uploads =
        treasury_bulk_uploads.map((item: ITreasuryBulkUploadsResource) => ({
          ...item,
          value: item.load_number ?? null,
          label: item.load_number ?? null,
        })) ?? []
    },

    assignFormatCheck(format_check: never[]) {
      this.format_check =
        format_check.map((item: ISelectorResources) => ({
          label: item.label,
          value: item.value,
        })) ?? []
    },
    assignRemoteAuthorizationProcesses(
      remote_authorization_processes: never[]
    ) {
      this.remote_authorization_processes =
        remote_authorization_processes.map((item: IResource) => ({
          ...item,
          label: item.label ?? '',
          value: item.value ?? '',
        })) ?? []
    },

    assignBankingNetworkUploadsAnnulate(banking_network_uploads_annulated: []) {
      this.banking_network_uploads_annulated =
        banking_network_uploads_annulated.map((item: ISelectorResources) => ({
          ...item,
          label: `${item.id}`,
          value: item.id ?? '',
        })) ?? []
    },

    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (values: any, key: string | undefined) => void
      > = {
        third_party_nit: this.assignThirdPartyNit,
        banks: this.assignTreasuryBanks,
        sub_receipt_type: this.assignSubReceiptTypes,
        receipt_type: this.assignReceiptTypes,
        MoveOverride: this.assignMoveOverride,
        nature: this.assignMovementCodeNatures,
        operation: this.assignOperations,
        treasury_means_of_payment: this.assignTreasuryMeansOfPayment,
        reason_return_status: this.assignReasonReturnStatus,
        account_structures: this.assignTreasuryAccountStructures,
        business_trust: this.assignBusinessTrust,
        banking_network_uploads: this.assignBankingNetworkUploads,
        bank_branches: this.assignBankBranchesContacts,
        account_structures_block: this.assignAccountStructuresBlock,
        treasury_movement_codes: this.assignTreasuryMovementCodes,
        commission_rate: this.assignCommissionRate,
        collection_concepts_codes: this.assignCollectionConceptsCodes,
        accounting_account_contrapart: this.assignAccountingAccountCounterpart,
        accounting_account: this.assignAccountingAccount,
        account_structures_by_type: this.assignAccountStructuresByType,
        accounting_blocks_collection_code:
          this.assignAccountingBlocksCollectionCode,
        business_trusts_egreso: this.assignBusinessTrustsEgreso,
        payments: this.assignPayments,
        cost_center_egreso: this.assignCostCenterEgreso,
        bank_account: this.assignBankAccount,
        cash_flow_structure_egreso: this.assignCashFlowStructureEgreso,
        third_parties: this.assignActiveThirdParties,
        bank_account_third_party: this.assignBackAccountThirdParty,
        document_type: this.assignDocumentTypes,
        users_movement_vouchers_request: this.assignUsersMovementVouchers,
        movement: this.assignMovements,
        banks_third_party: this.assignBankThirdParty,
        bank_branches_third_party: this.assignMapIdCodeName,
        third_party_types: this.assignThirdPartyTypes,
        operational_account_charts: this.assignOperationalAccountCharts,
        operational_cost_centers: this.assignOperationalCostCenter,
        accounting_block_collections_charts:
          this.assignAccountingBlockCollectionsCharts,
        counter_auxiliary_type: this.assignCounterAuxiliaryType,
        cash_flow_structures: this.assignCashFlowStructures,
        cash_flow_structure: this.assignCashFlowStructure,
        origin: this.assignMapIdName,
        formatType: this.assignMapIdName,
        validationType: this.assignMapIdName,
        fileExtension: this.assignMapIdName,
        fileType: this.assignMapIdName,
        numericMask: this.assignMapIdName,
        valueMask: this.assignMapIdName,
        dateMask: this.assignMapIdName,
        registerType: this.assignMapIdName,
        mask: this.assignMapIdName,
        variables: this.assignMapIdName,
        justification: this.assignMapIdName,
        cities: this.assignMapIdName,
        reasonsForBankReturn: this.assignReasonForBankReturn,
        bank_account_business: this.assignBankAccountBusiness,
        bank_account_accounting_account_gmf: this.assignMapIdCodeName,
        bank_account_cost_centers: this.assignBankAccountCostCenters,
        movement_treasury: this.assignMovementTreasury,
        bank_account_accounting_account: this.assignMapIdCodeName,
        bank_account_cost_center: this.assignMapIdCodeName,
        bank_account_accounting_accounts: this.assignMapIdCodeName,
        treasury_type_receive: this.assignTreasuryTypeReceipt,
        account_types: this.assignAccountTypes,
        typeReceive: this.assignTypeReceive,
        types_encrypt: this.assignTypesEncrypt,
        means_of_payments: this.assignMeansOfPayment,
        bank_accounts_income: this.assignBankAccountIncomes,
        bank_account_status: this.assignBankAccountStatus,
        business_trusts_dipersion: this.assignBusinessTrustDispersion,
        banks_dispersion: this.assignBanksDispersion,
        dispersion_file_bank_accounts: this.assignDispersionFileBankAccounts,
        bank_account_dispersion: this.assignBankAccountDispersion,
        dispersion_group: this.assignDispersionGroup,
        account_structures_collection: this.assignStructureConcepts,
        collection_type: this.assignCollectionConceptType,
        collection_status: this.assignCollectionConceptStatus,
        treasury_closing_business: this.assignTreasuryClosingBusiness,
        treasury_closing_status: this.assignTreasuryClosingStatus,
        treasury_closing_types: this.assignTreasuryClosingTypes,
        banks_third_parties: this.assignBankThirdParties,
        treasury_cancellation_codes: this.assignTreasuryCancellationsCodes,
        sub_receipt_types: this.assignMapIdCodeName,
        receipt_types: this.assignMapIdCodeName,
        treasury_movement_vouchers: this.assignTreasuryMovementVouchers,
        bank_account_third_parties: this.assignBackAccountThirdParties,
        financial_info: this.assignFinancialInfo,
        financial_estate: this.assignFinancialEstate,
        users_grantor_request: this.assignUsersGrantorRequest,
        grantor_states: this.assignGrantorStates,
        business_bank_accounts: this.assignBusinessBanksAndAccounts,
        checkbooks: this.assignCheckbooks,
        banks_record_expenses: this.assignTreasuryBanksRecordExpenses,
        banks_bank_accounts: this.assignBanksBankAccounts,
        letter_format_codes: this.assignLetterFormatCodes,
        letter_format_statuses: this.assignLetterFormatStatuses,
        letter_format_variables: this.assignLetterFormatVariables,
        dispersion_letter_status: this.assignDispersionLetterStatus,
        dispersion_letter_business: this.assignDispersionLetterBusiness,
        dispersion_letter_banks: this.assignDispersionLetterBanks,
        cost_centers: this.assignCostCenter,
        cost_center: this.assignCostCenters,
        movement_egreso: this.assignMovementEgreso,
        treasury_number_transfers: this.assignTreasuryNumberTransfers,
        treasury_periods: this.assignTreasuryPeriods,
        remote_authorization_statuses: this.assignRemoteAuthorizationStatuses,
        remote_authorization_modules: this.assignRemoteAuthorizationModules,
        check_book_inquiry_checkbooks: this.assignCheckBookInquiryCheckbooks,
        check_book_inquiry_businesses: this.assignCheckBookInquiryBusinesses,
        checks: this.assignChecks,
        business_bank_accounts_bulk: this.assignBusinessBanksAndAccounts,
        dispersion_file_bank_structures: this.assignDispersionFileBank,
        treasury_movement_code_expense: this.assignTreasuryMovementExpense,
        treasury_movement_codes_cesiones:
          this.assignTreasuryMovementCodesCesiones,
        business_trust_cesion: this.assignBusinessTrustCesiones,
        record_expenses: this.assignRecordExpenses,
        payments_investment: this.assignPayments,
        bank_account_investment: this.assignBankAccount,
        business_bank_accounts_authorization:
          this.assignBusinessBankAccountsAuthorization,
        bank_accounts_fics: this.assignBankAccountsFics,
        response_bank_file_types: this.assignResponseBankFileTypes,
        response_bank_formats: this.assignResponseBankFormats,
        response_bank_dispersion_groups:
          this.assignResponseBankDispersionGroups,
        movement_statuses: this.assignMovementStatuses,
        banking_network_upload_request_types:
          this.assignBankingNetworkUploadRequestTypes,
        bank_structures: this.assignBankStructures,
        banking_network_upload_statuses:
          this.assignBankingNetworkUploadStatuses,
        business_trusts_dipersion_from: this.assignBusinessTrustDispersionFrom,
        banks_dispersion_from: this.assignBanksDispersionFrom,
        bank_account_dispersion_from: this.assignBankAccountDispersionFrom,
        account_types_equivalences: this.assignAccountTypesEquivalences,
        format_mask: this.assignFormatMasks,
        banks_dispersion_generate: this.assignBanksDispersion,
        business_trusts_dipersion_generate: this.assignBusinessTrustDispersion,
        business_trusts: this.assignBusinessTrusts,
        bank_account_movements_from_business:
          this.assignBankAccountMovementsFromBusiness,
        bank_account_movements_to_business:
          this.assignBankAccountMovementsToBusiness,
        bank_account_movements_from_bank: this.assignBankFromAccountMovements,
        bank_account_movements_to_bank: this.assignBankToAccountMovements,
        bank_account_movements_from_bank_account:
          this.assignBankAccountFromAccountMovements,
        bank_account_movements_to_bank_account:
          this.assignBankAccountToAccountMovements,
        treasury_bulk_uploads: this.assignTreasuryBulkUploads,
        format_check: this.assignFormatCheck,
        banking_network_uploads_with_details: this.assignBankingNetworkUploads,
        remote_authorization_processes: this.assignRemoteAuthorizationProcesses,
        banking_network_uploads_annulated:
          this.assignBankingNetworkUploadsAnnulate,
      }

      await executeApi()
        .get(`${URL_PATH_TREASURIES}/select-tables${params}`)
        .then((response) => {
          if (!response.status) return
          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              const isIterableObject =
                typeof value === 'object' &&
                value !== null &&
                (Array.isArray(value) || Object.keys(value).length > 0)

              const dataToAssign = isIterableObject ? value : []

              customHandlers[key](dataToAssign, key)
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

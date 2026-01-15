/* eslint-disable @typescript-eslint/no-explicit-any */

// store
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError } from '@/composables'

// utils
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IErrors, IResource } from '@/interfaces/global'
import {
  IAccountingCoins,
  IAdministratorsCodesResource,
  ICoinsResource,
  IEmitterCodesResource,
  IEmitterDividendResource,
  IGenericDataAmortizationTable,
  IGenericResource,
  IInterestRateResource,
  IQualificationActionResource,
  IQualificationCodeResource,
  IQuotasIssuingPermitsResource,
  ISelectorResources,
  IThirdResource,
  IPaperTypeResource,
  IOldestUnitValueByEmitterResource,
  ITitlesByEmitterResource,
  IPortafolioUnit,
  IFicForeignCurrencyWithdrawalParticipation,
  IFicLocalCurrencyWithdrawalParticipation,
  IMarketTypesBuyFixedIncomeResource,
  IEquityOpsResource,
  ICounterpartyResource,
  IIssuerDepositResource,
  ICurrencyForPaperTypeResource,
  IInterestRate,
  IIsinesInterestRateResource,
  ICurrencyInValorationFilesResource,
  IInvestmentPortfolioAssociatedTraderResource,
  IEmitterAssociatedTraderResource,
  ITitlesByIssuerResource,
  ICompensationSystemResource,
  IIsinesEmitterAnnaCode,
  IGenericInvestmentOperationType,
  IGenericInvestmmentPortfolioResourceBenefit,
  IGenericBallotForeignCurrency,
  IOperationCoverageResource,
  IOperationCoveragesTypesElement,
  IGenericFICParticipationDetail,
  IGenericFiCParticipationValueForeign,
  IGenericFICPaperTypeParticipation,
  IGenericFICCurrencyForeign,
  IGenericFICIsinsMnemonics,
  IExchangeTradedFundResource,
  IGenerateBallotData,
  IValorationTrmResource,
  IGenericRegisterConstitutionInvestment,
  IPaperTypeEncompassAndDivisionResource,
  IIsinCodesMnemonicsPortfolioResource,
  IAvailableTitlesForDivisionAndEncompassResource,
  IStructurePaperType,
  IInvestmentPortfolioBankAccountResource,
  IEmitterResource,
  IInstructionSlipTypeResource,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  type_of_coins: [] as IResource[],
  qualification_actions: [] as IQualificationActionResource[],
  coins: [] as ICoinsResource[],
  accounting_coins: [] as IAccountingCoins[],
  InterestRate: [] as IInterestRateResource[],
  interest_rate_mode: [] as IResource[],
  interest_rate_payment_frequency: [] as IResource[],
  issuers_counterparty: [] as IResource[],
  risk_rating_agencie: [] as IResource[],
  qualification_lp: [] as IGenericResource[],
  qualification_cp: [] as IGenericResource[],
  cp_issuer_rating: [] as IGenericResource[],
  lp_issuer_rating: [] as IGenericResource[],
  isines_administrators_codes: [] as IGenericResource[],
  isines_perioricities: [] as IGenericResource[],
  isines_titles_classes: [] as IGenericResource[],
  isines_emitter_codes: [] as IGenericResource[],
  emitter_anna_codes: [] as IGenericResource[],
  emitter_anna_codes_by_id: [] as IGenericResource[],
  isines_rates: [] as IGenericResource[],
  isines_interest_rates: [] as IGenericResource[],
  isines_rates_behaviors: [] as IGenericResource[],
  accounting_origin: [] as IGenericResource[],
  nature_operation: [] as IGenericResource[],
  types_marketability: [] as IGenericResource[],
  price_provider_issuers: [] as IGenericResource[],
  name_files_list: [] as IGenericResource[],
  date_formats: [] as IGenericResource[],
  permissions_investment_portfolio: [] as IGenericResource[],
  third_party_issuers_selector: [] as IQuotasIssuingPermitsResource[],
  active_issuers_with_balance_selector: [] as IQuotasIssuingPermitsResource[],
  selectable_portfolios_with_code_and_name: [] as IGenericResource[],
  type_investment: [] as IGenericResource[],
  paper_type: [] as IStructurePaperType[],
  third_party_issuers_selector_to_counterparty:
    [] as IQuotasIssuingPermitsResource[],
  manual_unit_issuer_seller: [] as IGenericResource[],
  isin_code_mnemonics: [] as IGenericFICIsinsMnemonics[],
  isin_code_mnemonics_local: [] as IGenericResource[],
  interest_rate_payment_frequency_amortization: [] as IGenericResource[],
  investment_portfolio_code_local_currency: [] as IGenericResource[],
  operation_type_code_local_currency: [] as IGenericResource[],
  issuer_seller: [] as IGenericResource[],
  currency_local: [] as IGenericResource[],
  administrators_codes: [] as IAdministratorsCodesResource[],
  paper_type_local_currency: [] as IGenericResource[],
  local_currency_share_class: [] as IGenericResource[],
  issuer_counterparty_local_currency: [] as IGenericResource[],
  operation_type: [] as IGenericResource[],
  currency_type_of_currency: [] as IGenericResource[],
  issuer_dividend_class_action: [] as IGenericResource[],
  issuer_dividend_dividend_type: [] as IGenericResource[],
  third_party_issuers_selector_dividend: [] as IQuotasIssuingPermitsResource[],
  oldest_unit_value_by_emitter: [] as IOldestUnitValueByEmitterResource[],
  available_titles_by_emitter: [] as ITitlesByEmitterResource[],
  manual_unit_emitters: [] as IGenericResource[],
  manual_unit_actions: [] as IGenericResource[],
  class_investment: [] as IGenericResource[],
  paper_types_form_parameters: [] as IPaperTypeResource[],
  type_auxiliary: [] as IGenericResource[],
  isines_modality: [] as IGenericResource[],
  currency_foreign: [] as IGenericFICCurrencyForeign[],
  list_counterparty_associated_trader: [] as ICounterpartyResource[],
  issuer_deposit: [] as IIssuerDepositResource[],
  currency_for_paper_type: [] as ICurrencyForPaperTypeResource[],
  emitter: [] as IEmitterResource[],
  emitter_buyer: [] as IGenericResource[],
  fic_participation_details: [] as IGenericFICParticipationDetail[],
  fic_participation_value_foreign: [] as IGenericFiCParticipationValueForeign[],
  class_portfolio: [] as IGenericResource[],
  paper_type_participation: [] as IGenericFICPaperTypeParticipation[],
  manual_unit_value: [] as IGenericResource[],
  currency_all: [] as IGenericResource[],
  isin_code_type_changeable: [] as IGenericResource[],
  exchange_traded_fund_all: [] as IGenericResource[],
  operation_type_portfolio: [] as IGenericResource[],
  withdrawal_participation_unit_local_currency: [] as IGenericResource[],
  withdrawal_participation_unit_foreign_currency: [] as IGenericResource[],
  withdrawal_participation_fic_foreign_currency:
    [] as IFicForeignCurrencyWithdrawalParticipation[],
  withdrawal_participation_fic_local_currency:
    [] as IFicLocalCurrencyWithdrawalParticipation[],
  available_titles_by_emitter_currency_foreign:
    [] as ITitlesByEmitterResource[],
  interest_rates: [] as IInterestRate[],
  interest_rates_code_as_value: [] as IGenericResource[],
  market_types_buy_fixed_income: [] as IMarketTypesBuyFixedIncomeResource[],
  exchange_traded_fund_local: [] as IExchangeTradedFundResource[],
  exchange_traded_fund_foreign: [] as IExchangeTradedFundResource[],
  operation_exchange_traded_fund_statuses: [] as IResource[],
  available_title_for_sell_exchange_traded_fund: [] as IGenericResource[],
  currency_in_valoration_files: [] as ICurrencyInValorationFilesResource[],
  list_investment_portfolios_associated_trader:
    [] as IInvestmentPortfolioAssociatedTraderResource[],
  list_emitter_associated_trader: [] as IEmitterAssociatedTraderResource[],
  titles_for_issuer: [] as ITitlesByIssuerResource[],
  compensation_system_list: [] as ICompensationSystemResource[],
  local_currency_type: [] as ICoinsResource[],
  foreign_currency_type: [] as ICoinsResource[],
  investment_portfolio: [] as IGenericResource[],
  instruction_slip_types: [] as IGenericResource[],
  investment_portfolio_operation_types: [] as IGenericInvestmentOperationType[],
  investment_portfolio_titles: [] as IGenericBallotForeignCurrency[],
  type_accounts: [] as IGenericResource[],
  investment_portfolio_benefit:
    [] as IGenericInvestmmentPortfolioResourceBenefit[],
  investment_portfolio_banks: [] as IGenericResource[],
  operation_coverage: [] as IOperationCoverageResource[],
  investment_portfolio_titles_foreign_currency:
    [] as IGenericBallotForeignCurrency[],
  coins_exchange_traded_fund: [] as IEquityOpsResource[],
  issuer_counterparty_all: [] as IGenericResource[],
  valoration_trm: [] as IValorationTrmResource[],
  emitters: [] as IGenericResource[],
  currency_foreign_portfolio: [] as IGenericRegisterConstitutionInvestment[],
  fic_participation_emitter_foreign_currency: [] as IGenericResource[],
  fic_participation_counterparty_foreign_currency: [] as IGenericResource[],
  fic_participation_administrator_foreign_currency: [] as IGenericResource[],
  fic_participation_administrator: [] as IGenericResource[],
  fic_participation_counterparty: [] as IGenericResource[],
  fic_participation_emitter: [] as IGenericResource[],
  permission_user_portfolio: [] as IGenericResource[],
  investment_portfolio_collection_methods: [] as IGenericResource[],
  investment_portfolio_payment_methods: [] as IGenericResource[],
  emitter_buyer_portfolio: [] as IGenericResource[],
  operation_compliance_statuses: [] as IGenericResource[],
  paper_type_encompass_and_division:
    [] as IPaperTypeEncompassAndDivisionResource[],
  isin_codes_mnemonics_portfolio: [] as IIsinCodesMnemonicsPortfolioResource[],
  encompass_inversion_classes: [] as IGenericResource[],
  available_titles_for_division_and_encompass:
    [] as IAvailableTitlesForDivisionAndEncompassResource[],
  rate_type: [] as IGenericResource[],
  derivative_class: [] as IGenericResource[],
  derivative_coverage: [] as IGenericResource[],
  operations_type_list: [] as IGenericResource[],
  operations_status_list: [] as IGenericResource[],
  division_inversion_classes: [] as IGenericResource[],
  available_titles_for_division_and_encompass_rows:
    [] as IAvailableTitlesForDivisionAndEncompassResource[],
  foreign_currency_shar_issuers_selector: [] as IQuotasIssuingPermitsResource[],
  available_title_for_foreign_sell_exchange_traded_fund:
    [] as IGenericResource[],
  inversion_types: [] as IGenericResource[],
  third_party_issuers_selector_emitter: [] as IQuotasIssuingPermitsResource[],
  derivative_type: [] as IGenericResource[],
  derivative_underlying: [] as IGenericResource[],
  investment_portfolio_bank_accounts:
    [] as IInvestmentPortfolioBankAccountResource[],
  type_of_operation: [] as IGenericResource[],
  options_positions_list: [] as IGenericResource[],
  status_guarantee_list: [] as IGenericResource[],
  guarantee_operation_list: [] as IGenericResource[],
})
export const useInvestmentPortfolioResourcesV1 = defineStore(
  'investment-portfolio-resources-v1',
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
      assignTypesMarketability(type_bursatility: []) {
        this.types_marketability =
          type_bursatility?.map((item: ISelectorResources) => ({
            label: item.label,
            value: item.value,
          })) ?? []
      },
      assignTypeCurrency(currency_type_of_currency: []) {
        this.currency_type_of_currency =
          currency_type_of_currency?.map((item: IEmitterDividendResource) => ({
            value: item.id!,
            label: `${item.code} - ${item.type_of_currency}`,
          })) ?? []
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
      assignMapIdDescription(resources: [], key: string | undefined) {
        if (!key) return
        ;(this as any)[key] =
          resources.map((item: ISelectorResources | IResource) => ({
            ...item,
            value: item.id,
            label: `${item.description}`,
          })) || []
      },
      assignMapPaperType(paper_type: []) {
        this.paper_type =
          paper_type.map((item: IStructurePaperType) => ({
            ...item,
            value: item.id as number | string,
            label: `${item.code} - ${item.description}`,
            investment_type: item.investment_type,
          })) || []
      },
      assignMapIdIndex(resources: [], key: string | undefined) {
        if (!key) return
        ;(this as any)[key] =
          resources.map(
            (item: ISelectorResources | IResource, index: number) => ({
              ...item,
              value: index + 1,
              label: item.label,
            })
          ) || []
      },
      assignMapIdCode(resources: [], key: string | undefined) {
        if (!key) return
        ;(this as any)[key] =
          resources.map((item: ISelectorResources | IResource) => ({
            ...item,
            value: item.id,
            label: `${item.code} - ${item.description}`,
            description: item.description,
          })) || []
      },
      assignMapIdValueDescription(resources: [], key: string | undefined) {
        if (!key) return
        ;(this as any)[key] =
          resources.map((item: IGenericResource) => ({
            ...item,
            value: String(item.id),
            label: item.value,
            description: item.description,
          })) ?? []
      },
      assignSelectablePortfoliosWithCodeAndName(
        selectable_portfolios_with_code_and_name: []
      ) {
        this.selectable_portfolios_with_code_and_name =
          selectable_portfolios_with_code_and_name.map(
            (item: ISelectorResources) => ({
              ...item,
              value: item.id,
              label: `${item.code} - ${item.name}`,
              description: item.name || '',
            })
          ) ?? []
      },
      assignIssuerSellerList(resources: [], key: string | undefined) {
        this.assignMapIdValueDescription(resources, key)

        this.manual_unit_issuer_seller =
          resources.map((item: IGenericResource) => ({
            value: String(item.id) || '',
            label: String(item.value) || '',
          })) ?? []
      },
      assignThirdPartyIssuers(third_party_issuers_selector: []) {
        this.third_party_issuers_selector =
          third_party_issuers_selector?.map(
            (item: IQuotasIssuingPermitsResource) => ({
              ...item,
              value: item.id as number | string,
              label: `${item.third_party_id} - ${item.description}` || '',
            })
          ) ?? []

        this.third_party_issuers_selector_dividend =
          third_party_issuers_selector?.map(
            (item: IQuotasIssuingPermitsResource) => ({
              ...item,
              value: item.id || '',
              label: `${item.document_third || ''} - ${item.description || ''}`,
              description: `${item.description}` || '',
            })
          ) ?? []

        this.third_party_issuers_selector_emitter =
          third_party_issuers_selector?.map(
            (item: IQuotasIssuingPermitsResource) => ({
              ...item,
              value: item.id || '',
              label: `${item.document_third} - ${item.description}` || '',
              description: `${item.description}` || '',
              third_party_id: item.third_party_id || '',
            })
          ) ?? []

        this.third_party_issuers_selector_to_counterparty =
          third_party_issuers_selector?.map(
            (item: IQuotasIssuingPermitsResource) => ({
              ...item,
              value: item.id as number | string,
              label: `${item.document_third || ''} - ${item.description || ''}`,
            })
          ) ?? []
      },
      assignActiveIssuersBalance(active_issuers_with_balance_selector: []) {
        this.active_issuers_with_balance_selector =
          active_issuers_with_balance_selector?.map(
            (item: IQuotasIssuingPermitsResource) => ({
              ...item,
              value: item.id as number | string,
              label: `${item.document_third} - ${item.description}` || '',
            })
          ) ?? []
      },
      assignIsinCodeMnemonics(isinCodeMnemonics: []) {
        this.isin_code_mnemonics =
          (isinCodeMnemonics as IGenericDataAmortizationTable[]).map(
            (item) => ({
              ...item,
              value: Number(item.isin_code_id),
              label: `${item.isin_code ?? ''} - ${item.description ?? ''}`,
              mnemonic: item.mnemonic ?? '',
              isin_code_id: Number(item.isin_code_id),
            })
          ) ?? []

        this.isin_code_mnemonics_local =
          (isinCodeMnemonics as IGenericDataAmortizationTable[]).map(
            (item) => ({
              ...item,
              value: String(item.isin_code_id),
              label: `${item.isin_code ?? ''} - ${item.description ?? ''}`,
              description: item.mnemonic ?? '',
            })
          ) ?? []

        this.isin_codes_mnemonics_portfolio =
          (isinCodeMnemonics as IIsinCodesMnemonicsPortfolioResource[]).map(
            (item) => ({
              ...item,
              value: Number(item.isin_code_id),
              label: `${item.isin_code ?? ''} - ${item.description ?? ''}`,
              description: item.mnemonic ?? '',
              isin_code_id: Number(item.isin_code_id),
            })
          ) ?? []
      },
      assignTypeAccountingOrigin(accountingOrigin: []) {
        if (!accountingOrigin) return
        this.accounting_origin =
          (accountingOrigin as ISelectorResources[]).map((item) => ({
            ...item,
            value: item.value as number | string,
            label: item.label ?? '',
          })) ?? []
      },
      assignNatureOperation(natureOperation: []) {
        if (!natureOperation) return
        this.nature_operation =
          (natureOperation as ISelectorResources[]).map((item) => ({
            ...item,
            value: item.value as number | string,
            label: item.label ?? '',
          })) || []
      },
      assignQualificationActions(qualification: []) {
        this.qualification_actions = (qualification ?? []).map(
          (q: ISelectorResources) => ({
            ...q,
            label: q.label || '',
            value: q.label || '',
          })
        )
      },
      assignCoins(coins: []) {
        this.coins =
          coins?.map((item: ISelectorResources) => ({
            label: `${item.code} - ${item.description}`,
            value: item.id ?? null,
            coin_value: String(item.value ?? ''),
            code: item.code ?? '',
            payload: {
              TRM: `${item.code} - ${item.value}`,
              rate: Number(item.value),
            },
            currency_conversion: item.currency_conversion,
          })) ?? []
        this.accounting_coins =
          coins?.map((item: IAccountingCoins) => ({
            label: `${item.code} - ${item.description}`,
            value: `${item.code}`,
            rate: `${item.value}`,
            id: item.id,
          })) ?? []
        this.coins_exchange_traded_fund = coins?.map(
          (item: IEquityOpsResource) => ({
            ...item,
            label: `${item.code} - ${item.description}`,
            value: `${item.id}`,
            rate: `${item.value}`,
          })
        )
      },
      assignInterestRate(InterestRate: []) {
        this.InterestRate = (InterestRate as IInterestRateResource[]).map(
          (item) => ({
            ...item,
            value: item.interest_rate_description,
            label: item.interest_rate_description,
            description: item.interest_rate_description,
            modality: item.mode,
            frequency: item.payment_frequency,
          })
        )
      },
      assignIssuersCounterparty(issuers_counterparty: []) {
        this.issuers_counterparty =
          issuers_counterparty?.map((item: ISelectorResources) => ({
            label: item.label,
            value: item.value
              .toString()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
          })) ?? []
      },
      assignRiskRatingAgencie(risk_rating_agencie: []) {
        this.risk_rating_agencie = risk_rating_agencie ?? []
      },
      assignQualificationLp(qualification_lp: []) {
        this.qualification_lp =
          qualification_lp?.map((item: ISelectorResources) => ({
            value: item.rating_code || '',
            label: item.rating_code || '',
          })) ?? []
        this.lp_issuer_rating =
          qualification_lp?.map((item: ISelectorResources) => ({
            value: item.id || '',
            label: String(item.rating_code) || '',
          })) ?? []
      },
      assignQualificationCp(qualification_cp: []) {
        this.qualification_cp =
          qualification_cp?.map((item: IQualificationCodeResource) => ({
            value: item.rating_code || '',
            label: item.rating_code || '',
          })) ?? []

        this.cp_issuer_rating =
          qualification_cp?.map((item: IQualificationCodeResource) => ({
            value: item.id || '',
            label: String(item.rating_code) || '',
          })) ?? []
      },
      assignAdministratorsCodes(administrators_codes: []) {
        this.isines_administrators_codes =
          administrators_codes?.map((item: IAdministratorsCodesResource) => ({
            value: String(item.document_third) || '',
            label: item.description
              ? `${item.document_third} - ${item.description}`
              : item.document_third,
          })) ?? []

        this.administrators_codes =
          administrators_codes?.map((item: IAdministratorsCodesResource) => ({
            value: String(item.id) || '',
            label: `${item.document_third} - ${item.description}`,
            description: item.description || '',
            id: item.id,
            document_third: item.document_third || '',
          })) ?? []
      },
      assignPerioricities(perioricities: []) {
        this.isines_perioricities =
          perioricities?.map((item: IGenericResource) => ({
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignTitlesClasses(titles_classes: []) {
        this.isines_titles_classes =
          titles_classes?.map((item: IGenericResource) => ({
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignEmitterCodes(emitter_codes: []) {
        this.isines_emitter_codes =
          emitter_codes?.map((item: IEmitterCodesResource) => ({
            value: item.anna_code || '',
            label: item.anna_code || '',
          })) ?? []
      },
      assignIsinesEmitterAnnaCodes(codes: []) {
        this.emitter_anna_codes =
          codes.map((annaCode: IIsinesEmitterAnnaCode) => ({
            value: annaCode.anna_code,
            label: `${annaCode.anna_code} - ${annaCode.description}`,
            id: annaCode.id,
          })) ?? []

        this.emitter_anna_codes_by_id =
          codes.map((annaCode: IIsinesEmitterAnnaCode) => ({
            ...annaCode,
            value: annaCode.id,
            label: `${annaCode.anna_code} - ${annaCode.description}`,
          })) ?? []
      },
      assignInterestRatePaymentFrequencyMain(
        interest_rate_payment_frequency: []
      ) {
        this.interest_rate_payment_frequency =
          (interest_rate_payment_frequency as ISelectorResources[]).map(
            (item) => ({
              value: item.id ?? item.value ?? '',
              label: item.name ?? item.label ?? '',
            })
          ) ?? []
      },
      assignRatesBehaviors(rates_behaviors: []) {
        this.isines_rates_behaviors =
          rates_behaviors?.map((item: IGenericResource) => ({
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignThirdPartyIssuersSelector(price_provider_issuers: []) {
        this.price_provider_issuers =
          price_provider_issuers?.map((item: IThirdResource) => ({
            value: item.id || '',
            label: `${item.document_third}` || '',
            description: `${item.description}` || '',
          })) ?? []
      },
      assignNameFilesSelector(name_files_list: []) {
        this.name_files_list =
          name_files_list?.map((item: IGenericResource) => ({
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignDateFormatsSelector(date_formats: []) {
        this.date_formats =
          date_formats?.map((item: IGenericResource) => ({
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignPermissionsInvestmentPortfolio(investment_portfolio: []) {
        this.permissions_investment_portfolio =
          investment_portfolio.length > 0 ? investment_portfolio : []
        this.investment_portfolio = investment_portfolio.map(
          (item: ISelectorResources) => ({
            label: `${item.code} - ${item.name}`,
            value: item.id ?? null,
            description: item.name ?? '',
          })
        )
      },
      assignCurrencyLocal(currency_local: []) {
        this.currency_local =
          currency_local?.map((item: IGenericResource) => ({
            ...item,
            value: String(item.id),
            label: `${item.code} - ${item.description}`,
            description: String(item.value),
          })) ?? []
      },
      assignEmitter(emitters: []) {
        this.manual_unit_emitters =
          emitters.map((item: IThirdResource) => ({
            value: String(item.id),
            label:
              `${String(item.document_third) ?? ''} - ${item.description}` ||
              '',
            description: item.description,
          })) ?? []
        this.emitter =
          emitters.map((item: IEmitterResource) => ({
            ...item,
            value: item.id ?? 0,
            label: `${item.document_third} - ${item.description}`,
            description: item.description || '',
            document_third: item.document_third,
          })) ?? []
        this.emitters = emitters.map((item: ISelectorResources) => ({
          value: item.id || item.value || '',
          label: item.document_third + ' - ' + item.description || '',
          description: item.description || '',
        }))
      },
      assignFicParticipationDetails(fic_participation_details: []) {
        this.fic_participation_details =
          fic_participation_details.map(
            (item: IGenericFICParticipationDetail) => ({
              value: item.unit_id || 0,
              label: item.unit_value || '',
              constitution_value: item.constitution_value || '0',
              participation_number: item.participation_number || 0,
              title_id: item.title_id || 0,
              paper_type_id: item.paper_type_id || 0,
            })
          ) ?? []
      },
      assignFicParticipationValueForeign(fic_participation_value_foreign: []) {
        this.fic_participation_value_foreign =
          fic_participation_value_foreign.map(
            (item: IGenericFiCParticipationValueForeign) => ({
              ...item,
              value: item.unit_id || 0,
              label: item.unit_value || '0',
              unit_id: item.unit_id || 0,
              unit_value: item.unit_value || '',
              paper_type_id: item.paper_type_id || 0,
              currency: item.currency || '',
              currency_id: item.currency_id || 0,
              isin_id: item.isin_id || 0,
              participation_number: item.participation_number || 0,
              title_id: item.title_id || 0,
              currency_value: item.currency_value || '',
              constitution_unit_number: item.constitution_unit_number || '',
            })
          ) ?? []
      },
      assignClassPortfolio(class_portfolio: []) {
        this.class_portfolio =
          class_portfolio.map((item: IGenericResource) => ({
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignPaperTypeParticipation(paper_type_participation: []) {
        this.paper_type_participation =
          paper_type_participation.map((item: ISelectorResources) => ({
            value: item.id || '',
            label: item.description || '',
            currency_id: Number(item.currency_id) || 0,
          })) ?? []
      },
      assignManualUnitValue(manual_unit_value: []) {
        this.manual_unit_value =
          manual_unit_value.map((item: ISelectorResources) => ({
            value: item.id || '',
            label: item.unit_value || '',
            emitter_id: item.emitter_id || 0,
          })) ?? []
      },
      assignActions(actions: []) {
        this.manual_unit_actions =
          actions?.map((item: IGenericResource) => ({
            value: item.value,
            label: item.label ?? '',
          })) ?? []
      },
      assignRate(rate: []) {
        this.isines_rates =
          rate?.map((item: IGenericResource) => ({
            value: item.value ?? '',
            label: item.label ?? '',
          })) ?? []
      },
      assignIsinesInterestRates(interestRates: []) {
        this.isines_interest_rates = interestRates
          .map((item: IIsinesInterestRateResource) => ({
            value: item.code,
            label: `${item.code} - ${item.interest_rate_description}`,
          }))
          .filter((item) => item.value !== null) as IGenericResource[]

        this.interest_rates = interestRates
          ?.map((item: IInterestRate) => ({
            ...item,
            value: item.id,
            label: [item.code, item.interest_rate_description]
              .filter(Boolean)
              .join(' - '),
          }))
          .filter((item) => item.value !== null) as IInterestRate[]

        this.interest_rates_code_as_value = interestRates
          ?.map((item: IInterestRate) => ({
            value: item.code,
            label: [item.code, item.interest_rate_description]
              .filter(Boolean)
              .join(' - '),
          }))
          .filter((item) => item.value !== null) as IGenericResource[]
      },
      assignOldestUnitValueByEmitter(oldestUnitValues: []) {
        this.oldest_unit_value_by_emitter =
          (oldestUnitValues as IOldestUnitValueByEmitterResource[])?.map(
            (item) => ({
              ...item,
              issuers_counterparty_id: Number(item.issuers_counterparty_id),
              action_class: item.action_class ?? '',
              unit_value: String(item.unit_value ?? ''),
            })
          ) ?? []
      },
      assignAvailableTitlesByEmitter(titles: []) {
        this.available_titles_by_emitter =
          (titles as ITitlesByEmitterResource[])?.map((item) => ({
            issuers_counterparty_id: Number(item.issuers_counterparty_id),
            action_class: item.action_class ?? '',
            available_balance: String(item.available_balance ?? ''),
          })) ?? []
      },
      assignTypeCoins(coinst: []) {
        this.type_of_coins =
          coinst?.map((item: ISelectorResources) => ({
            label: item.label,
            value: item.value,
          })) ?? []
      },
      assignClassInvestment(class_investment: []) {
        this.class_investment =
          class_investment?.map((item: IGenericResource) => ({
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignTypeAuxiliary(type_auxiliary: []) {
        this.type_auxiliary =
          type_auxiliary?.map((item: IGenericResource) => ({
            ...item,
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignPaperTypesFormParameters(paper_types_form_parameters: []) {
        this.paper_types_form_parameters =
          paper_types_form_parameters?.map((item: IPaperTypeResource) => ({
            ...item,
            value: item.id || '',
            label: `${item.code || ''} - ${item.description || ''}`,
          })) ?? []
      },
      assignModality(modality: []) {
        this.isines_modality =
          modality?.map((item: IGenericResource) => ({
            ...item,
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignCurrencyForegin(currency_foreign: []) {
        this.currency_foreign =
          currency_foreign?.map((item: IGenericFICCurrencyForeign) => ({
            value: String(item.id),
            label: `${item.code} - ${item.description}`,
            code: String(item.code) ?? '',
            description: String(item.value),
            coin_value: String(item.value ?? ''),
            currency_conversion: String(item.currency_conversion ?? '0'),
          })) ?? []

        this.currency_foreign_portfolio =
          currency_foreign?.map(
            (item: IGenericRegisterConstitutionInvestment) => ({
              ...item,
              value: String(item.id),
              label: `${item.code} - ${item.description}`,
              description: String(item.value),
              currency_conversion: item.currency_conversion || null,
            })
          ) ?? []
      },
      assignCounterparties(counterparties: ICounterpartyResource[]) {
        this.list_counterparty_associated_trader =
          counterparties?.map((item) => ({
            ...item,
            value: String(item.counterparty_id),
            label: `${item.counterparty_document} - ${item.counterparty_name}`,
            description: item.counterparty_name,
            document: item.counterparty_document,
          })) ?? []
      },
      assignIssuerDeposit(deposits: IIssuerDepositResource[]) {
        this.issuer_deposit =
          deposits?.map((item) => ({
            ...item,
            value: String(item.value),
            description: item.description,
            identification: item.identification,
            id: item.id,
          })) ?? []
      },
      assignCurrencyForPaperType(list: ICurrencyForPaperTypeResource[]) {
        this.currency_for_paper_type =
          list?.map((item) => ({
            ...item,
            value: item.value,
            label: `${item.code} - ${item.description}`,
            description: item.description,
            paper_type_id: item.paper_type_id ?? null,
            paper_type_code: item.paper_type_code ?? null,
            type_of_currency: item.type_of_currency ?? '',
          })) ?? []
      },
      assignCurrencyAll(currency_all: []) {
        this.currency_all =
          currency_all?.map((item: IGenericResource) => ({
            value: String(item.id),
            label: `${item.code} - ${item.description}`,
            description: String(item.value),
          })) ?? []
      },
      assignIsinCodeChangable(isin_code_type_changeable: []) {
        this.isin_code_type_changeable =
          isin_code_type_changeable?.map((item: IGenericResource) => ({
            value: String(item.id),
            label: `${item.code} - ${item.description}`,
            description: String(item.value),
          })) ?? []
      },
      assignExchangeTradedFundLocal(exchange_traded_fund_local: []) {
        this.exchange_traded_fund_local = exchange_traded_fund_local?.map(
          (item: IExchangeTradedFundResource) => ({
            ...item,
            value: String(item.etf_number),
            label: `${item.etf_number} - ${item.description}`,
          })
        )
      },
      assignExchangeTradedFundForeign(exchange_traded_fund_foreign: []) {
        this.exchange_traded_fund_foreign = exchange_traded_fund_foreign?.map(
          (item: IExchangeTradedFundResource) => ({
            ...item,
            value: String(item.etf_number),
            label: `${item.etf_number} - ${item.description}`,
          })
        )
      },
      assignLocalSellExchangeTradedFund(
        available_title_for_sell_exchange_traded_fund: []
      ) {
        this.available_title_for_sell_exchange_traded_fund =
          available_title_for_sell_exchange_traded_fund?.map(
            (item: IEquityOpsResource) => ({
              value: item.id as number,
              label: String(item.id),
              description: item.balance,
            })
          )
      },
      assignExchangeTraded(exchange_traded_fund_all: []) {
        this.exchange_traded_fund_all =
          exchange_traded_fund_all?.map((item: IGenericResource) => ({
            value: String(item.id),
            label: `${item.id} - ${item.description}`,
          })) ?? []
      },
      assignIssuersCounterpartyAll(issuer_counterparty_all: []) {
        this.issuer_counterparty_all =
          issuer_counterparty_all?.map((item: IGenericResource) => ({
            value: String(item.id),
            label: item.description || '',
          })) ?? []
      },
      assignUnitLocalCurrencyWithdrawalParticipation(
        withdrawal_participation_unit_local_currency: []
      ) {
        this.withdrawal_participation_unit_local_currency =
          withdrawal_participation_unit_local_currency?.map(
            (item: IPortafolioUnit) => ({
              value: String(item.participation_id ?? ''),
              label: item.unit || '',
            })
          ) ?? []
      },
      assignUnitForeignCurrencyWithdrawalParticipation(
        withdrawal_participation_unit_foreign_currency: []
      ) {
        this.withdrawal_participation_unit_foreign_currency =
          withdrawal_participation_unit_foreign_currency?.map(
            (item: IPortafolioUnit) => ({
              value: String(item.participation_id ?? ''),
              label: item.unit || '',
            })
          ) ?? []
      },
      assignFicForeignCurrencyWithdrawalParticipation(
        data: IFicForeignCurrencyWithdrawalParticipation[]
      ) {
        this.withdrawal_participation_fic_foreign_currency = data ?? []
      },
      assignFicLocalCurrencyWithdrawalParticipation(
        data: IFicLocalCurrencyWithdrawalParticipation[]
      ) {
        this.withdrawal_participation_fic_local_currency = data ?? []
      },

      assignOperationType(operation_type: []) {
        this.operation_type =
          operation_type?.map((item: IGenericResource) => ({
            ...item,
            value: String(item.id),
            label: `${item.code} - ${item.description}`,
            description: item.description || '',
          })) ?? []
      },
      assignAvailableTitlesByEmitterCurrencyForeign(titles: []) {
        this.available_titles_by_emitter_currency_foreign =
          (titles as ITitlesByEmitterResource[])?.map((item) => ({
            ...item,
            issuers_counterparty_id: Number(item.issuers_counterparty_id),
            action_class: item.action_class ?? '',
            available_balance: String(item.available_balance ?? ''),
          })) ?? []
      },
      assignMarketTypesBuyFixedIncome(market_types: []) {
        this.market_types_buy_fixed_income =
          market_types?.map((item: IMarketTypesBuyFixedIncomeResource) => ({
            label: item.label,
            value: item.value,
          })) ?? []
      },

      assignOperationExchangeTradedFundStatus(
        operation_exchange_traded_fund_statuses: []
      ) {
        this.operation_exchange_traded_fund_statuses =
          operation_exchange_traded_fund_statuses?.map(
            (item: ISelectorResources) => ({
              value: String(item.id),
              label: item.status,
            })
          )
      },
      assignCurrencyInValorationFiles(currency_in_valoration_files: []) {
        this.currency_in_valoration_files =
          currency_in_valoration_files?.map(
            (item: ICurrencyInValorationFilesResource) => ({
              id: item.id ?? 0,
              to_currency_id: item.to_currency_id ?? 0,
              rate: item.rate ?? 0,
            })
          ) ?? []
      },
      assignInvestmentPortfoliosAssociatedTrader(
        portfolios: IInvestmentPortfolioAssociatedTraderResource[]
      ) {
        this.list_investment_portfolios_associated_trader =
          portfolios?.map((item) => ({
            ...item,
            value: String(item.investment_portfolio_id),
            label: `${item.portfolio_code} - ${item.portfolio_name}`,
            description: item.portfolio_name,
          })) ?? []
      },
      assignEmittersAssociatedTrader(
        emitters: IEmitterAssociatedTraderResource[]
      ) {
        this.list_emitter_associated_trader =
          emitters?.map((item) => ({
            ...item,
            value: String(item.emitter_id),
            label: `${item.emitter_document} - ${item.emitter_name}`,
            description: item.emitter_name,
          })) ?? []
      },
      assignTitlesForIssuer(titles: ITitlesByIssuerResource[]) {
        this.titles_for_issuer =
          titles?.map((item) => ({
            ...item,
            value: item.id,
            label: `${item.id} - ${
              item.issuers_counterparty?.description ?? ''
            }`,
            balance: item.balance,
            unit_value: item.unit_value,
          })) ?? []
      },
      assignCompensationSystemList(data: ICompensationSystemResource[]) {
        this.compensation_system_list = data ?? []
      },

      assignLocalCurrencyType(local_currency_type: []) {
        this.local_currency_type =
          local_currency_type?.map((item: ICoinsResource) => ({
            label: `${item.code} - ${item.description}`,
            value: String(item.id),
            coin_value: String(item.value ?? ''),
          })) ?? []
      },
      assignForeignCurrencyType(foreign_currency_type: []) {
        this.foreign_currency_type =
          foreign_currency_type?.map((item: ICoinsResource) => ({
            label: `${item.code} - ${item.description}`,
            value: String(item.id),
            coin_value: String(item.value ?? ''),
          })) ?? []
      },
      assignInstructionSlipTypes(instruction_slip_types: []) {
        this.instruction_slip_types =
          instruction_slip_types?.map((item: IInstructionSlipTypeResource) => ({
            value: item.id || '',
            label: item.label || item.name || '',
            inversion_type_id: item.inversion_type_id ?? null,
          })) ?? []
      },
      assignInvestmentPortfolioOperationTypes(
        investment_portfolio_operation_types: []
      ) {
        this.investment_portfolio_operation_types =
          investment_portfolio_operation_types?.map(
            (item: IGenerateBallotData) => ({
              value: item.id || 0,
              label: `${item.code} - ${item.description}`,
              code: item.code || '',
              description: item.description || '',
              operation_nature: item.operation_nature || '',
              inversion_type_id: item.inversion_type_id ?? undefined,
            })
          ) ?? []
      },
      assignInvestmentPortfolioTitles(investment_portfolio_titles: []) {
        this.investment_portfolio_titles =
          investment_portfolio_titles?.map(
            (item: {
              title_id: string
              operation_type_description: string
              operation_value: string
            }) => ({
              value: item.title_id || '',
              label: String(item.title_id) || '',
              description: item.operation_type_description || '',
            })
          ) ?? []
      },
      assignTypeAccounts(type_accounts: []) {
        this.type_accounts =
          type_accounts.map((item: ISelectorResources) => ({
            value: item.id || '',
            label: item.description || '',
          })) ?? []
      },
      assignInvestmentPortfolioBenefit(investment_portfolio_benefit: []) {
        this.investment_portfolio_benefit = investment_portfolio_benefit?.map(
          (item: IGenerateBallotData) => ({
            ...item,
            value: item.benefit_id || item.value,
            label: item.benefit_name || item.label,
            benefit_id: item.benefit_id || '',
            benefit_name: item.benefit_name || '',
            total_value: item.total_value || '',
            benefit_nit: item.benefit_nit || '',
          })
        )
      },
      assignInvestmentPortfolioBank(investment_portfolio_banks: []) {
        this.investment_portfolio_banks = investment_portfolio_banks?.map(
          (item: ISelectorResources) => ({
            ...item,
            value: item.id || item.value,
            label: item.name || item.label || item.description,
          })
        )
      },
      assignCoverageTypes(operation_coverage: []) {
        this.operation_coverage = operation_coverage?.map(
          (item: ISelectorResources) => ({
            label: item.name,
            value: item.id,
            operation_coverages_types_elements:
              item.operation_coverages_types_elements.map(
                (item: IOperationCoveragesTypesElement) => ({
                  value: item.id ?? 0,
                  label: item.name ?? '',
                })
              ) ?? [],
          })
        )
      },
      assignInvestmentPortfolioTitlesForeignCurrency(
        investment_portfolio_titles_foreign_currency: []
      ) {
        this.investment_portfolio_titles_foreign_currency =
          investment_portfolio_titles_foreign_currency.map(
            (item: IGenerateBallotData) => ({
              ...item,
              value: item.title_id || '',
              label: item.operation_type_description || '',
              origin_currency_value: item.origin_currency_value,
              operation_value_origin_currency:
                item.operation_value_origin_currency,
              operation_value_local_currency:
                item.operation_value_local_currency,
              resource_placement_date: item.resource_placement_date,
              compliance_date: item.compliance_date,
              operation_value: item.operation_value,
              benefit_id:
                typeof item.benefit_id === 'string'
                  ? Number(item.benefit_id)
                  : item.benefit_id,
            })
          )
      },
      assignValorationTrm(data: IValorationTrmResource[]) {
        this.valoration_trm = Array.isArray(data) ? data : []
      },

      assignParticipationEmitterForeignCurrency(
        fic_participation_emitter_foreign_currency: []
      ) {
        this.fic_participation_emitter_foreign_currency =
          fic_participation_emitter_foreign_currency?.map(
            (item: ISelectorResources) => ({
              ...item,
              value: item.id || item.value,
              label: item.name || item.label || item.description,
            })
          )
      },
      assignParticipationCounterpartyForeignCurrency(
        fic_participation_counterparty_foreign_currency: []
      ) {
        this.fic_participation_counterparty_foreign_currency =
          fic_participation_counterparty_foreign_currency?.map(
            (item: ISelectorResources) => ({
              ...item,
              value: item.id || item.value,
              label: item.name || item.label || item.description,
            })
          )
      },
      assignParticipationAdministratorForeignCurrency(
        fic_participation_administrator_foreign_currency: []
      ) {
        this.fic_participation_administrator_foreign_currency =
          fic_participation_administrator_foreign_currency?.map(
            (item: ISelectorResources) => ({
              ...item,
              value: item.id || item.value,
              label: item.name || item.label || item.description,
            })
          )
      },
      assignParticipationAdministratorLocalCurrency(
        fic_participation_administrator: []
      ) {
        this.fic_participation_administrator =
          fic_participation_administrator?.map((item: ISelectorResources) => ({
            ...item,
            value: item.id || item.value,
            label: item.name || item.label || item.description,
          }))
      },
      assignParticipationCounterpartyLocalCurrency(
        fic_participation_counterparty: []
      ) {
        this.fic_participation_counterparty =
          fic_participation_counterparty?.map((item: ISelectorResources) => ({
            ...item,
            value: item.id || item.value,
            label: item.name || item.label || item.description,
          }))
      },
      assignParticipationEmitterLocalCurrency(fic_participation_emitter: []) {
        this.fic_participation_emitter = fic_participation_emitter?.map(
          (item: ISelectorResources) => ({
            ...item,
            value: item.id || item.value,
            label: item.name || item.label || item.description,
          })
        )
      },
      assignPermissionUserPrtafolio(permission_user_portfolio: []) {
        this.permission_user_portfolio = permission_user_portfolio?.map(
          (item: ISelectorResources) => ({
            ...item,
            value: item.id || item.value,
            label: item.description || item.name || item.label,
          })
        )
      },
      assignInvestmentPortfolioCollectionMethods(
        investment_portfolio_collection_methods: []
      ) {
        this.investment_portfolio_collection_methods =
          investment_portfolio_collection_methods?.map(
            (item: ISelectorResources) => ({
              value: item.id || '',
              label: item.description || item.name || '',
            })
          ) ?? []
      },
      assignInvestmentPortfolioPaymentMethods(
        investment_portfolio_payment_methods: []
      ) {
        this.investment_portfolio_payment_methods =
          investment_portfolio_payment_methods?.map(
            (item: ISelectorResources) => ({
              value: item.id || '',
              label: item.description || item.name || '',
            })
          ) ?? []
      },
      assignEmitterBuyer(resources: [], key: string | undefined) {
        this.assignMapIdDescription(resources, key)
        this.emitter_buyer_portfolio = resources.map(
          (item: ISelectorResources) => ({
            value: item.id || '',
            label: `${item.document_third} - ${item.description}` || '',
            description: item.description || '',
          })
        )

        this.emitter_buyer = resources.map((item: ISelectorResources) => ({
          value: item.id || '',
          label: `${item.document_third} - ${item.description}` || '',
          description: item.description || '',
        }))
      },
      assignOperationComplianceStatuses(operation_compliance_statuses: []) {
        this.operation_compliance_statuses = operation_compliance_statuses.map(
          (item: ISelectorResources) => ({
            value: item.id,
            label: item.status,
          })
        )
      },
      assignPaperTypeEncompassAndDivision(
        paper_type_encompass_and_division: IPaperTypeEncompassAndDivisionResource[]
      ) {
        this.paper_type_encompass_and_division =
          paper_type_encompass_and_division?.map((item) => ({
            ...item,
            value: item.id || '',
            label: item.description || '',
          })) ?? []
      },
      assignEncompassInversionClasses(encompass_inversion_classes: []) {
        this.encompass_inversion_classes =
          encompass_inversion_classes?.map((item: ISelectorResources) => ({
            value: item.value || '',
            label: item.label || '',
          })) ?? []
      },
      assignAvailableTitlesForDivisionAndEncompass(
        available_titles_for_division_and_encompass: IAvailableTitlesForDivisionAndEncompassResource[]
      ) {
        this.available_titles_for_division_and_encompass =
          available_titles_for_division_and_encompass?.map((item) => ({
            ...item,
            value: item.id || '',
            label: item.title_number?.toString() || '',
          })) ?? []
        this.available_titles_for_division_and_encompass_rows =
          available_titles_for_division_and_encompass.map(
            (item: IAvailableTitlesForDivisionAndEncompassResource) => ({
              ...item,
            })
          )
      },
      assignRateType(rate_type: []) {
        this.rate_type =
          rate_type?.map((item: IGenericResource) => ({
            value: item.value ?? '',
            label: item.label ?? '',
          })) ?? []
      },
      assignOperationsTypeList(operations: IGenericResource[]) {
        this.operations_type_list =
          operations?.map((item: IGenericResource) => ({
            value: item.value,
            label: item.label,
          })) ?? []
      },
      assignOperationsStatusList(statuses: IGenericResource[]) {
        this.operations_status_list =
          statuses?.map((item: IGenericResource) => ({
            value: item.value,
            label: item.label,
          })) ?? []
      },

      assignDerivativeClass(derivative_class: IGenericResource[]) {
        this.derivative_class =
          derivative_class?.map((item: IGenericResource) => ({
            value: item.id!,
            label: `${item.code} - ${item.description}`,
          })) ?? []
      },

      assignDerivativeCoverage(derivative_coverage: IGenericResource[]) {
        this.derivative_coverage =
          derivative_coverage?.map((item: IGenericResource) => ({
            value: item.id!,
            label: `${item.code} - ${item.description}`,
          })) ?? []
      },

      assignDivisionInversionClass(division_inversion_classes: []) {
        this.division_inversion_classes = division_inversion_classes?.map(
          (item: ISelectorResources) => ({
            value: item.id || item.value || '',
            label: item.name || item.label || item.description,
          })
        )
      },
      assignForeignCurrencyIssuers(foreign_currency_shar_issuers_selector: []) {
        this.foreign_currency_shar_issuers_selector =
          foreign_currency_shar_issuers_selector?.map(
            (item: IQuotasIssuingPermitsResource) => ({
              ...item,
              value: item.id as number | string,
              label: `${item.document_third} - ${item.description}` || '',
            })
          ) ?? []
      },
      assignForeignSellExchangeTradedFund(
        available_title_for_foreign_sell_exchange_traded_fund: []
      ) {
        this.available_title_for_foreign_sell_exchange_traded_fund =
          available_title_for_foreign_sell_exchange_traded_fund?.map(
            (item: IEquityOpsResource) => ({
              value: item.id as number | string,
              label: item.balance,
            })
          )
      },
      assignInversionTypes(inversion_types: []) {
        this.inversion_types = inversion_types.map(
          (item: ISelectorResources) => ({
            value: item.id || item.value || '',
            label: item.description,
          })
        )
      },
      assignInvestmentPortfolioBankAccounts(
        investment_portfolio_bank_accounts: IInvestmentPortfolioBankAccountResource[]
      ) {
        this.investment_portfolio_bank_accounts =
          investment_portfolio_bank_accounts?.map((item) => ({
            ...item,
            value: item.id,
            label: `${item.account_number} - ${item.account_name}`,
            description: item.account_type,
            bank_id: item.bank_id,
          })) ?? []
      },

      assignPaperTypeLocalCurrency(paper_type_local_currency: []) {
        this.paper_type_local_currency =
          paper_type_local_currency?.map((item: ISelectorResources) => ({
            value: item.id || '',
            label: `${item.code} - ${item.description}`,
            currency_id: Number(item.currency_id) || 0,
          })) ?? []
      },

      assignDerivativeType(derivative_type: []) {
        this.derivative_type =
          derivative_type?.map((item: IGenericResource) => ({
            value: item.id!,
            label: item.name!,
          })) ?? []
      },
      assignDerivativeUnderlying(derivative_underlying: []) {
        this.derivative_underlying =
          derivative_underlying?.map((item: IGenericResource) => ({
            value: item.id!,
            label: item.name!,
          })) ?? []
      },
      assignTypeOfOperation(type_of_operation: []) {
        this.type_of_operation = type_of_operation ?? []
      },
      assignOptionsPositionsList(options_positions_list: []) {
        this.options_positions_list = options_positions_list ?? []
      },
      assignStatusGuaranteeList(status_guarantee_list: []) {
        this.status_guarantee_list = status_guarantee_list ?? []
      },
      assignGuaranteeOperationList(guarantee_operation_list: []) {
        this.guarantee_operation_list = guarantee_operation_list ?? []
      },
      async getResources(params: string) {
        const customHandlers: Record<
          string,
          (value: any, key: string | undefined) => void
        > = {
          qualification: this.assignQualificationActions,
          coins: this.assignCoins,
          InterestRate: this.assignInterestRate,
          issuers_counterparty: this.assignIssuersCounterparty,
          risk_rating_agencie: this.assignRiskRatingAgencie,
          qualification_lp: this.assignQualificationLp,
          qualification_cp: this.assignQualificationCp,
          administrators_codes: this.assignAdministratorsCodes,
          perioricities: this.assignPerioricities,
          titles_classes: this.assignTitlesClasses,
          emitter_codes: this.assignEmitterCodes,
          emitter_anna_codes: this.assignIsinesEmitterAnnaCodes,
          interest_rate_payment_frequency:
            this.assignInterestRatePaymentFrequencyMain,
          rates_behaviors: this.assignRatesBehaviors,
          accounting_origin: this.assignTypeAccountingOrigin,
          operation_natural: this.assignNatureOperation,
          type_bursatility: this.assignTypesMarketability,
          price_provider_issuers: this.assignThirdPartyIssuersSelector,
          name_files_list: this.assignNameFilesSelector,
          date_formats: this.assignDateFormatsSelector,
          investment_portfolio: this.assignPermissionsInvestmentPortfolio,
          third_party_issuers_selector: this.assignThirdPartyIssuers,
          selectable_portfolios_with_code_and_name: this.assignMapIdCode,
          type_investment: this.assignMapIdIndex,
          paper_type: this.assignMapPaperType,
          issuer_seller: this.assignMapIdValueDescription,
          isin_code_mnemonics: this.assignIsinCodeMnemonics,
          investment_portfolio_code_local_currency:
            this.assignMapIdValueDescription,
          operation_type_code_local_currency: this.assignMapIdValueDescription,
          currency_local: this.assignCurrencyLocal,
          paper_type_local_currency: this.assignPaperTypeLocalCurrency,
          issuer_counterparty_local_currency: this.assignMapIdValueDescription,
          operation_type: this.assignOperationType,
          currency_type_of_currency: this.assignTypeCurrency,
          third_party_issuers_selector_dividend: this.assignThirdPartyIssuers,
          emitter: this.assignEmitter,
          fic_participation_details: this.assignFicParticipationDetails,
          fic_participation_value_foreign:
            this.assignFicParticipationValueForeign,
          class_portfolio: this.assignClassPortfolio,
          paper_type_participation: this.assignPaperTypeParticipation,
          manual_unit_value: this.assignManualUnitValue,
          actions: this.assignActions,
          rate: this.assignRate,
          interest_rates: this.assignIsinesInterestRates,
          oldest_unit_value_by_emitter: this.assignOldestUnitValueByEmitter,
          available_titles_by_emitter: this.assignAvailableTitlesByEmitter,
          type_of_coins: this.assignTypeCoins,
          class_investment: this.assignClassInvestment,
          type_auxiliary: this.assignTypeAuxiliary,
          paper_types_form_parameters: this.assignPaperTypesFormParameters,
          modality: this.assignModality,
          currency_foreign: this.assignCurrencyForegin,
          list_counterparty_associated_trader: this.assignCounterparties,
          issuer_deposit: this.assignIssuerDeposit,
          currency_for_paper_type: this.assignCurrencyForPaperType,
          currency_all: this.assignCurrencyAll,
          isin_code_type_changeable: this.assignIsinCodeChangable,
          exchange_traded_fund_all: this.assignExchangeTraded,
          withdrawal_participation_unit_local_currency:
            this.assignUnitLocalCurrencyWithdrawalParticipation,
          withdrawal_participation_fic_foreign_currency:
            this.assignFicForeignCurrencyWithdrawalParticipation,
          withdrawal_participation_unit_foreign_currency:
            this.assignUnitForeignCurrencyWithdrawalParticipation,
          withdrawal_participation_fic_local_currency:
            this.assignFicLocalCurrencyWithdrawalParticipation,
          available_titles_by_emitter_currency_foreign:
            this.assignAvailableTitlesByEmitterCurrencyForeign,
          market_types_buy_fixed_income: this.assignMarketTypesBuyFixedIncome,
          exchange_traded_fund_local: this.assignExchangeTradedFundLocal,
          exchange_traded_fund_foreign: this.assignExchangeTradedFundForeign,
          operation_exchange_traded_fund_statuses:
            this.assignOperationExchangeTradedFundStatus,
          available_title_for_sell_exchange_traded_fund:
            this.assignLocalSellExchangeTradedFund,
          currency_in_valoration_files: this.assignCurrencyInValorationFiles,
          list_investment_portfolios_associated_trader:
            this.assignInvestmentPortfoliosAssociatedTrader,
          list_emitter_associated_trader: this.assignEmittersAssociatedTrader,
          titles_for_issuer: this.assignTitlesForIssuer,
          compensation_system_list: this.assignCompensationSystemList,
          local_currency_type: this.assignLocalCurrencyType,
          foreign_currency_type: this.assignForeignCurrencyType,
          instruction_slip_types: this.assignInstructionSlipTypes,
          investment_portfolio_operation_types:
            this.assignInvestmentPortfolioOperationTypes,
          investment_portfolio_titles: this.assignInvestmentPortfolioTitles,
          type_accounts: this.assignTypeAccounts,
          investment_portfolio_benefit: this.assignInvestmentPortfolioBenefit,
          investment_portfolio_banks: this.assignInvestmentPortfolioBank,
          operation_coverage: this.assignCoverageTypes,
          investment_portfolio_titles_foreign_currency:
            this.assignInvestmentPortfolioTitlesForeignCurrency,
          coins_exchange_traded_fund: this.assignCoins,
          emitter_buyer: this.assignEmitterBuyer,
          issuer_counterparty_all: this.assignMapIdValueDescription,
          valoration_trm: this.assignValorationTrm,
          emitters: this.assignEmitter,
          fic_participation_administrator_foreign_currency:
            this.assignParticipationAdministratorForeignCurrency,
          fic_participation_counterparty_foreign_currency:
            this.assignParticipationCounterpartyForeignCurrency,
          fic_participation_emitter_foreign_currency:
            this.assignParticipationEmitterForeignCurrency,
          fic_participation_administrator:
            this.assignParticipationAdministratorLocalCurrency,
          fic_participation_counterparty:
            this.assignParticipationCounterpartyLocalCurrency,
          fic_participation_emitter:
            this.assignParticipationEmitterLocalCurrency,
          permission_user_portfolio: this.assignPermissionUserPrtafolio,
          investment_portfolio_collection_methods:
            this.assignInvestmentPortfolioCollectionMethods,
          investment_portfolio_payment_methods:
            this.assignInvestmentPortfolioPaymentMethods,
          operation_compliance_statuses: this.assignOperationComplianceStatuses,
          paper_type_encompass_and_division:
            this.assignPaperTypeEncompassAndDivision,
          encompass_inversion_classes: this.assignEncompassInversionClasses,
          available_titles_for_division_and_encompass:
            this.assignAvailableTitlesForDivisionAndEncompass,
          rate_type: this.assignRateType,
          derivative_class: this.assignDerivativeClass,
          derivative_coverage: this.assignDerivativeCoverage,
          operations_type_list: this.assignOperationsTypeList,
          operations_status_list: this.assignOperationsStatusList,
          division_inversion_classes: this.assignDivisionInversionClass,
          active_issuers_with_balance_selector: this.assignActiveIssuersBalance,
          foreign_currency_shar_issuers_selector:
            this.assignForeignCurrencyIssuers,
          available_title_for_foreign_sell_exchange_traded_fund:
            this.assignForeignSellExchangeTradedFund,
          inversion_types: this.assignInversionTypes,
          third_party_issuers_selector_emitter: this.assignThirdPartyIssuers,
          derivative_type: this.assignDerivativeType,
          derivative_underlying: this.assignDerivativeUnderlying,
          investment_portfolio_bank_accounts:
            this.assignInvestmentPortfolioBankAccounts,
          type_of_operation: this.assignTypeOfOperation,
          options_positions_list: this.assignOptionsPositionsList,
          status_guarantee_list: this.assignStatusGuaranteeList,
          guarantee_operation_list: this.assignGuaranteeOperationList,
        }
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/select-tables${params}`)
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
  }
)

export * from '@/interfaces/customs/Filters'

export type {
  IReasonForConsultation,
  IReasonForConsultationForm,
} from '@/interfaces/customs/ReasonForConsultation'

export type {
  IGynecostaticBackgroundForm,
  IGynecostaticBackground,
} from '@/interfaces/customs/GynecostaticBackground'

export type { IDataTable, ITableProps } from '@/interfaces/customs/DataTable'
export type {
  IMedicalExamRequest,
  IMedicalExamTable,
  IMedicalExamFile,
  IMedicalExamFileBase,
} from '@/interfaces/customs/MedicalExam'

export type {
  IVitalSigns,
  IStructureGraphicData,
  IAnnotationPoint,
} from '@/interfaces/customs/VitalSigns'

export type {
  IManagementPlanRequest,
  IManagementPlanTable,
} from '@/interfaces/customs/ManagementPlan'

export type {
  ITemplate,
  IPhysicalExam,
  IPhysicalExamKeys,
} from '@/interfaces/customs/Template'

export type {
  IMedicamentsRequest,
  IMedicamentsTable,
} from '@/interfaces/customs/Medicaments'

export type {
  IProceduresRequest,
  IProceduresTable,
} from '@/interfaces/customs/Procedures'

export type {
  IDocumentTable,
  IDocumentFile,
} from '@/interfaces/customs/Documents'

export type {
  IMedicalLaboratoryFile,
  IMedicalLaboratoryRequest,
  IMedicalLaboratoryTable,
} from '@/interfaces/customs/MedicalLaboratory'

export type {
  ISupplier,
  ISupplierList,
  IRowSupplier,
} from '@/interfaces/customs/suppliers'

export type {
  IRoles,
  IRolesList,
  IRowRoles,
  IRolesCount,
  IFormDataRole,
  IJsonOptionsInactive,
  IPermissionRole,
} from '@/interfaces/customs/roles'

export type {
  IDisciplinaryProcesses,
  IDisciplinaryProcessesList,
} from '@/interfaces/customs/disciplinaryProcesses'

export type { ICenterCostListCustom } from '@/interfaces/customs/CenterCost'

export type {
  IBranchListCustom,
  ICreateUpdateBranch,
  IBranchData,
} from '@/interfaces/customs/IBranchs'

export type {
  IRegional,
  IRegionalList,
  IRegionalData,
} from '@/interfaces/customs/IRegionals'

export type {
  IChartAccountsListCustom,
  IAccountInfoCreate,
} from '@/interfaces/customs/IChartAccounts'

export type {
  IDependencyList,
  ICreateUpdateDependency,
  IDependencyData,
} from '@/interfaces/customs/Dependency'

export type {
  ILocationList,
  ICreateUpdateLocation,
  ILocationData,
} from '@/interfaces/customs/Locations'

export type {
  IDepreciationList,
  ICreateUpdateDepreciation,
  IDepreciationData,
  IDepreciationHistoryList,
} from '@/interfaces/customs/Depreciation'

export type {
  IVehicleForm,
  IInsuranceTable,
  IAccidentTable,
} from '@/interfaces/customs/Vehicle'

export type {
  ICreateUpdateConsumerGood,
  IConsumerGoodData,
  IConsumerGoodList,
} from '@/interfaces/customs/ConsumerGood'

export type {
  ISuppliesForm,
  ILinkedAssetsTable,
} from '@/interfaces/customs/Supplies'

export type {
  ITransactionTypesList,
  ICreateUpdateTransactionTypes,
  ITransactionTypesData,
} from '@/interfaces/customs/TransactionTypes'

export type {
  IImpairmentsListCustom,
  IImpairmentsInfoCreate,
} from '@/interfaces/customs/IImpairments'

export type {
  ICreateUpdateGoodsClass,
  IGoodsClassData,
  IGoodsClassList,
} from '@/interfaces/customs/GoodsClass'

export type {
  ICreateUpdateUnitMeasurement,
  IUnitMeasurementData,
  IUnitMeasurementList,
} from '@/interfaces/customs/UnitMeasurement'

export type {
  ICreateUpdateRetentions,
  IRetentionsData,
  IRetentionsFilters,
} from '@/interfaces/customs/Retentions'

export type {
  ICreateUpdateDispatch,
  IDispatchList,
} from '@/interfaces/customs/Dispatch'

// Fidu news interfaces
export type {
  IThirdPartiesTable,
  IThirdPartyResource,
} from '@/interfaces/customs/IThirdParties'
export type { IBankAccountTable } from '@/interfaces/customs/banks'
export type {
  IClientNaturalPersonRequest,
  IClientList,
  IClientsDocuments,
  ILegalClientInformation,
  ILegalRepresentationClient,
  ILegalClientCorporative,
  ILegalClientTributary,
  ILegalClientShareholder,
  ILegalClientManager,
  ILegalClientDocument,
  ILegalClientInvestor,
  IManagerInfoForm,
  IManagerPEPForm,
  INaturalClientDocument,
  INaturalClientFinanceForm,
  INaturalClientInformationForm,
  INaturalClientInvestor,
  INaturalClientPepForm,
  INaturalClientTributaryForm,
  IShareholderInfoForm,
  IShareholderPEPForm,
  IShareholderProfileForm,
  IShareholderTributaryForm,
  ITrustorClientFinance,
  ITrustorClientForm,
  ITrustorClientInternational,
  ITrustorResponse,
  INaturalClientEstate,
  IManager,
} from '@/interfaces/customs/Clients'

export type {
  IFailedAttemptsChart,
  IUsersStatus,
  IUsersStatusList,
  IUserConnectedCount,
  IUserConnectedList,
  IUserConnectionTime,
  ApexChartsCustom,
} from '@/interfaces/customs/Security'

export type {
  ITypesCollectionList,
  ITreasuryTypeReceiveList,
} from '@/interfaces/customs/TypesCollection'
export type { IParameters } from '@/interfaces/customs/Parameters'

export type {
  IResourceThirdParty,
  IBankEntity,
  IBankingEntitiesList,
} from '@/interfaces/customs/treasury/BankingEntities'

export type { IBankAccountBalance } from '@/interfaces/customs/treasury/BankAccountBalances'

export type {
  FullNameParams,
  IFormatCurrencyOptions,
  TitleDescription,
} from '@/interfaces/customs/Utils'

export type {
  IStructureChartAccount,
  IChartAccount,
  IChartAccountCreate,
  IChartAccountResponse,
  ITemplateResponse,
  IAccountChartResource,
} from '@/interfaces/customs/accounting/ChartAccount'

export type {
  IAccountingReceipt,
  IAccountingReceiptItem,
  IVoucherAmount,
} from '@/interfaces/customs/accounting/AccountingReceipt'

export type {
  IActionProps,
  IIndexingIpcProcessItem,
  IIndexingIpcItem,
  IIndexingListRequest,
  IFundInfoRequest,
} from '@/interfaces/customs/fics/IndexingIpc'

export type {
  IAttachedDocumentsList,
  IAttachedDocumentStatus,
  IAttachedDocumentForm,
} from '@/interfaces/customs/AttachedDocuments'

// Modules
export type * from '@/interfaces/customs/Clients'
export type * from '@/interfaces/customs/IPages'
export type * from '@/interfaces/customs/treasury'
export type * from '@/interfaces/customs/trust-business'
export type * from '@/interfaces/customs/investment-portfolio'
export * from '@/interfaces/customs/accounting'
export type * from '@/interfaces/customs/Utils'
export type * from '@/interfaces/customs/ChipsCount'
export type * from '@/interfaces/customs/GenericCheckboxSelector'
export type * from '@/interfaces/customs/resources'
export type * from '@/interfaces/customs/settlement-commissions'
export type * from '@/interfaces/customs/billing-portfolio'
export type * from '@/interfaces/customs/accounts-payable'
export type * from '@/interfaces/customs/derivative-contracting'
export type * from '@/interfaces/customs/budget'

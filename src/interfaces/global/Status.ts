export enum StatusID {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum AccountingReceiptStatusID {
  ANNULED = 11,
  REGISTERED = 63,
}

export enum ScheduleDeferralStatusID {
  PROCESSED = 24,
  PENDING = 25,
  PROGRAMMED = 34,
}

export enum InvestmentPortfolioStatusID {
  INACTIVE = 0,
}

export enum homologationProcessLogStatusID {
  HOMOLOGATION_SUCCEED = 87,
  HOMOLOGATION_FAILED = 88,
  DELETED_HOMOLOGATION = 89,
}

export enum homologationProcessStatusID {
  PARTIALY_HOMOLOGATED = 84,
  HOMOLOGATED = 85,
  NOT_HOMOLOGATED = 86,
}

export enum BalancePointStatusID {
  AUTHORIZED = 71,
  REGISTERED = 63,
  REJECTED = 10,
}

export enum ProjectStatusID {
  REGISTERED = 63,
  AVAILABLE = 83,
  PENDING = 82,
  FINISHED = 81,
  PRE_SALE = 80,
  IN_PROGRESS = 79,
  PLANNING = 78,
  SUSPENDED = 60,
}

export enum FicStatusID {
  AUTHORIZED = 69,
  REJECTED = 10,
  ANNULED = 11,
}

export enum TypesContractingDocumentStatusFlowTypeID {
  PREDEFINED = 69,
  SEQUENTIAL = 70,
  PERSONALIZED = 71,
}

export enum BudgetDocumentCancellationStatuses {
  PENDING_APPROVAL = 8,
  AUTHORIZED = 55,
  ACTIVE = 1,
  APPROVED = 9,
  ANNULLED = 11,
}

export enum SecondAuthorizationOrderStatuses {
  AUTHORIZED = 56,
  PAID = 9,
  LEGALIZED = 11,
  PARTIAL_PAID = 10,
  CAUSED = 8,
  REGISTERED = 5,
}

export enum FileChargingStatus {
  LOADING = 8,
  SUCCESS = 7,
  ERROR = 6,
}

export enum FileShowStatusId {
  PENDING = 20,
  SUCCESS = 104,
  ERROR = 30,
}

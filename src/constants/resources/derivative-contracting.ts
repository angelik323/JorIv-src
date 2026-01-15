export const typePaymentOptions = [
  { label: 'Parcial', value: 'Parcial' },
  { label: 'Final', value: 'Final' },
]

export const DOCUMENTARY_STRUCTURE_CONTRACT_QUERY_PARAMS = {
  MANAGES_POLICIES: 'manages_policies',
  FILTER: {
    CONTRACT_DOCUMENT_ID: 'filter[contract_document_id]',
    SEARCH: 'filter[search]',
  },
} as const

export const CONTRACT_REGISTRATION = {
  FILTER: {
    BUSINESS_ID: 'business_trusts_id',
    CONTRACT_DOCUMENT_TYPE_ID: 'contract_document_structure_id',
    CONTRACTOR_ID: 'contractor_id',
    STATUS: 'status_id',
  },
}

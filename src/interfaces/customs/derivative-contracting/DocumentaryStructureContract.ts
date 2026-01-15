export interface IDocumentaryStructureContract {
  id: number
  contract_document_code: string
  contract_document_name: string
  handle_stamp_duty: boolean
  taxable_base_unit: string | null
  tax_base: string
  requires_publication: boolean
  minimum_amount: string
  policy_management: boolean
  selected?: boolean
}

export interface IDocumentaryStructureContractAnnexedDocument {
  id?: number | null
  type_attached_document?: {
    id?: number | null
    type?: string | null
    value?: string | null
    name?: string | null
    policy_type?: boolean
  }
  type_attached_document_id: number | null
  type_of_policy_id: number | null
  stage: string | null
  mandatory: string | null
  status_id: number | null
  is_new?: boolean
}

export interface IDocumentaryStructureContractList
  extends Array<IDocumentaryStructureContract> {}

export interface IDocumentaryStructureContractAnnexedDocumentList
  extends Array<IDocumentaryStructureContractAnnexedDocument> {}

export interface IDocumentaryStructureContractForm {
  type_id: number | null
  handle_stamp_duty: boolean
  taxable_base_unit: string | null
  tax_base: number | null
  requires_publication: boolean
  minimum_amount_unit: string | null
  minimum_amount: number | null
  policy_management: boolean
  attachments: IDocumentaryStructureContractAnnexedDocumentList
}

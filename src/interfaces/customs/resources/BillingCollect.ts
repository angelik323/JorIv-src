import { IGenericResource } from './Common'
export interface IInvoicesNotesResource extends IGenericResource {
  id: number
  invoice_number: number
  pdf_signed_url: string
  settled_commission: string | boolean
  status: string | boolean
}

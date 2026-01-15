import { IGenericResource } from "../resources/Common"

export interface IPaymentRequest extends IGenericResource {
    request_number: string
    radicated_code: string
    invoice_number: string
    reception_date: string
    total_value: string
    status_id: number
  }
interface IStatus {
  id: number
  name: string
}

export interface IBankContactList {
  id?: number
  bank_id?: number
  bank_branch_id?: number | null
  full_name: string
  job_title: string
  area: string
  landline_phone: string
  mobile_phone: string
  email: string | null
  preferred_contact_channel: string | null
  products: string | null
  working_days: string[]
  available_from: string | null
  available_to: string | null
  status?: IStatus
  description?: string | null
  status_id?: number
  code?: string
}

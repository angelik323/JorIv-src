export interface IAccountingParametersProcessCodesForm {
  id: number | null
  code: string | null
  description: string | null
  process_type_id: number | null
  process_nature_id: number | null
  process_class_id: number | null
  movement_code_id?: number | null
}

export interface IAccountingParametersProcessCodes {
  id: number | null
  code: string | null
  description: string | null
  movement_code_id?: number | null
  classes_movement_type: {
    id: number | null
    code: string | null
  }
  classes_movement_nature: {
    id: number | null
    code: string | null
  }
  classes_movement_class: {
    id: number | null
    code: string | null
  }
  movement_code?: {
    id: number | null
    code: string | null
  }
}

export type IAccountingParametersProcessCodesList =
  IAccountingParametersProcessCodes[]

export type IAccountingParametersProcessCodesFormList = {
  process_codes: IAccountingParametersProcessCodesForm[]
}

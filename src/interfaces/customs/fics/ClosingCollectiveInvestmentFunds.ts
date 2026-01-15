import { IUploadedFile } from '@/interfaces/global'

export interface IFundsIdUndoClosure {
  funds: IFundIdUndoClosure[]
}

interface IFundIdUndoClosure {
  id: string | number | undefined
}

export interface ITempArrMovements<T = IMovementTemp> {
  closing_date: string
  funds: IRegisterTemp<T>[]
}

export interface IRegisterTemp<T = IMovementTemp> {
  id: string | number | undefined
  participation_types: IParticipationType<T>[]
}

interface IParticipationType<T = IMovementTemp> {
  id: string | number
  movements: T[]
}

export interface IMovementTemp {
  id?: string | number
  movement_id: string | undefined
  movement_description: string | undefined
  income_expense: string | undefined
  movement_value: string | number | undefined
  participation_type_code?: string
}

export interface IMovementSimplified extends Pick<IMovementTemp, 'id'> {
  value: number | string
}

export type ITempArrMovementsSimplified = ITempArrMovements<IMovementSimplified>
export type IRegisterTempSimplified = IRegisterTemp<IMovementSimplified>
export type IParticipationTypeSimplified =
  IParticipationType<IMovementSimplified>

export interface IImportMovementsBach {
  codigo_fondo_de_inversion: number
  tipo_de_participacion: number
  codigo_de_movimiento: number
  valor_del_movimiento: number
  fund_id: number
  participation_type_id: number
  value: number | string
  movement_description: string
  participation_type_code: string
  fund_code: string
  movement_code: string
  movement_id: number
}

export interface IImportMovementsBachTable {
  id: number
  fund_code: number
  participation_type: number | string
  movement_code: number | string
  movement_value: number | string
  participation_type_code: string
  movement_id: number | string
  fund_id: number | string
}

export interface ICollectiveInvesmentFund {
  id: number
  fund_id: number
  fund_code: string
  fund_name: string
  business_trust: null
  last_closing_date: null | string
  status: IClosingCollectiveInvestmentFundsParticipationsStatus
  has_participation_types: boolean
  participation_types: IClosingCollectiveInvestmentFundsParticipationsType[]
  consolidation_option: IConsolidationOption
  participation_type: null | string
}

export interface IFileAtachment {
  id: string
  filename: string
  total_records: number
  status: number
  file: IUploadedFile
}

export interface IImportedMovement {
  id: number
  file_name: string
  closing_date: string
  status: {
    id: number
    status: string
    comments: string | null
  }
  total_records: number
  successful_records: number
  failed_records: number
  loaded_records: number
}

export type ITypeofParticipation = Omit<
  ICollectiveInvesmentFund,
  | 'fund_name'
  | 'business_trust'
  | 'last_closing_date'
  | 'has_participation_types'
  | 'consolidation_option'
>
interface IConsolidationOption {
  id: number
  code: string
  description: string
  status_id: number
  created_at: Date
  updated_at: Date
  cancellation_reason: null
  type: number
  deleted_at: null
  name?: string
  participation_types_balance?: number
}

export interface IClosingCollectiveInvestmentFundsParticipationsType {
  id: number
  fund_id: number
  business_line_id: number
  created_at: Date
  updated_at: Date
  deleted_at: null
  business_line: IConsolidationOption
  fip_parameters: []
  participation_types_balance: number
}

export interface IInvestmentFundsTable {
  id?: string | number
  fund_code: string
  fund_name: string
  last_closing_date: string
  participation_types: IClosingCollectiveInvestmentFundsParticipationsType[]
  consolidation_option: IConsolidationOption
  status: IClosingCollectiveInvestmentFundsParticipationsStatus
}
export interface IParticipationTypeTable {
  id: string | number
  fund_id: string | number
  fund_code: string
  participation_id: string | number
  participation_description: string
  balance_participation_type: number
  participation_type: string
}

export interface IClosingCollectiveInvestmentFundsParticipationsStatus {
  id: number
  status: string
  comments?: null
}

export interface IParticipationFundsType {
  fund: string
  participation_type: string
  participation_description: string
  initial_balance: string | number
}

export interface IParticipationFundsDetail {
  id?: string | number
  movement_id: string | undefined
  movement_description: string | undefined
  income_expense: string | undefined
  movement_value: string | number | undefined
  value?: string | number
}

export interface ISelectOptionsList {
  value: number | string
  label: string
}

export interface ISelectorResourcesMovements {
  label: string
  value: number
  description: string
  code?: string
}

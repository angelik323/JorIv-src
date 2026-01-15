export type ActionType = 'create' | 'edit' | 'view'

export type ExtendedActionTypeCopy = ActionType | 'copy'

export type ExtendedActionTypeCancel = ActionType | 'cancel'

export type WriteActionType = Extract<ActionType, 'create' | 'edit'>

export type NonEditActionType = Extract<ActionType, 'create' | 'view'>

export type NonCreateActionType = Extract<ActionType, 'edit' | 'view'>

export type ExtendedActionTypeAuth =
  | ActionType
  | 'authorize'
  | 'cancel'
  | 'annular'

export type ActionHandlers = {
  [K in ExtendedActionTypeCopy]?: () => void
}

export enum ActionTypeEnum {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
  COPY = 'copy',
  AUTHORIZE = 'authorize',
  CANCEL = 'cancel',
  ANNULAR = 'annular',
  DELETE = 'delete',
  SHOW = 'show',
}

export type ActionTypeProcess = 'process' | 'undo' | 'view' | 'details'
export type SignatureActions = 'logo' | 'signature'
export type ReportTemplateActions =
  | 'template'
  | 'logo'
  | 'signature'
  | 'reports'

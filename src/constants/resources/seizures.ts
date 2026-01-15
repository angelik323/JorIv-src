export const TYPE_OF_ASSET_OPTIONS = [
  { label: 'Inmueble', value: 1 },
  { label: 'Mueble', value: 2 },
]

export enum LiftTypes {
  TEMPORARY = 1,
  PERMANENT = 2,
}

export const liftTypeOptions = [
  {
    label: 'Temporal',
    value: LiftTypes.TEMPORARY,
  },
  {
    label: 'Permanente',
    value: LiftTypes.PERMANENT,
  },
]

export enum SeizureManagementTypes {
  ACTIVATE = 'ACTIVATE',
  FOLLOW_UP = 'FOLLOW_UP',
  PAYMENT_ORDER = 'PAYMENT_ORDER',
  LIFT = 'LIFT',
  CERTIFY_UNSEIZABLE = 'CERTIFY_UNSEIZABLE',
}

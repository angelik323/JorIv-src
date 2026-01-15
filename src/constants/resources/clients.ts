import { IGenericResource } from '@/interfaces/customs'

export const correspondence: IGenericResource[] = [
  { label: 'Email', value: 'Email' },
  { label: 'Correspondencia física', value: 'Correspondencia fisica' },
]

export const BANK_TYPES_OPTIONS: IGenericResource[] = [
  { label: 'Cuenta Corriente', value: 'Cuenta Corriente' },
  { label: 'Cuenta De Ahorros', value: 'Cuenta De Ahorros' },
  { label: 'Cuenta De Deposito', value: 'Cuenta De Deposito' },
  { label: 'Cuenta Remunerada', value: 'Cuenta Remunerada' },
  { label: 'Fuente Crédito', value: 'Fuente Crédito' },
  { label: 'Ventanilla - Caja', value: 'Ventanilla - Caja' },
]

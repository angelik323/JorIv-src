import { BudgetDocumentCancellationStatuses } from '@/interfaces/global'
import { IGenericResource } from '@/interfaces/customs'

export const BUDGET_BALANCE_ACTIONS = [
  { label: 'Disminuye saldo', value: 'decrement' },
  { label: 'Aumenta saldo', value: 'increase' },
]

export const NATURE_OPTIONS = [
  { value: 'D', label: 'Débito' },
  { value: 'C', label: 'Crédito' },
]

export const BUDGET_DOCUMENT_CANCELLATION_CANCELLABLE_STATUSES = [
  BudgetDocumentCancellationStatuses.PENDING_APPROVAL,
  BudgetDocumentCancellationStatuses.AUTHORIZED,
  BudgetDocumentCancellationStatuses.ACTIVE,
  BudgetDocumentCancellationStatuses.APPROVED,
]

export const BUDGET_CLOSURE_STATUSES: IGenericResource[] = [
  { label: 'Exitoso', value: 56 },
  { label: 'Con error', value: 30 },
]

export const BUDGET_CLOSURE_CREATE_PROCESS_TYPE_FILTER_OPTIONS = [
  {
    label: 'Crear cierre',
    value: 'crear',
  },
  {
    label: 'Deshacer cierre',
    value: 'deshacer',
  },
]

export const BUDGET_CLOSURE_CREATE_CLOSURE_TYPE_FILTER_OPTIONS = [
  {
    label: 'Diario',
    value: 'diario',
  },
  {
    label: 'Mensual',
    value: 'mensual',
  },
]

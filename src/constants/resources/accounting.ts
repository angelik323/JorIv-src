// Interfaces
import { DropdownOption } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables/useUtils'

export const accounting_report_options: DropdownOption[] = [
  {
    label: 'Estados financieros',
    icon: useUtils().defaultIconsLucide.filePenLine,
    type: 'group',
    children: [
      {
        label: 'Estado de situación financiera',
        type: 'item',
        routeName: 'FinancialStatementCreate',
      },
      {
        label: 'Estado de resultado integral',
        type: 'item',
        routeName: 'GeneralReportCreate',
      },
      {
        label: 'Estado de cambios en el patrimonio',
        type: 'item',
        routeName: 'LegacyReportCreate',
      },
      {
        label: 'Estado flujo de efectivo',
        type: 'item',
        routeName: '',
      },
    ],
  },
  {
    label: 'Libros oficiales',
    icon: useUtils().defaultIconsLucide.book,
    type: 'group',
    children: [
      {
        label: 'Libro diario',
        type: 'item',
        routeName: 'DiaryBookCreate',
      },
      {
        label: 'Libro mayor y balances',
        type: 'item',
        routeName: 'GeneralLedgerBalancesCreate',
      },
    ],
  },
  {
    label: 'Balances',
    icon: useUtils().defaultIconsLucide.calculator,
    type: 'group',
    children: [
      {
        label: 'Balance general detallado',
        type: 'item',
        routeName: 'DetailedBalanceSheetCreate',
      },
      {
        label: 'Balance centro de costos',
        type: 'item',
        routeName: 'CostCenterReportCreate',
      },
      {
        label: 'Balance en otras monedas',
        type: 'item',
        routeName: 'BGPOtherCurrenciesCreate',
      },
      {
        label: 'Balance consolidado',
        type: 'item',
        routeName: 'ConsolidatedBalanceCreate',
      },
      {
        label: 'Balance comparativo',
        type: 'item',
        routeName: 'ComparativeStatementCreate',
      },
    ],
  },
  {
    label: 'Libros auxiliares',
    icon: useUtils().defaultIconsLucide.notebookText,
    type: 'group',
    children: [
      {
        label: 'Libro mayor auxiliar',
        type: 'item',
        routeName: 'AccumulatedAuxiliaryCreate',
      },
    ],
  },
  {
    label: 'Otros reportes',
    icon: useUtils().defaultIconsLucide.bookOpen,
    type: 'group',
    children: [
      {
        label: 'Comprobante de contabilidad',
        type: 'item',
        routeName: '',
      },
    ],
  },
]

export const selectDates = [
  { label: 'Fechas', value: 'date' },
  { label: 'Períodos', value: 'period' },
]

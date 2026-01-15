export const BULK_UPLOAD_OPTIONS = {
  filters: [
    {
      label: 'Ingresos',
      value: 'income',
    },
    {
      label: 'Egresos',
      value: 'expense',
    },
    {
      label: 'Traslados',
      value: 'transfer',
    },
  ],
  table: [
    {
      label: 'Total registros',
      value: '',
    },
    {
      label: 'Existosos',
      value: 'successful',
    },
    {
      label: 'Errados',
      value: 'with_errors',
    },
  ],
}

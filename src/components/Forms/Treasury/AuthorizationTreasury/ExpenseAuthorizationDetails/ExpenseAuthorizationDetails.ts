import { computed } from 'vue'

import { IAuthorizationTreasuryDetail } from '@/interfaces/customs/treasury/AuthorizationTreasury'

const useExpenseAuthorizationDetails = (props: {
  response: IAuthorizationTreasuryDetail
}) => {
  const item = computed(() => props.response.expense_items?.[0] ?? {})

  const expenseFields = computed(() => [
    {
      label: 'Negocio',
      value: props.response.business_trust_name?.trim() || 'Sin información',
    },
    {
      label: 'Forma de pago',
      value:
        item.value?.payment_method?.description?.trim() || 'Sin información',
    },
    {
      label: 'Banco',
      value: props.response.bank_name?.trim() || 'Sin información',
    },
    {
      label: 'Flujo de caja',
      value: item.value?.cash_flow?.name?.trim() || 'Sin información',
    },
    {
      label: 'Centro de costo',
      value: item.value?.cost_center?.name?.trim() || 'Sin información',
    },
    {
      label: 'Tercero',
      value: item.value?.third_party?.name?.trim() || 'Sin información',
    },
    {
      label: 'Banco beneficiario',
      value: item.value?.beneficiary_bank?.name?.trim() || 'Sin información',
    },
    {
      label: 'Oficina sucursal',
      value: item.value?.bank_branch?.name?.trim() || 'Sin información',
    },
    {
      label: 'Tipo de cuenta beneficiario',
      value: item.value?.beneficiary_account_type?.trim() || 'Sin información',
    },
  ])

  return {
    expenseFields,
  }
}

export default useExpenseAuthorizationDetails

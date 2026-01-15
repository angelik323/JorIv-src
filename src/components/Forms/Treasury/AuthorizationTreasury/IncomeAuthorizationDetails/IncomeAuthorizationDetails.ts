import {
  IAuthorizationIncomeDetail,
  IAuthorizationTreasuryDetail,
} from '@/interfaces/customs/treasury/AuthorizationTreasury'
import { computed } from 'vue'

const useIncomeAuthorizationDetails = (props: {
  response: IAuthorizationTreasuryDetail
}) => {
  const detail = computed<IAuthorizationIncomeDetail>(
    () => props.response.income_details?.[0] ?? {}
  )

  const incomeFields = computed(() => [
    {
      label: 'Negocio',
      value: props.response.business?.name?.trim()
        ? `${props.response.business?.code} - ${props.response.business?.name}`
        : 'Sin información',
    },
    {
      label: 'Tipo de recaudo',
      value: detail.value?.type_receive?.description?.trim()
        ? `${detail.value?.type_receive?.code} - ${detail.value?.type_receive?.description}`
        : 'Sin información',
    },
    {
      label: 'Banco',
      value: detail.value?.bank?.name?.trim()
        ? `${detail.value?.bank?.code} - ${detail.value?.bank?.name}`
        : 'Sin información',
    },
    {
      label: 'Flujo de caja',
      value:
        detail.value?.cash_flow?.name?.trim() &&
        detail.value?.cash_flow?.code?.trim()
          ? `${detail.value?.cash_flow?.code} - ${detail.value?.cash_flow?.name}`
          : 'Sin información',
    },
    {
      label: 'Centro de costo',
      value: detail.value?.cost_center?.name?.trim() || 'Sin información',
    },
    {
      label: 'Tercero',
      value: detail.value?.third_party?.name?.trim()
        ? `${detail.value?.third_party?.document} - ${detail.value?.third_party?.name}`
        : 'Sin información',
    },
  ])

  return {
    incomeFields,
  }
}

export default useIncomeAuthorizationDetails

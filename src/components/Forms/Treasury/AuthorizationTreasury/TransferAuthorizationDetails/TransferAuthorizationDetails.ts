import { computed } from 'vue'

import { IAuthorizationTreasuryDetail } from '@/interfaces/customs/treasury/AuthorizationTreasury'

const useTransferAuthorizationDetails = (props: {
  response: IAuthorizationTreasuryDetail
}) => {
  const origin = computed(() => props.response.origin_detail)
  const destination = computed(() => props.response.destination_detail)

  const originFields = computed(() => [
    {
      label: 'Negocio',
      value: origin.value?.business_trust_id && origin.value?.business_trust_name ? `${origin.value?.business_trust_id ?? ''} - ${origin.value?.business_trust_name ?? ''}` : 'Sin información',
    },
    {
      label: 'Fondo',
      value: origin.value?.fund ? `${origin.value?.found_id ?? ''}` : 'Sin información',
    },
    {
      label: 'Movimiento',
      value: origin.value?.movement?.code && origin.value?.movement?.description ? `${origin.value?.movement?.code ?? ''} - ${origin.value?.movement?.description ?? ''}` : 'Sin información',
    },
    {
      label: 'Banco',
      value: origin.value?.bank?.code && origin.value?.bank?.name ? `${origin.value?.bank?.code ?? ''} - ${origin.value?.bank?.name ?? ''}` : 'Sin información',
    },
    {
      label: 'Centro de costos',
      value: origin.value?.cost_center?.id && origin.value?.cost_center?.name ? `${origin.value?.cost_center?.id ?? ''} - ${origin.value?.cost_center?.name ?? ''}` : 'Sin información',
    },
    {
      label: 'Flujo de caja',
      value: origin.value?.cash_flow?.id && origin.value?.cash_flow?.name ? `${origin.value?.cash_flow?.id ?? ''} - ${origin.value?.cash_flow?.name ?? ''}` : 'Sin información',
    },
  ])

  const destinationFields = computed(() => [
    {
      label: 'Negocio',
      value: destination.value?.business_trust_id && destination.value?.business_trust_name ? `${destination.value?.business_trust_id ?? ''} - ${destination.value?.business_trust_name ?? ''}` : 'Sin información',
    },
    {
      label: 'Fondo',
      value: destination.value?.fund ? `${destination.value?.found_id ?? ''}` : 'Sin información',
    },
    {
      label: 'Movimiento',
      value: destination.value?.movement?.code && destination.value?.movement?.description ? `${destination.value?.movement?.code ?? ''} - ${destination.value?.movement?.description ?? ''}` : 'Sin información',
    },
    {
      label: 'Banco',
      value: destination.value?.bank?.code && destination.value?.bank?.name ? `${destination.value?.bank?.code ?? ''} - ${destination.value?.bank?.name ?? ''}` : 'Sin información',
    },
    {
      label: 'Centro de costos',
      value: destination.value?.cost_center?.id && destination.value?.cost_center?.name ? `${destination.value?.cost_center?.id ?? ''} - ${destination.value?.cost_center?.name ?? ''}` : 'Sin información',
    },
    {
      label: 'Flujo de caja',
      value: destination.value?.cash_flow?.id && destination.value?.cash_flow?.name ? `${destination.value?.cash_flow?.id ?? ''} - ${destination.value?.cash_flow?.name ?? ''}` : 'Sin información',
    },
  ])

  return {
    originFields,
    destinationFields,
  }
}

export default useTransferAuthorizationDetails

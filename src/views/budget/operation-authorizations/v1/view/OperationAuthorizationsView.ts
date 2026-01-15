// vue - router - Pinia
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

// composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useOperationAuthorizationsStore } from '@/stores/budget/operation-authorizations'

// Tipos
import type {
  IOperationAuthorizationResponse,
  IOperationAuthorizationFormEdit,
  ITransferRowBackend,
} from '@/interfaces/customs/budget/OperationAuthorizations'
import { ITabs } from '@/interfaces/customs/Tab'

const useOperationAuthorizationsView = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { _getOperationByIdAndType } = useOperationAuthorizationsStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const operationId = Number(route.params.id)
  const operationType = String(route.query.operation_type || '')

  const headerProps = {
    title: 'Ver registro de operaciones',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Autorización de operaciones',
        route: 'OperationAuthorizationsList',
      },
      { label: 'Ver', route: 'OperationAuthorizationsView' },
      { label: operationId.toString() },
      { label: operationType === 'transfer' ? 'Traslado' : 'Operación' },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // Estado local en formato de formularios
  const operationRows = ref<IOperationAuthorizationFormEdit[]>([])
  const transferData = ref<
    | {
        originRows: IOperationAuthorizationFormEdit[]
        destinationRows: IOperationAuthorizationFormEdit[]
      }
    | undefined
  >(undefined)

  // Computed para detectar si es un traslado
  const isTransfer = computed(
    () => operationType === 'transfer' || transferData.value !== undefined
  )

  // Computed para detectar si es traslado 1a1
  const isOneToOneTransfer = computed(() => {
    if (!isTransfer.value || !transferData.value) return false

    const originCount = transferData.value.originRows?.length || 0
    const destinationCount = transferData.value.destinationRows?.length || 0

    // Es 1a1 si tiene exactamente 1 de origen y 1 de destino
    return originCount === 1 && destinationCount === 1
  })

  // Claves de recursos necesarios para los selectores
  const BudgetKeys: string[] = [
    'code_movements',
    'areas_resposabilities_codes',
    'budget_item_codes',
    'budget_resource_codes',
    'business_trusts',
    'third_parties',
  ]
  const mapOperationResponse = (
    response: IOperationAuthorizationResponse | null
  ): IOperationAuthorizationFormEdit[] => {
    if (!response?.operation) return []

    const op = response.operation
    return op.operation_log_details.map((d) => {
      const area = d.areas_responsibility
      const move = d.code_movement
      const item = d.budget_item
      const resource = d.budget_resource

      return {
        id: d.id,
        validity: d.year ?? null,
        month: d.month ?? null,
        day: d.day == null ? null : String(d.day),
        area_id: area?.id ?? null,
        movement_code_id: move?.id ?? '',
        budget_item_id: item?.id ?? '',
        resource_id: resource?.id ?? '',
        value: d.value ?? null,
        adjusted_value: d.adjusted_value ?? null,
      }
    })
  }

  const mapTransferResponse = (
    response: IOperationAuthorizationResponse | null
  ): {
    originRows: IOperationAuthorizationFormEdit[]
    destinationRows: IOperationAuthorizationFormEdit[]
  } | null => {
    if (!response?.transfer) return null
    const transfer = response.transfer
    const mapRow = (
      r: ITransferRowBackend
    ): IOperationAuthorizationFormEdit => ({
      id: r.id,
      type: r.type ?? null,
      month: r.month ?? null,
      value: r.amount == null ? null : String(r.amount),
      area_id: r.responsibility_area?.id ?? null,
      area_description: r.responsibility_area?.description ?? null,
      budget_item_id: r.budget_item?.id ?? null,
      budget_item_description: r.budget_item?.description ?? null,
      resource_id: r.budget_resource?.id ?? null,
      resource_description: r.budget_resource?.description ?? null,
      third_party_id: r.third_party?.id ?? null,
      third_party_description: r.third_party
        ? r.third_party.legal_person?.business_name ||
          r.third_party.natural_person?.full_name ||
          r.third_party.name ||
          ''
        : null,
      business_trust_id: r.business_trust?.id ?? null,
      business_trust_id_description: r.business_trust?.name ?? null,
    })
    return {
      originRows: transfer.origin.map(mapRow),
      destinationRows: transfer.destination.map(mapRow),
    }
  }

  // Watch para asegurar que operationRows se reflejen en cualquier componente que los use
  watch(
    () => operationRows.value,
    () => {
      // Este watch ayuda a que Vue detecte los cambios reactivamente
    },
    { deep: true }
  )

  onMounted(async () => {
    if (BudgetKeys.length > 0) {
      openMainLoader(true)
      await _getResources({ budget: BudgetKeys })
      openMainLoader(false)
    }

    // Cargar la operación (show) usando tipo
    const response = await _getOperationByIdAndType(
      operationId.toString(),
      operationType
    )
    if (!response) return

    if (response.operation) {
      operationRows.value = mapOperationResponse(response)
    } else if (response.transfer) {
      const mapped = mapTransferResponse(response)
      if (mapped) transferData.value = mapped
    }
  })

  onBeforeUnmount(() => {
    if (BudgetKeys.length > 0) {
      _resetKeys({ budget: BudgetKeys })
    }
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    operationRows,
    transferData,
    isTransfer,
    isOneToOneTransfer,
    goToURL,
  }
}

export default useOperationAuthorizationsView

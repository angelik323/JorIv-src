// vue - router - pinia
import { onMounted, ref, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
// Interfaces
import type {
  IOperationAuthorizationResponse,
  IOperationAuthorizationFormEdit,
  ITransferRowBackend,
  ITransferFormData,
  IOperationUpdateDetail,
  ITransferUpdateDetail,
} from '@/interfaces/customs/budget/OperationAuthorizations'

// composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Stores
import { useOperationAuthorizationsStore } from '@/stores/budget/operation-authorizations'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { ITabs } from '@/interfaces/customs/Tab'

const useOperationAuthorizationsEdit = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { _getOperationByIdAndType, _clearData, _updateAction } =
    useOperationAuthorizationsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  // Estado local para las filas mapeadas
  const operationRows = ref<IOperationAuthorizationFormEdit[]>([])
  const transferData = ref<ITransferFormData | undefined>(undefined)

  const operationId = Number(route.params.id)
  const operationType = String(route.query.operation_type)

  const headerProps = {
    title: 'Editar registro de operaciones',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Autorización de operaciones',
        route: 'OperationAuthorizationsList',
      },
      { label: 'Editar', route: 'OperationAuthorizationsEdit' },
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

  // Ref del formulario
  const formInformationRef = ref()

  // Computed para detectar si es un traslado
  const isTransfer = computed(
    () => operationType === 'transfer' || transferData.value !== undefined
  )

  // Computed para detectar si es traslado 1a1
  const is1to1Transfer = computed(() => {
    if (!isTransfer.value || !transferData.value) return false

    const originCount = transferData.value.originRows?.length || 0
    const destinationCount = transferData.value.destinationRows?.length || 0

    // Es 1a1 si tiene exactamente 1 de origen y 1 de destino
    return originCount === 1 && destinationCount === 1
  })

  // Actualizar operación
  const onSubmit = async () => {
    const formData = formInformationRef.value?.getFormData()
    const hasData = Array.isArray(formData) ? formData.length > 0 : false

    // Solo validar si hay datos en el formulario
    if (hasData && !(await formInformationRef.value?.validateForm?.())) {
      return
    }

    openMainLoader(true)

    let success = false
    if (!isTransfer.value) {
      // Mapear filas a payload "details" requerido por API de operación
      const details = (formData as IOperationAuthorizationFormEdit[]).map(
        (r) => {
          const base = {
            year: String(r.validity),
            month: String(r.month),
            day:
              Number(r.day) < 10 && String(r.day).length === 1
                ? '0' + r.day
                : r.day,
            areas_responsibility_id: (r.area_id as number) ?? null,
            code_movements_source_destination_id:
              (r.movement_code_id as number) ?? null,
            budget_item_id: (r.budget_item_id as number) ?? null,
            budget_resource_id: (r.resource_id as number) ?? null,
            value: String(r.value),
            adjusted_value: r.adjusted_value != null ? r.adjusted_value : null,
          }
          // Se incluye para agregar un registro nuevo
          if (r.id != null) {
            return { ...base, id: r.id }
          }
          return base
        }
      )

      success = await _updateAction({
        type: 'operation',
        id: operationId,
        details: details as IOperationUpdateDetail[],
      })
    } else {
      // Traslado: construir payload origin/destination
      const { originRows = [], destinationRows = [] } = (formData || {}) as {
        originRows: IOperationAuthorizationFormEdit[]
        destinationRows: IOperationAuthorizationFormEdit[]
      }

      const mapTransferRow = (r: IOperationAuthorizationFormEdit) => {
        const base = {
          type: r.type ?? null,
          month: Number(r.month),
          responsibility_area_id: (r.area_id as number) ?? null,
          budget_item_id: (r.budget_item_id as number) ?? null,
          budget_resource_id: (r.resource_id as number) ?? null,
          third_party_id: (r.third_party_id as number) ?? null,
          business_trust_id: (r.business_trust_id as number) ?? null,
          amount: r.value,
        }
        // Incluir id solo si existe
        if (r.id != null) {
          return { ...base, id: r.id }
        }
        return base
      }

      success = await _updateAction({
        type: 'transfer',
        id: operationId,
        details: [
          ...originRows.map(mapTransferRow),
          ...destinationRows.map(mapTransferRow),
        ] as ITransferUpdateDetail[],
      })
    }

    openMainLoader(false)

    if (success) {
      goToURL('OperationAuthorizationsList')
    }
  }

  // Mapear respuesta del backend a IOperationAuthorizationFormEdit[] para operaciones estándar
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
        day: String(d.day) ?? null,
        area_id: area?.id ?? null,
        movement_code_id: move?.id ?? '',
        budget_item_id: item?.id ?? '',
        resource_id: resource?.id ?? '',
        value: d.value ?? null,
        adjusted_value: d.adjusted_value ?? null,
      }
    })
  }

  // Mapear respuesta del backend para traslados
  const mapTransferResponse = (
    response: IOperationAuthorizationResponse | null
  ): {
    originRows: IOperationAuthorizationFormEdit[]
    destinationRows: IOperationAuthorizationFormEdit[]
  } | null => {
    if (!response?.transfer) return null

    const transfer = response.transfer
    const mapTransferRow = (
      r: ITransferRowBackend
    ): IOperationAuthorizationFormEdit => ({
      id: r.id,
      type: r.type ?? null,
      month: r.month ?? null,
      value: r.amount != null ? String(r.amount) : null,
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
      originRows: transfer.origin.map(mapTransferRow),
      destinationRows: transfer.destination.map(mapTransferRow),
    }
  }

  const BudgetKeys: string[] = [
    'code_movements',
    'areas_resposabilities_codes',
    'budget_item_codes',
    'budget_resource_codes',
    'business_trusts',
    'third_parties',
  ]

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources({ budget: BudgetKeys })
    openMainLoader(false)

    // Cargar la operación y mapear según el tipo
    const response = await _getOperationByIdAndType(
      operationId.toString(),
      operationType ?? ''
    )
    if (!response) return
    // Mapear respuesta según el tipo
    if (response.operation) {
      // Operación estándar: mapear a IOperationAuthorizationFormEdit[]
      operationRows.value = mapOperationResponse(response)
    } else if (response.transfer) {
      // Traslado: mapear a originRows y destinationRows
      const mapped = mapTransferResponse(response)
      if (mapped) {
        transferData.value = mapped
      }
    }
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    operationRows,
    transferData,
    formInformationRef,
    isTransfer,
    is1to1Transfer,
    onSubmit,
    goToURL,
  }
}

export default useOperationAuthorizationsEdit

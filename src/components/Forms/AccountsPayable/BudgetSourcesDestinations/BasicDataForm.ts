// core
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// interfaces
import { IBudgetSourcesDestinationsForm } from '@/interfaces/customs/accounts-payable/BudgetSourcesDestinations'
import { ActionType } from '@/interfaces/global'
import { ISelectorResources, ResourceTypes } from '@/interfaces/customs'

// constants
import { DESTINATION_OPTIONS } from '@/constants/resources/accounts-payable'

// stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useResourceManagerStore } from '@/stores/resources-manager'

type SectionType = 'source' | 'destination'

const useBasicDataForm = (
  props: { data?: IBudgetSourcesDestinationsForm | null; action: ActionType },
  emit: Function
) => {
  // hooks
  const { _getResources } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()

  // stores
  const {
    sources_destinations_code_movements,
    sources_destinations_processes,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  // refs
  const basicDataFormRef = ref()

  const models = ref<IBudgetSourcesDestinationsForm>({
    source_module: null,
    source_process: null,
    source_reference_id: null,
    source_description: '',
    destination_module: null,
    destination_process: null,
    destination_reference_id: null,
    destination_description: '',
  })

  const cache = ref({
    processes: {} as Record<string, ISelectorResources[]>,
    movements: {
      source: {} as Record<string, ISelectorResources[]>,
      destination: {} as Record<string, ISelectorResources[]>,
    },
  })

  const processes = {
    source: ref<ISelectorResources[]>([]),
    destination: ref<ISelectorResources[]>([]),
  }

  const movements = {
    source: ref<ISelectorResources[]>([]),
    destination: ref<ISelectorResources[]>([]),
  }

  // computed
  const processes_origins = computed(() => processes.source.value)
  const processes_destinations = computed(() => processes.destination.value)

  const formatMovementLabel = (m: ISelectorResources): string => {
    if (m.label) return m.label
    if (m.name) return m.name
    if (m.code && m.description) {
      return `${m.code} - ${m.description}`
    }
    return m.code || m.description || ''
  }

  const movements_origins = computed(() => {
    const selectedId = getMovementReferenceId(models.value.source_reference_id)
    return movements.source.value.map((m) => ({
      ...m,
      label:
        selectedId && (m.id === selectedId || m.value === selectedId)
          ? getMovementCode(m)
          : formatMovementLabel(m),
    }))
  })

  const movements_destinations = computed(() => {
    const selectedId = getMovementReferenceId(
      models.value.destination_reference_id
    )
    return movements.destination.value.map((m) => ({
      ...m,
      label:
        selectedId && (m.id === selectedId || m.value === selectedId)
          ? getMovementCode(m)
          : formatMovementLabel(m),
    }))
  })

  // methods
  const getMovementReferenceId = (val: unknown): number | null => {
    if (typeof val === 'number') return val
    if (val && typeof val === 'object') {
      const v = val as { id?: number; value?: number }
      return v.id ?? v.value ?? null
    }
    return null
  }

  const getMovementCode = (movement: ISelectorResources): string => {
    if (movement.code) return movement.code

    const textToParse = movement.name || movement.label || ''
    if (textToParse.includes(' - ')) {
      return textToParse.split(' - ')[0]?.trim() || ''
    }

    return textToParse
  }

  const getMovementDescription = (movement: ISelectorResources): string => {
    if (movement.description) return movement.description

    if (movement.name?.includes(' - ')) {
      return movement.name.split(' - ').slice(1).join(' - ')
    }

    return movement.name || ''
  }

  const getMovementById = (
    movementsList: ISelectorResources[],
    id: number
  ): ISelectorResources | undefined => {
    return movementsList.find((m) => m.id === id || m.value === id)
  }

  const handleSectionFieldsUpdate = (type: SectionType) => {
    const refIdKey =
      type === 'source' ? 'source_reference_id' : 'destination_reference_id'
    const descriptionKey =
      type === 'source' ? 'source_description' : 'destination_description'

    const refId = models.value[refIdKey]
    const movementId = getMovementReferenceId(refId)

    if (!movementId) {
      models.value[descriptionKey] = ''
      return
    }

    const movement = getMovementById(movements[type].value, movementId)

    if (movement) {
      models.value[descriptionKey] = getMovementDescription(movement)
    } else {
      models.value[descriptionKey] = ''
    }
  }

  const loadResources = async (keys: ResourceTypes, query: string) => {
    openMainLoader(true)
    await _getResources(keys, query)
    openMainLoader(false)
  }

  const loadProcessesAndMovements = async (
    moduleKey: string,
    type: SectionType
  ) => {
    if (!moduleKey) {
      processes[type].value = []
      movements[type].value = []
      return
    }

    if (!cache.value.processes[moduleKey]) {
      await loadResources(
        { accounts_payable: ['sources_destinations_processes'] },
        `filter[module]=${moduleKey}`
      )
      cache.value.processes[moduleKey] = sources_destinations_processes.value
    }
    processes[type].value = cache.value.processes[moduleKey]

    if (!cache.value.movements[type][moduleKey]) {
      await loadResources(
        { accounts_payable: ['sources_destinations_code_movements'] },
        `filter[module]=${moduleKey}&filter[type]=${type}`
      )
      cache.value.movements[type][moduleKey] =
        sources_destinations_code_movements.value
    }
    movements[type].value = cache.value.movements[type][moduleKey]
  }

  const handleSectionFieldsReset = (type: SectionType) => {
    if (type === 'source') {
      models.value.source_process = null
      models.value.source_reference_id = null
      models.value.source_description = ''
    } else {
      models.value.destination_process = null
      models.value.destination_reference_id = null
      models.value.destination_description = ''
    }
  }

  // watchers
  watch(
    () => models.value.source_module,
    async (moduleKey) => {
      handleSectionFieldsReset('source')
      if (moduleKey) {
        await loadProcessesAndMovements(moduleKey, 'source')
      }
    }
  )

  watch(
    () => models.value.destination_module,
    async (moduleKey) => {
      handleSectionFieldsReset('destination')
      if (moduleKey) {
        await loadProcessesAndMovements(moduleKey, 'destination')
      }
    }
  )

  watch(
    () => models.value.source_reference_id,
    () => {
      handleSectionFieldsUpdate('source')
    }
  )

  watch(
    () => models.value.destination_reference_id,
    () => {
      handleSectionFieldsUpdate('destination')
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        models.value = { ...val }
        handleSectionFieldsUpdate('source')
        handleSectionFieldsUpdate('destination')
      }
    },
    { immediate: true }
  )

  watch(
    [() => movements.source.value, () => movements.destination.value],
    () => {
      handleSectionFieldsUpdate('source')
      handleSectionFieldsUpdate('destination')
    },
    { deep: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', val)
    },
    { deep: true }
  )

  return {
    basicDataFormRef,
    models,
    DESTINATION_OPTIONS,
    processes_origins,
    processes_destinations,
    movements_origins,
    movements_destinations,
  }
}

export default useBasicDataForm

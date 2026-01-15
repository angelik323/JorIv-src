// vue - router - quasar - pinia
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces & types
import { IBaseTableProps } from '@/interfaces/global'
import type { IFieldFilters } from '@/interfaces/customs/Filters'
import type {
  IBusinessForClosure,
  IClosureVigencyCreatePayload,
} from '@/interfaces/customs/budget/ClosureVigency'
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'
// Composable
import { useMainLoader, useRules } from '@/composables'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useAlert } from '@/composables/useAlert'
// Stores
import {
  useBudgetResourceStore,
  useResourceManagerStore,
} from '@/stores/resources-manager'
import { useClosureVigencyStoreV1 } from '@/stores/budget/closure-vigency/closure-vigency-v1'

export const useClosureVigencyCreate = () => {
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    business_trusts,
    budget_document_types,
    budget_document_number_business_range,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const BudgetKeys = ['budget_document_types']
  onMounted(async () => {
    openMainLoader(true)
    await _getResources({ budget: BudgetKeys })
    openMainLoader(false)
    // business_trusts se cargará cuando se seleccione una vigencia
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })

  const {
    _listBusinessTrustInRangeAction,
    _executeClosureAction,
    _clearBusinessesForClosure,
  } = useClosureVigencyStoreV1()

  const { businesses_for_closure } = storeToRefs(useClosureVigencyStoreV1())

  const headerProps = {
    title: 'Crear cierre o deshacer cierre de vigencia',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Cierre de vigencia', route: 'BudgetValidityClosureList' },
      { label: 'Crear', route: 'BudgetValidityClosureCreate' },
    ],
  }

  // Control de checkbox "Seleccionar todos"
  const selectAll = ref(false)

  // Indica si ya se realizó una búsqueda
  const searchPerformed = ref(false)

  // Opciones para Tipo de acción
  const actionTypeOptions = [
    { label: 'Crear cierre', value: 'close' },
    { label: 'Deshacer cierre', value: 'undo' },
  ]

  // Opciones para Cerrar por
  const closeByOptions = [
    { label: 'Documento', value: 'document' },
    { label: 'Negocio', value: 'business' },
  ] as const

  const filterRef = ref<InstanceType<typeof FiltersComponentV2> | null>(null)

  const toggleHideDocumentRelatedFields = (fields: string[], hide: boolean) => {
    if (hide === true) {
      filterRef.value?.cleanFiltersByNames(fields)
    }

    const documentFields = filterConfig.value.filter((f) =>
      fields.includes(f.name)
    )

    documentFields.forEach((f) => {
      f.hide = hide
    })
  }

  // Configuración de filtros usando IFieldFilters
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'process_type',
      label: 'Tipo de proceso',
      type: 'q-option-group',
      value: null,
      class: 'col-12 col-md-12',
      options: actionTypeOptions,
      disable: false,
      clean_value: true,
    },
    {
      name: 'close_by',
      label: 'Cerrar por',
      type: 'q-option-group',
      value: null,
      class: 'col-12 col-md-12',
      options: closeByOptions,
      disable: false,
      clean_value: true,
      onChange: (value: (typeof closeByOptions)[number]['value'] | null) => {
        const documentRelatedFields = ['document_type_id', 'document_number']
        if (value !== 'document') {
          toggleHideDocumentRelatedFields(documentRelatedFields, true)
          return
        }
        toggleHideDocumentRelatedFields(documentRelatedFields, false)
      },
    },
    {
      name: 'vigency',
      label: 'Vigencia *',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA',
      mask: 'YYYY',
      navigation_min_year: '2000/01',
      rules: [
        (val: string) => useRules().date_not_before_year_2000(val, 'YYYY'),
      ],
    },
    {
      name: 'business_trust_from_id',
      label: 'Negocio desde *',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: business_trusts,
      placeholder: 'Seleccione negocio',
      disable: false,
      clean_value: true,
      autocomplete: true,
      /*rules: [(val: string | number | null) => validateBusinessFrom(val)],*/
    },
    {
      name: 'business_trust_to_id',
      label: 'Negocio hasta *',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: business_trusts,
      placeholder: 'Seleccione negocio',
      disable: false,
      clean_value: true,
      autocomplete: true,
      /*rules: [(val: string | number | null) => validateBusinessTo(val)],*/
    },
    {
      name: 'document_type_id',
      label: 'Tipo de documento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: budget_document_types,
      placeholder: 'Seleccione tipo de documento',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
    {
      name: 'document_number',
      label: 'Número de documento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: budget_document_number_business_range,
      placeholder: 'Seleccione número de documento',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
  ])

  // TableProps para el listado de negocios (antes de ejecutar)
  const tablePropsBusinesses = ref<IBaseTableProps<IBusinessForClosure>>({
    title: 'Listado de negocios',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'select',
        required: true,
        label: '',
        field: 'selected',
        align: 'center',
        sortable: false,
      },
      {
        name: 'id',
        required: true,
        label: '#',
        field: 'id',
        align: 'center',
        sortable: false,
      },
      {
        name: 'business',
        required: true,
        label: 'Código/Negocio',
        field: (row: IBusinessForClosure) =>
          row.code && row.name ? `${row.code} - ${row.name}` : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'closure_type',
        label: 'Tipo de cierre',
        field: 'closure_type',
        align: 'center',
        sortable: true,
      },
      {
        name: 'document_type',
        label: 'Tipo de documento',
        field: (row: IBusinessForClosure) =>
          row.document_type_code && row.document_type_name
            ? `${row.document_type_code} - ${row.document_type_name}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'document_number',
        label: 'Número de documento',
        field: 'document_number',
        align: 'left',
        sortable: true,
      },
      {
        name: 'last_closed_vigency',
        label: 'Última vigencia cerrada',
        field: 'last_closed_vigency',
        align: 'center',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  // Filtros formateados
  const filtersFormat = ref<Record<string, string | number>>({})

  // Type alias para valores de filtro nullable
  type FilterValue = string | number | null

  // Variables para trackear valores previos
  let lastVigency: FilterValue = null
  let lastBusinessFromId: FilterValue = null
  let lastBusinessToId: FilterValue = null

  const filtersUpdate = async (values: Record<string, string | number>) => {
    const newVigency = values['filter[vigency]'] ?? null
    const newBusinessFromId = values['filter[business_trust_from_id]'] ?? null
    const newBusinessToId = values['filter[business_trust_to_id]'] ?? null

    // Si cambió la vigencia, actualizar negocios
    if (newVigency && newVigency !== lastVigency) {
      openMainLoader(true)
      await _getResources(
        { budget: ['business_trusts'] },
        `has_budget=true&vigency=${newVigency}`
      )
      openMainLoader(false)
      // Limpiar negocios seleccionados cuando cambia la vigencia
      filterConfig.value.forEach((field) => {
        if (
          ['business_trust_from_id', 'business_trust_to_id'].includes(
            field.name
          )
        ) {
          field.value = null
        }
      })
      // Limpiar también los valores del objeto
      delete values['filter[business_trust_from_id]']
      delete values['filter[business_trust_to_id]']
      lastBusinessFromId = null
      lastBusinessToId = null
    }
    lastVigency = newVigency

    // Si cambiaron los negocios y ambos están seleccionados, actualizar números de documento
    if (
      newBusinessFromId &&
      newBusinessToId &&
      (newBusinessFromId !== lastBusinessFromId ||
        newBusinessToId !== lastBusinessToId)
    ) {
      openMainLoader(true)
      await _getResources(
        { budget: ['budget_document_number_business_range'] },
        `filter[business_trust_from_id]=${newBusinessFromId}&filter[business_trust_to_id]=${newBusinessToId}`
      )
      openMainLoader(false)
    }
    lastBusinessFromId = newBusinessFromId
    lastBusinessToId = newBusinessToId

    filtersFormat.value = { ...values }
  }

  // Watch para actualizar la habilitación del campo de número de documento
  watch(
    () => filtersFormat.value.close_by,
    (newValue) => {
      filterConfig.value.forEach((field) => {
        if (field.name === 'document_number_id') {
          field.hide = newValue !== 'document'
        }
      })
    },
    { immediate: true }
  )

  // Watch para sincronizar los datos del store con la tabla
  watch(
    () => businesses_for_closure.value,
    (newBusinesses) => {
      tablePropsBusinesses.value.rows = newBusinesses
    },
    { deep: true, immediate: true }
  )

  // Buscar negocios
  const handleFilter = async (filters: Record<string, string | number>) => {
    // Validar que se haya seleccionado el tipo de proceso
    const processType = filters['filter[process_type]'] ?? filtersFormat.value.process_type
    
    if (!processType) {
      showAlert(
        'Debe seleccionar el tipo de proceso antes de buscar',
        'warning',
        undefined,
        5000
      )
      return
    }

    // Validar que se haya seleccionado cerrar por
    const closeBy = filters['filter[close_by]'] ?? filtersFormat.value.close_by
    
    if (!closeBy) {
      showAlert(
        'Debe seleccionar "Cerrar por" antes de buscar',
        'warning',
        undefined,
        5000
      )
      return
    }

    openMainLoader(true)
    tablePropsBusinesses.value.loading = true

    const searchFilters: Record<string, string | number> = {
      ...filters,
    }

    const success = await _listBusinessTrustInRangeAction(searchFilters)

    if (success) {
      searchPerformed.value = true
      selectAll.value = false
    }

    tablePropsBusinesses.value.loading = false
    openMainLoader(false)
  }

  // Limpiar formulario
  const handleClearFilters = () => {
    _clearBusinessesForClosure()
    searchPerformed.value = false
    selectAll.value = false
    filtersFormat.value = {}

    // Resetear valores de filtros
    filterConfig.value.forEach((filter) => {
      if (filter.clean_value) {
        filter.value = null
      } else {
        // Mantener valores por defecto para action_type y close_by
        if (filter.name === 'action_type') filter.value = 'close'
        if (filter.name === 'close_by') filter.value = 'business'
      }
    })
  }

  // Seleccionar/Deseleccionar todos
  const handleSelectAll = (value: boolean) => {
    businesses_for_closure.value.forEach((business) => {
      business.selected = value
    })
  }

  // Watch para el checkbox de seleccionar todos
  watch(selectAll, (newValue) => {
    handleSelectAll(newValue)
  })

  // Computed para saber si hay al menos un negocio seleccionado
  const hasSelectedBusinesses = computed(() => {
    return businesses_for_closure.value.some((b) => b.selected)
  })

  // Ejecutar cierre/deshacer cierre
  const handleExecute = async () => {
    const selectedBusinesses = businesses_for_closure.value.filter(
      (b) => b.selected
    )

    if (selectedBusinesses.length === 0) {
      showAlert(
        'Debe seleccionar al menos un negocio para ejecutar el proceso',
        'warning',
        undefined,
        5000
      )
      return
    }

    openMainLoader(true)

    const actionType =
      (filtersFormat.value.process_type as 'close' | 'undo') || 'close'

    const payload: IClosureVigencyCreatePayload = {
      action_type: actionType,
      close_by:
        (filtersFormat.value.close_by as 'document' | 'business') || 'business',
      vigency: filtersFormat.value.vigency as number,
      business_trusts: selectedBusinesses.map((b) => b.id!),
    }

    const result = await _executeClosureAction(payload)

    openMainLoader(false)

    if (result) {
      // Limpiar datos
      _clearBusinessesForClosure()
      searchPerformed.value = false
      selectAll.value = false

      // Determinar el tipo de proceso para el mensaje
      const processTypeName =
        actionType === 'close'
          ? 'Cierre de vigencias'
          : 'Deshacer cierre de vigencias'

      // Mostrar mensaje según HU0016
      showAlert(
        `Se ha iniciado el proceso de "${processTypeName}" número ${payload.business_trusts}. Una vez finalizado el proceso, le será informado mediante el sistema de notificaciones de la plataforma.`,
        'success',
        undefined,
        8000
      )

      // Redirigir al listado de procesos
      goToURL('BudgetValidityClosureList')
    }
  }

  // Volver al listado
  const handleBack = () => {
    _clearBusinessesForClosure()
    goToURL('BudgetValidityClosureList')
  }

  return {
    headerProps,
    tablePropsBusinesses,
    filterRef,
    filterConfig,
    selectAll,
    searchPerformed,
    hasSelectedBusinesses,
    filtersUpdate,
    handleFilter,
    handleClearFilters,
    handleSelectAll,
    handleExecute,
    handleBack,
  }
}

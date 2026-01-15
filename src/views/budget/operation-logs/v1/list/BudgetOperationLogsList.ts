// Vue - Pinia
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Assets
import deleteIcon from '@/assets/images/icons/alert_popup_delete.svg'
import confirmIcon from '@/assets/images/icons/alert_popup.svg'

// Interfaces
import { IOperationLogList } from '@/interfaces/customs/budget/OperationLogs'
import { IGenericResource } from '@/interfaces/customs/resources/Common'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'

// Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useBudgetOperationLogsStore } from '@/stores/budget/operation-logs'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useBudgetOperationLogsList = () => {
  const {
    max_integer_decimal,
    is_required,
    only_number,
    max_length,
    min_length,
  } = useRules()
  const { defaultIconsLucide, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()

  const {
    movement_codes_source_destination: code_movements,
    budget_item_codes_source_destination: budget,
    areas_resposabilities_codes: areas,
    areas_responsabilities_applicant,
    budget_resource_codes: resources,
    cities_required_document_type,
    operation_logs_authorized,
    budget_document_types,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const { accounting_third_parties_with_document, business_trusts_selector } =
    storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useBudgetOperationLogsStore('v1')

  const filtersFormat = ref<Record<string, string | number | boolean>>({})
  const filtersLocked = ref(false)
  const isTableEmpty = ref(false)
  const hasTableData = ref(true)
  const alertModalRef = ref()
  const filtersRef = ref()

  let lastBudgetDocumentTypeId: string | number | boolean | null = null
  let lastBusinessTrustId: string | number | boolean | null = null

  const alertModalConfig = ref({
    title: '' as string,
    id: null as number | null,
    img: '' as string,
    action: '' as string,
  })

  const styleColumns = 'min-width: 200px; max-width: 200px'

  const customColumns = [
    'code_movements_source_destination_id',
    'areas_responsibility_id',
    'budget_resource_id',
    'budget_item_id',
    'actions',
    'month',
    'value',
    'year',
    'day',
    'id',
  ]

  const keys = {
    budget: [
      'areas_resposabilities_codes',
      'operation_logs_authorized',
      'budget_document_types',
      'budget_resource_codes',
      'budget_item_codes',
      'code_movements',
    ],
    accounting: ['accounting_third_parties_with_document'],
  }

  const keysClean = {
    accounting: [
      'accounting_third_parties_with_document',
      'business_trusts_selector',
    ],
    budget: [
      'areas_resposabilities_codes',
      'operation_logs_authorized',
      'budget_document_types',
      'budget_resource_codes',
      'budget_item_codes',
      'code_movements',
    ],
  }

  const headerProps = {
    title: 'Registro de operaciones',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
      },
      {
        label: 'Registro operaciones',
        route: 'BudgetOperationLogsList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts_selector,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val, 'El negocio es requerido')],
    },
    {
      name: 'business_trust_description',
      label: 'Descripción negocio',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      readonly: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'document_year',
      label: 'Vigencia documento*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) => is_required(val, 'La vigencia es requerida'),
        (val: string) => max_length(val, 4),
        (val: string) => min_length(val, 4),
        (val: string) => only_number(val),
      ],
    },
    {
      name: 'date',
      label: 'Fecha*',
      type: 'q-date',
      value: formatDate(new Date().toISOString(), 'YYYY-MM-DD'),
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [(val: string) => is_required(val, 'La fecha es requerida')],
    },
    {
      name: 'budget_document_type_id',
      label: 'Tipo de documento*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: budget_document_types,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val, 'El documento es requerido')],
    },
    {
      name: 'budget_document_type_description',
      label: 'Descripción documento',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      readonly: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'areas_resposability_id',
      label: 'Área solicitante*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: areas_responsabilities_applicant,
      display_value: 'id',
      disable: true,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val, 'La área es requerida')],
    },
    {
      name: 'areas_resposability_description',
      label: 'Descripción área',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      readonly: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'city_id',
      label: 'Ciudad',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: cities_required_document_type,
      disable: true,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'city_description',
      label: 'Descripción ciudad',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      readonly: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'third_party_beneficiary_id',
      label: 'Beneficiario*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: accounting_third_parties_with_document,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) => is_required(val, 'El beneficiario es requerido'),
      ],
    },
    {
      name: 'third_party_beneficiary_description',
      label: 'Descripción beneficiario',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      readonly: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'total_value',
      label: 'Valor total*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) => is_required(val, 'El valor es requerido'),
        (val: string) => max_integer_decimal(val, 17, 2),
      ],
    },
    {
      name: 'addition',
      label: 'Adición',
      type: 'q-checkbox',
      value: false,
      class: 'col-12 col-md-2 flex items-center',
      disable: false,
      clean_value: false,
    },
    {
      name: 'operation_log_id',
      label: 'Número de documento asociado a la adición',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: operation_logs_authorized,
      display_label: 'operation_label',
      disable: true,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val, 'El documento es requerido')],
    },
    {
      name: 'observations',
      label: 'Observaciones',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [(val: string) => !val || max_length(val, 100)],
    },
  ])

  const tableProps = ref<IBaseTableProps<IOperationLogList>>({
    title: 'Listado registro operaciones',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'year',
        label: 'Vigencia',
        align: 'left',
        field: 'year',
        sortable: true,
        required: true,
        style: styleColumns,
      },
      {
        name: 'month',
        label: 'Mes',
        align: 'left',
        field: 'month',
        sortable: true,
        required: true,
        style: styleColumns,
      },
      {
        name: 'day',
        label: 'Día',
        align: 'left',
        field: 'day',
        sortable: true,
        required: true,
        style: styleColumns,
      },
      {
        name: 'areas_responsibility_id',
        label: 'Área',
        align: 'left',
        field: 'areas_responsibility_id',
        sortable: true,
        required: true,
        style: styleColumns,
      },
      {
        name: 'code_movements_source_destination_id',
        label: 'Código de movimiento',
        align: 'left',
        field: 'code_movements_source_destination_id',
        sortable: true,
        required: true,
        style: styleColumns,
      },
      {
        name: 'budget_item_id',
        label: 'Rubro presupuestal',
        align: 'left',
        field: 'budget_item_id',
        sortable: true,
        required: true,
        style: styleColumns,
      },
      {
        name: 'budget_resource_id',
        label: 'Recurso',
        align: 'left',
        field: 'budget_resource_id',
        sortable: true,
        required: true,
        style: styleColumns,
      },
      {
        name: 'value',
        label: 'Valor',
        align: 'left',
        field: 'value',
        sortable: true,
        required: true,
        style: styleColumns,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const initialFilterDisableState = filterConfig.value.map((f) => ({
    name: f.name,
    disable: f.disable,
  }))

  const isTableValid = computed(() => {
    if (!tableProps.value.rows.length) return false

    return tableProps.value.rows.every(
      (row) =>
        row.year &&
        row.month &&
        row.day &&
        row.areas_responsibility_id &&
        row.code_movements_source_destination_id &&
        row.budget_item_id &&
        row.budget_resource_id &&
        row.value &&
        !isNaN(Number(row.areas_responsibility_id)) &&
        !isNaN(Number(row.code_movements_source_destination_id)) &&
        !isNaN(Number(row.budget_item_id)) &&
        !isNaN(Number(row.budget_resource_id)) &&
        !isNaN(Number(row.value))
    )
  })

  const updateFilterDescriptions = (
    values: Record<string, string | number | boolean>
  ) => {
    const filtersMap = [
      {
        key: 'filter[business_trust_id]',
        descriptionField: 'business_trust_description',
        source: business_trusts_selector.value,
        sourceKey: 'id',
        labelKey: 'name',
      },
      {
        key: 'filter[business_trust_id]',
        descriptionField: 'document_year',
        source: business_trusts_selector.value,
        sourceKey: 'id',
        labelKey: 'validity_year',
      },
      {
        key: 'filter[budget_document_type_id]',
        descriptionField: 'budget_document_type_description',
        source: budget_document_types.value,
        sourceKey: 'id',
        labelKey: 'description',
      },
      {
        key: 'filter[areas_resposability_id]',
        descriptionField: 'areas_resposability_description',
        source: areas_responsabilities_applicant.value,
        sourceKey: 'id',
        labelKey: 'description',
      },
      {
        key: 'filter[city_id]',
        descriptionField: 'city_description',
        source: cities_required_document_type.value,
        sourceKey: 'id',
        labelKey: 'label',
      },
      {
        key: 'filter[third_party_beneficiary_id]',
        descriptionField: 'third_party_beneficiary_description',
        source: accounting_third_parties_with_document.value,
        sourceKey: 'value',
        labelKey: 'label',
      },
    ]

    for (const {
      key,
      descriptionField,
      source,
      sourceKey,
      labelKey,
    } of filtersMap) {
      const value = values[key]
      if (!value) {
        filtersRef.value?.cleanFiltersByNames([descriptionField])
        continue
      }
      const match = source.find(
        (item) => item[sourceKey as keyof IGenericResource] === value
      )
      filtersRef.value?.setFieldValueByName(
        descriptionField,
        (match?.[labelKey as keyof IGenericResource] as string) ?? ''
      )
    }
  }

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources(
      { accounting: ['business_trusts_selector'] },
      'filter[has_budget]=true&filter[can]=true',
      'v2'
    )

    await _getResources(keys)

    openMainLoader(false)
  }

  const handleFilter = (values: Record<string, string | number | boolean>) => {
    filtersLocked.value = true

    isTableEmpty.value = true
    filtersFormat.value = {
      third_party_beneficiary_id: values['filter[third_party_beneficiary_id]'],
      budget_document_type_id: values['filter[budget_document_type_id]'],
      areas_responsibility_id: values['filter[areas_resposability_id]'],
      business_trust_id: values['filter[business_trust_id]'],
      operation_log_id: values['filter[operation_log_id]'],
      document_year: values['filter[document_year]'],
      observations: values['filter[observations]'],
      total_value: values['filter[total_value]'],
      addition: values['filter[addition]'],
      city_id: values['filter[city_id]'],
      date: values['filter[date]'],
    }

    for (const f of filterConfig.value) f.disable = true
  }

  const onChangeFilter = async (
    values: Record<string, string | number | boolean>
  ) => {
    if (filtersLocked.value) return
    if (isTableEmpty.value) return
    updateFilterDescriptions(values)

    const additionValue = values['filter[addition]'] === true
    const operationLogField = filterConfig.value.find(
      (f) => f.name === 'operation_log_id'
    )
    if (operationLogField) {
      operationLogField.disable = !additionValue
      if (!additionValue) operationLogField.value = null
    }

    const business_trust_id = values['filter[business_trust_id]'] ?? null
    if (String(business_trust_id) !== String(lastBusinessTrustId)) {
      lastBusinessTrustId = business_trust_id
      if (business_trust_id) {
        await _getResources(
          { trust_business: ['business_budget'] },
          `filter[business_trust_id]=${business_trust_id}`
        )
      }
    }

    const budget_document_type_id =
      values['filter[budget_document_type_id]'] ?? null

    const areasField = filterConfig.value.find(
      (f: IFieldFilters) => f.name === 'areas_resposability_id'
    )
    const citiesField = filterConfig.value.find(
      (f: IFieldFilters) => f.name === 'city_id'
    )

    const disableField = (field?: IFieldFilters | undefined) => {
      if (!field) return
      field.disable = true
      field.value = null
    }

    if (!budget_document_type_id) {
      disableField(areasField)
      disableField(citiesField)
      return
    }

    if (String(budget_document_type_id) !== String(lastBudgetDocumentTypeId)) {
      lastBudgetDocumentTypeId = budget_document_type_id

      await _getResources(
        {
          budget: [
            'areas_responsabilities_applicant',
            'cities_required_document_type',
          ],
        },
        `document_type_id=${budget_document_type_id}`
      )

      if (areasField) {
        const hasAreas = areas_responsabilities_applicant.value.length > 0
        areasField.disable = !hasAreas
        if (!hasAreas) areasField.value = null
      }

      if (citiesField) {
        const hasCities = cities_required_document_type.value.length > 0
        citiesField.disable = !hasCities
        if (!hasCities) citiesField.value = null
      }
    }
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    hasTableData.value = true
    isTableEmpty.value = false
    tableProps.value.rows = []
    filtersLocked.value = false
  }

  const openModal = (action: 'delete' | 'confirm', id?: number) => {
    const actionText = action === 'delete' ? 'eliminar' : 'confirmar'
    const actionIcon = action === 'delete' ? deleteIcon : confirmIcon

    alertModalConfig.value = {
      title: `¿Desea ${actionText} el registro de operación?`,
      id: id ?? null,
      img: actionIcon,
      action: action,
    }

    alertModalRef.value?.openModal()
  }

  const handleOptions = (action: 'add' | 'delete' | 'confirm', id?: number) => {
    switch (action) {
      case 'add':
        return addRow()
      case 'delete':
        return removeRow(id ?? 0)
      case 'confirm':
        return openModal(action, id)
    }
  }

  const addRow = () => {
    hasTableData.value = false
    const rows = tableProps.value.rows

    rows.push({
      id: 0,
      year: Number(filtersFormat.value.document_year ?? 0),
      month: 0,
      day: 0,
      areas_responsibility_id: null,
      code_movements_source_destination_id: null,
      budget_item_id: null,
      budget_resource_id: null,
      value: 0,
    })

    tableProps.value.rows = rows.map((row, index) => ({
      ...row,
      id: index + 1,
      no: index + 1,
    }))
  }

  const removeRow = (id: number) => {
    tableProps.value.rows = tableProps.value.rows
      .filter((row) => row.id !== id)
      .map((row, index) => ({
        ...row,
        id: index + 1,
        no: index + 1,
      }))
  }

  const onSubmit = async (action: string) => {
    if (action === 'confirm') {
      openMainLoader(true)

      const payload = {
        ...filtersFormat.value,
        operation_log_details: tableProps.value.rows.map(
          (row: IOperationLogList) => ({
            id: row.id,
            year: row.year,
            month: row.month,
            day: row.day,
            areas_responsibility_id: Number(row.areas_responsibility_id),
            code_movements_source_destination_id: Number(
              row.code_movements_source_destination_id
            ),
            budget_item_id: Number(row.budget_item_id),
            budget_resource_id: Number(row.budget_resource_id),
            value: String(row.value),
          })
        ),
      }

      const success = await _createAction(payload)

      if (success) {
        for (const f of filterConfig.value) {
          const initial = initialFilterDisableState.find(
            (i) => i.name === f.name
          )
          if (initial) f.disable = initial.disable
        }

        handleClearFilters()
      }

      openMainLoader(false)
    } else if (action === 'delete')
      removeRow(alertModalConfig.value.id as number)

    alertModalRef.value?.closeModal()
  }

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => _resetKeys(keysClean))

  return {
    areas,
    budget,
    onSubmit,
    resources,
    filtersRef,
    tableProps,
    headerProps,
    handleFilter,
    filterConfig,
    hasTableData,
    isTableEmpty,
    isTableValid,
    filtersFormat,
    alertModalRef,
    handleOptions,
    customColumns,
    filtersLocked,
    code_movements,
    onChangeFilter,
    alertModalConfig,
    defaultIconsLucide,
    handleClearFilters,
  }
}

export default useBudgetOperationLogsList

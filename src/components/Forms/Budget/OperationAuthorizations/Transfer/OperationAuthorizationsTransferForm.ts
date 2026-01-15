// Vue - Router - Pinia
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Composables
import { useUtils, useRules } from '@/composables'
// Interfaces
import {
  IOperationAuthorizationFormEdit,
  ITransferFormData,
} from '@/interfaces/customs/budget/OperationAuthorizations'
import { IBaseTableProps, NonCreateActionType } from '@/interfaces/global'
import { IThirdPartyDocumentResource } from '@/interfaces/customs/resources/Budget'
import { QTableColumn } from 'quasar'
// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useOperationAuthorizationTransferForm = (props: {
  action: NonCreateActionType
  data?: ITransferFormData
  is1to1?: boolean
}) => {
  const { defaultIconsLucide, styleColumn } = useUtils()
  const { is_required } = useRules()

  const {
    budget_item_codes_source_destination,
    areas_resposabilities_codes,
    budget_resource_codes,
    business_trusts,
    third_parties,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const is1to1Transfer = computed(() => props.is1to1 || false)
  const formRef = ref()

  // Estado para las filas de origen y destino
  const originRows = ref<IOperationAuthorizationFormEdit[]>([])
  const destinationRows = ref<IOperationAuthorizationFormEdit[]>([])

  const customColumns = computed(() => [
    'business',
    'business_description',
    'budget_item',
    'budget_item_description',
    'resource',
    'resource_description',
    'area',
    'area_description',
    'third_party',
    'third_party_description',
    'month',
    'value',
    ...(is1to1Transfer.value || props.action === 'view' ? [] : ['actions']),
  ])

  // Columnas para el listado de origen y destino
  const tableColumns = computed(() => [
    {
      name: 'business',
      label: 'Negocio',
      field: 'business_trust_id',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'business_description',
      label: 'Descripción negocio',
      field: 'business_trust_id_description',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'budget_item',
      label: 'Rubro presupuestal',
      field: 'budget_item_id',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'budget_item_description',
      label: 'Descripcion rubro presupuestal',
      field: 'budget_item_description',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'resource',
      label: 'Recurso',
      field: 'resource_id',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'resource_description',
      label: 'Descripción recurso',
      field: 'resource_description',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'area',
      label: 'Área',
      field: 'area_id',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'area_description',
      label: 'Descripción área',
      field: 'area_description',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'third_party',
      label: 'Tercero',
      field: 'third_party_id',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'third_party_description',
      label: 'Nombre tercero',
      field: 'third_party_description',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'month',
      label: 'Mes',
      field: 'month',
      align: 'left' as const,
      sortable: false,
      style: styleColumn(150),
    },
    {
      name: 'value',
      label: 'Valor',
      field: 'value',
      align: 'right' as const,
      sortable: false,
      style: styleColumn(150),
    },
  ])

  // Para modo no 1a1, agregar columna de acciones
  const columns = computed(() =>
    is1to1Transfer.value || props.action === 'view'
      ? tableColumns.value
      : [
          ...tableColumns.value,
          {
            name: 'actions',
            label: 'Acciones',
            field: 'actions',
            align: 'center',
          },
        ]
  )

  const tablePropsOrigin = ref<
    IBaseTableProps<IOperationAuthorizationFormEdit>
  >({
    title: 'Sección Origen',
    loading: false,
    columns: columns.value as QTableColumn<IOperationAuthorizationFormEdit>[],
    rows: originRows.value,
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })
  const tablePropsdestination = ref<
    IBaseTableProps<IOperationAuthorizationFormEdit>
  >({
    title: 'Sección Destino',
    loading: false,
    columns: columns.value as QTableColumn<IOperationAuthorizationFormEdit>[],
    rows: destinationRows.value,
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  // Función para agregar fila en sección origen
  const addOriginRow = () => {
    originRows.value.push({
      type: 'ORIGEN',
      month: null,
      value: null,
      business_trust_id: null,
      third_party_id: null,
      area_id: null,
      budget_item_id: null,
      resource_id: null,
      adjusted_value: null,
    })
  }

  // Función para agregar fila en sección destino
  const addDestinationRow = () => {
    destinationRows.value.push({
      type: 'DESTINO',
      month: null,
      value: null,
      business_trust_id: null,
      third_party_id: null,
      area_id: null,
      budget_item_id: null,
      resource_id: null,
    })
  }

  // Función para eliminar fila de origen
  const deleteOriginRow = (row: IOperationAuthorizationFormEdit) => {
    const index = originRows.value.findIndex((r) => r.id === row.id)
    if (index > -1) {
      originRows.value.splice(index, 1)
    }
  }

  // Función para eliminar fila de destino
  const deleteDestinationRow = (row: IOperationAuthorizationFormEdit) => {
    const index = destinationRows.value.findIndex((r) => r.id === row.id)
    if (index > -1) {
      destinationRows.value.splice(index, 1)
    }
  }

  // Función para poblar la descripción del tercero desde el listado
  const populateThirdPartyDescription = (
    rows: IOperationAuthorizationFormEdit[]
  ) => {
    rows.forEach((row) => {
      if (row.third_party_id && !row.third_party_description) {
        const thirdParty = third_parties.value.find(
          (tp) => tp.value === row.third_party_id
        ) as IThirdPartyDocumentResource | undefined
        if (thirdParty) {
          row.third_party_description =
            thirdParty.legal_person?.business_name ||
            thirdParty.natural_person?.full_name ||
            thirdParty.description ||
            ''
        }
      }
    })
  }

  // Watch para cargar datos desde props
  watch(
    () => props.data,
    (newData) => {
      if (newData?.originRows && newData?.destinationRows) {
        originRows.value = Array.isArray(newData.originRows)
          ? [...newData.originRows]
          : []
        destinationRows.value = Array.isArray(newData.destinationRows)
          ? [...newData.destinationRows]
          : []

        // Poblar descripciones de terceros si existen third_party_id pero no description
        populateThirdPartyDescription(originRows.value)
        populateThirdPartyDescription(destinationRows.value)
      }
    },
    { immediate: true, deep: true }
  )

  // Watch para actualizar descripciones cuando se cargan los terceros
  watch(
    third_parties,
    () => {
      if (third_parties.value.length > 0) {
        populateThirdPartyDescription(originRows.value)
        populateThirdPartyDescription(destinationRows.value)
      }
    },
    { immediate: true }
  )
  watch(
    () => originRows.value,
    () => (tablePropsOrigin.value.rows = originRows.value),
    { deep: true }
  )
  watch(
    () => destinationRows.value,
    () => (tablePropsdestination.value.rows = destinationRows.value),
    { deep: true }
  )
  // Actualizar columnas cuando cambien (reactividad para actions)
  watch(
    columns,
    (newColumns) => {
      tablePropsOrigin.value.columns =
        newColumns as QTableColumn<IOperationAuthorizationFormEdit>[]
      tablePropsdestination.value.columns =
        newColumns as QTableColumn<IOperationAuthorizationFormEdit>[]
    },
    { immediate: true }
  )

  // Obtener datos del formulario
  const getFormData = (): ITransferFormData => ({
    originRows: originRows.value,
    destinationRows: destinationRows.value,
  })

  return {
    defaultIconsLucide,
    formRef,
    budget_item_codes_source_destination,
    areas_resposabilities_codes,
    budget_resource_codes,
    business_trusts,
    third_parties,
    customColumns,
    is1to1Transfer,
    tablePropsOrigin,
    tablePropsdestination,
    is_required,
    addOriginRow,
    addDestinationRow,
    deleteOriginRow,
    deleteDestinationRow,
    getFormData,
  }
}

export default useOperationAuthorizationTransferForm

// vue - quasar
import { QTableColumn } from 'quasar'
import { computed, ref, watch } from 'vue'

// interface
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IConfigurationActiveForm,
  IConfigurationActiveResponseList,
} from '@/interfaces/customs/fixed-assets/ConfigurationActiveNoveltyTypes'

// stores
import { storeToRefs } from 'pinia'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'

// composable
import { useMainLoader, useUtils } from '@/composables'

const useInformationform = (
  props: {
    action: ActionType
    data?: IConfigurationActiveForm | null
  },

  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  // stores
  const { affectation_type } = storeToRefs(useFixedAssetsResourceStore('v1'))

  // composable
  const { openMainLoader } = useMainLoader()

  const models = ref<IConfigurationActiveForm>({
    id: null,
    created_by_name: null,
    updated_by_name: null,
    updated_at: null,
    created_at: null,
    configuration_active_novelty_types: [],
  })

  const configActiveNoveltyTypesRef = ref()
  const currentPage = ref(1)
  const perPage = ref(10)
  const pageList = ref([10, 25, 50])
  const alertModalRef = ref()

  const tableProps = ref<IBaseTableProps<IConfigurationActiveResponseList>>({
    loading: false,
    ...(props.action === 'view'
      ? { title: 'Listado de tipo de novedad activos fijos / bienes' }
      : {}),

    columns: [
      ...(props.action !== 'create'
        ? [
            {
              name: 'id',
              field: 'id',
              required: false,
              label: '#',
              align: 'center',
              sortable: true,
            },
          ]
        : []),
      ...(props.action !== 'create'
        ? [
            {
              name: 'code',
              field: 'code',
              required: false,
              label: 'Codigo',
              align: 'center',
              sortable: true,
            },
          ]
        : []),

      {
        name: 'description',
        field: 'description',
        required: false,
        label: 'Descripcion',
        align: 'center',
        sortable: true,
      },
      {
        name: 'accounting',
        field: 'accounting',
        required: false,
        label: 'Contabilidad',
        align: 'center',
        sortable: true,
      },
      {
        name: 'affectation',
        field: (row) => row.affectation_type ?? '-',
        required: false,
        label: 'Afectación bien',
        align: 'center',
        sortable: true,
      },

      ...(props.action !== 'edit' && props.action !== 'view'
        ? [
            {
              name: 'actions',
              field: 'actions',
              required: false,
              label: 'Acciones',
              align: 'center',
              sortable: true,
            },
          ]
        : []),
    ] as QTableColumn<IConfigurationActiveResponseList>[],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const alertModalConfig = ref({
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
    index: null as null | number,
  })

  const openDeleteModal = async (index: number) => {
    alertModalConfig.value.description = '¿Desea eliminar el registro?'
    alertModalConfig.value.index = index

    alertModalRef.value.openModal()
  }

  const addRegister = () => {
    models.value.configuration_active_novelty_types.unshift({
      description: null,
      accounting: true,
      affectation_type: null,
    })
    tableProps.value.pages.lastPage = Math.ceil(
      models.value.configuration_active_novelty_types.length / perPage.value
    )
  }
  const handleDelete = async () => {
    if (alertModalConfig.value.index === null) return

    openMainLoader(true)

    models.value.configuration_active_novelty_types.splice(
      alertModalConfig.value.index,
      1
    )

    tableProps.value.pages.lastPage = Math.ceil(
      models.value.configuration_active_novelty_types.length / perPage.value
    )

    await alertModalRef.value.closeModal()
    openMainLoader(false)
  }

  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return models.value.configuration_active_novelty_types.slice(start, end)
  })

  const updatePage = async (page: number) => {
    currentPage.value = page
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    currentPage.value = 1
    tableProps.value.pages.lastPage = Math.ceil(
      models.value.configuration_active_novelty_types.length / rowsPerPage
    )
  }

  const defaultDateValue = computed(() => {
    if (props.action === 'edit' && models.value.created_at) {
      return models.value.created_at
    }

    return new Date().toLocaleString('sv-SE')
  })

  // lifecycle hooks
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,

    (val) => {
      if (val && props.data) models.value = props.data
    },

    { immediate: true }
  )

  return {
    tableProps,
    models,
    configActiveNoveltyTypesRef,
    affectation_type,
    paginatedRows,
    pageList,
    alertModalConfig,
    alertModalRef,
    defaultDateValue,
    openDeleteModal,
    handleDelete,
    updatePage,
    updatePerPage,
    addRegister,
  }
}

export default useInformationform

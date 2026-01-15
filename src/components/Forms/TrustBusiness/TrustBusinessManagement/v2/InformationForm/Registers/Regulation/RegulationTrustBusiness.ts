// vue - pinia - quasar
import { computed, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// interfaces
import { IRegulationTrustBusiness } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ActionType } from '@/interfaces/global'

// composables
import { useUtils } from '@/composables'
const { defaultIconsLucide } = useUtils()

const useRegulationTrustBusiness = (
  props: {
    action: ActionType
    data?: IRegulationTrustBusiness[] | null
  },
  emit: Function
) => {
  // tabñes
  const tableProps = ref({
    title: 'Documentos normativos requeridos',
    loading: false,
    columns: [
      {
        name: 'document_name',
        field: 'document_name',
        required: true,
        label: 'Nombre',
        align: 'center',
        sortable: true,
      },
      {
        name: 'description',
        field: 'description',
        required: true,
        label: 'Descripción',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        field: 'actions',
        required: props.action !== 'view',
        label: 'Acciones',
        align: 'center',
      },
    ] as QTable['columns'],
    rows: [] as IRegulationTrustBusiness[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const pageSize = ref(20)
  const paginated = computed(() => {
    const start = (tableProps.value.pages.currentPage - 1) * pageSize.value
    return tableProps.value.rows.slice(start, start + pageSize.value)
  })

  const addRowTable = () => {
    const aux: IRegulationTrustBusiness = {
      document_name: '',
      description: '',
    }

    tableProps.value.rows?.unshift(aux)
  }

  const update_rows_per_page = (val: number) => {
    pageSize.value = val
    tableProps.value.pages.currentPage = 1
  }

  // refs & modal
  const regulation_trust_business_form_ref = ref()
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as IRegulationTrustBusiness | null,
  })

  const openAlertModal = async (entityId: IRegulationTrustBusiness) => {
    alertModalConfig.value.entityId = entityId
    await alertModalRef.value.openModal()
  }

  // actions
  const changeStatusAction = async () => {
    const idToDelete = alertModalConfig.value.entityId

    if (idToDelete !== null) {
      tableProps.value.rows = tableProps.value.rows.filter(
        (row) => row !== idToDelete
      )

      alertModalConfig.value.entityId = null
    }

    alertModalRef.value.closeModal()
  }

  // lifecycles
  onMounted(() => {
    tableProps.value.rows = props.data ? props.data : []
  })

  // watchs
  watch(
    [() => tableProps.value.rows, () => pageSize.value],
    (newVal) => {
      tableProps.value.pages.lastPage = Math.ceil(
        tableProps.value.rows.length / pageSize.value
      )

      if (newVal[0].length === 0) {
        emit('update:models', null)
      } else {
        emit('update:models', newVal[0])
      }
    },
    { deep: true }
  )

  return {
    tableProps,
    paginated,
    pageSize,
    regulation_trust_business_form_ref,
    alertModalRef,
    defaultIconsLucide,

    openAlertModal,
    changeStatusAction,
    addRowTable,
    update_rows_per_page,
  }
}

export default useRegulationTrustBusiness

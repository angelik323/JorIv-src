// vue - pinia - quasar
import { computed, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// interfaces
import { IRegulationTrustBusiness } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { ActionType } from '@/interfaces/global'

const useRegulationTrustBusiness = (
  props: {
    action: ActionType
    data?: IRegulationTrustBusiness[] | null
  },
  emit: Function
) => {
  const regulation_trust_business_form_ref = ref()

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
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              field: 'actions',
              required: true,
              label: 'Acciones',
              align: 'center',
            },
          ]
        : []),
    ] as QTable['columns'],
    rows: [] as IRegulationTrustBusiness[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

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

  onMounted(() => {
    tableProps.value.rows = props.data ? props.data : []
  })

  watch(
    () => props.data,
    () => {
      tableProps.value.rows = props.data ? props.data : []
    },
    { deep: true }
  )

  watch(
    [() => tableProps.value.rows, () => pageSize.value],
    () => {
      tableProps.value.pages.lastPage = Math.ceil(
        tableProps.value.rows.length / pageSize.value
      )

      if (tableProps.value.rows.length === 0) {
        emit('update:models', null)
      } else {
        emit('update:models', tableProps.value.rows)
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
    openAlertModal,
    changeStatusAction,
    addRowTable,
  }
}

export default useRegulationTrustBusiness

// vue - quasar - router
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'

// pinia
import { storeToRefs } from 'pinia'

// store
import { usePolicyStore } from '@/stores'

// interfaces
import { IPolicyList } from '@/interfaces/customs'

const usePoliciesTrustBusiness = (props: { businessId: number }) => {
  const { policy_transfers_list, policy_transfers_pages } = storeToRefs(
    usePolicyStore('v1')
  )
  const { _getPoliciesByBusinessId, _clearData } = usePolicyStore('v1')

  const router = useRouter()

  const tableProps = ref({
    title: 'Listado de pólizas',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'policy_id',
        required: true,
        label: 'Id Póliza',
        align: 'left',
        field: (row) => row.id,
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: (row) => row.business_trust?.name,
        sortable: true,
      },
      {
        name: 'policy_number',
        required: true,
        label: 'N° de póliza',
        align: 'left',
        field: (row) => row.policy_number,
        sortable: true,
      },
      {
        name: 'insurer',
        required: true,
        label: 'Aseguradora',
        align: 'left',
        field: (row) => row.insurer?.name,
        sortable: true,
      },
      {
        name: 'insured_value',
        required: true,
        label: 'Valor asegurado',
        align: 'left',
        field: (row) => row.insured_value,
        sortable: true,
      },
      {
        name: 'record_status_id',
        required: true,
        label: 'Estado del registro',
        align: 'left',
        field: (row) => row.record_status?.id,
        sortable: true,
      },
      {
        name: 'policy_status_id',
        required: true,
        label: 'Estado de la póliza',
        align: 'left',
        field: (row) => row.policy_status?.id,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IPolicyList[],
    pages: policy_transfers_pages.value,
  })

  const listAction = async (businessId: number) => {
    if (!businessId) return

    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getPoliciesByBusinessId(businessId, false)

    tableProps.value.loading = false
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    _clearData()

    const businessId = props.businessId
    if (!businessId) return

    await Promise.all([listAction(businessId)])
  })

  onBeforeUnmount(() => {
    _clearData()
  })

  watch(
    policy_transfers_list,
    () => {
      tableProps.value.rows = [...policy_transfers_list.value]

      const { currentPage, lastPage } = policy_transfers_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    tableProps,
    handlerGoTo,
  }
}

export default usePoliciesTrustBusiness

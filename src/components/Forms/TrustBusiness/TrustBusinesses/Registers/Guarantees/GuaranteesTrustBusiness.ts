// vue - quasar - router
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { QTable } from 'quasar'

// pinia
import { storeToRefs } from 'pinia'

// store
import { useGuaranteesStore } from '@/stores'

// interfaces
import { IGuaranteesList } from '@/interfaces/customs'

const useGuaranteesTrustBusiness = (props: { businessId: number }) => {
  const { guarantees_list, guarantees_pages } = storeToRefs(
    useGuaranteesStore('v1')
  )
  const { _getGuaranteesByBusinessId, _clearData } = useGuaranteesStore('v1')

  const tableProps = ref({
    title: 'Listado de garantías',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'id',
        field: 'id',
        required: true,
        label: 'ID de garantía',
        align: 'left',
        sortable: true,
      },
      {
        name: 'registration_date',
        field: 'registration_date',
        required: true,
        label: 'Fecha de registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'guarantee_type',
        field: 'guarantee_type',
        required: true,
        label: 'Tipo de garantía',
        align: 'left',
        sortable: true,
      },
      {
        name: 'registration_status',
        field: (row) => row.registration_status?.id,
        required: true,
        label: 'Estado del registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'guarantee_status',
        field: (row) => row.guarantee_status?.id,
        required: true,
        label: 'Estado de la garantía',
        align: 'left',
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
    rows: [] as IGuaranteesList[],
    pages: guarantees_pages.value,
  })

  const listAction = async (businessId: number) => {
    if (!businessId) return

    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getGuaranteesByBusinessId(businessId, false)

    tableProps.value.loading = false
  }

  onMounted(async () => {
    _clearData()

    const businessId = props.businessId
    if (!businessId) return

    await listAction(businessId)
  })

  onBeforeUnmount(() => {
    _clearData()
  })

  watch(
    guarantees_list,
    () => {
      tableProps.value.rows = [...guarantees_list.value]

      const { currentPage, lastPage } = guarantees_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    tableProps,
  }
}

export default useGuaranteesTrustBusiness

// vue - pinia - quasar
import { computed, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// interfaces
import { IBillingCollect } from '@/interfaces/customs/trust-business/TrustBusinesses'

const useBillingTrustBusiness = (props: {
  action: 'view'
  data?: IBillingCollect[] | null
}) => {
  // table
  const tableProps = ref({
    title: 'Listado de facturas de comisiones',
    loading: false,
    columns: [
      {
        name: 'Número de factura',
        field: (row) => row.invoice_number,
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_name_snapshot',
        field: (row) => row.business_name_snapshot,
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_at',
        field: (row) => row.created_at,
        required: true,
        label: 'Fecha de emisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'observations',
        field: (row) => row.observations,
        required: true,
        label: 'Concepto factura',
        align: 'left',
        sortable: true,
      },
      {
        name: 'settled_commission',
        field: (row) => row.settled_commission,
        required: true,
        label: 'Clase de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_type',
        field: (row) => row.settled_commission,
        required: true,
        label: 'Tipo de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'expire_at',
        field: (row) => row.expire_at,
        required: true,
        label: 'Fecha de vencimiento',
        align: 'center',
      },
      {
        name: 'total_amount',
        field: (row) => row.total_amount,
        required: true,
        label: 'Valor total',
        align: 'center',
      },
      {
        name: 'status_id',
        field: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IBillingCollect[],
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

  // table concepts
  const tablePropsConcepts = ref({
    title: 'Listado de facturas otros conceptos',
    loading: false,
    columns: [
      {
        name: 'invoice_number',
        field: (row) => row.invoice_number,
        required: true,
        label: 'Número de factura',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_name_snapshot',
        field: (row) => row.business_name_snapshot,
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party_billing_name_snapshot',
        field: (row) => row.third_party_billing_name_snapshot,
        required: true,
        label: 'Nombre del cliente',
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_at',
        field: (row) => row.created_at,
        required: true,
        label: 'Fecha de emisión',
        align: 'center',
      },
      {
        name: 'observations',
        field: (row) => row.observations,
        required: true,
        label: 'Concepto factura',
        align: 'left',
        sortable: true,
      },
      {
        name: 'total_amount',
        field: (row) => row.total_amount,
        required: true,
        label: 'Valor total',
        align: 'center',
      },
      {
        name: 'status_id',
        field: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IBillingCollect[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const pageSizeConcepts = ref(20)

  const paginatedConcepts = computed(() => {
    const start =
      (tablePropsConcepts.value.pages.currentPage - 1) * pageSizeConcepts.value
    return tablePropsConcepts.value.rows.slice(
      start,
      start + pageSizeConcepts.value
    )
  })

  // actions
  const assignDataTables = () => {
    tableProps.value.rows =
      props.data?.filter((item) => item.invoice_type === 'commission') ?? []

    tablePropsConcepts.value.rows =
      props.data?.filter((item) => item.invoice_type === 'other_concept') ?? []
  }

  // lifecycles
  onMounted(() => {
    assignDataTables()
  })

  // watchs
  watch(
    () => props.data,
    () => {
      assignDataTables()
    },
    { deep: true }
  )

  return {
    tableProps,
    tablePropsConcepts,
    pageSize,
    paginated,
    pageSizeConcepts,
    paginatedConcepts,
  }
}

export default useBillingTrustBusiness

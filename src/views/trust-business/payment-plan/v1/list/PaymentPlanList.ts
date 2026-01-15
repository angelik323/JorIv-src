// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import { QTable } from 'quasar'
import { TrustBusinessTypeID } from '@/interfaces/global/TrustBusiness'
import { IPaymentPlanList } from '@/interfaces/customs/trust-business/PaymentPlan'
import { IFieldFilters } from '@/interfaces/customs/Filters'

// Composables
import { useMainLoader, useUtils, useRouteValidator } from '@/composables'

// Stores
import { usePaymentPlanStore } from '@/stores/trust-business/payment-plan'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const usePaymentPlanList = () => {
  const route = useRoute()
  const { validateRouter } = useRouteValidator()
  const { _getListPaymentPlan, _deletePaymentPlan, _clearData } =
    usePaymentPlanStore('v1')
  const { headerPropsDefault, data_payment_plan_list, pages } = storeToRefs(
    usePaymentPlanStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    business_trusts,
    business_trust_real_estate_project,
    project_stage,
    business_trust_properties,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { openMainLoader } = useMainLoader()
  const { formatCurrency } = useUtils()

  const headerProperties = headerPropsDefault.value

  const tableProperties = ref({
    title: 'Listado de plan de pagos',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name_business',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: (row: IPaymentPlanList) =>
          `${row.real_estate_project?.business_trust?.name ?? ''}`,
        sortable: true,
      },
      {
        name: 'name_project',
        required: true,
        label: 'Nombre del proyecto',
        align: 'left',
        field: (row: IPaymentPlanList) =>
          `${row.real_estate_project?.project_name ?? ''}`,
        sortable: true,
      },
      {
        name: 'stage',
        required: true,
        label: 'Etapa',
        align: 'left',
        field: (row: IPaymentPlanList) =>
          `${row.real_estate_project_stage?.stage_number ?? ''}`,
        sortable: true,
      },
      {
        name: 'apartment_house',
        required: true,
        label: 'Apartamento / Casa',
        align: 'left',
        field: (row: IPaymentPlanList) =>
          `${row.nomenclature?.nomenclature ?? ''}`,
        sortable: true,
      },
      {
        name: 'credit_value',
        required: true,
        label: 'Valor del crédito',
        align: 'left',
        field: (row: IPaymentPlanList) =>
          `${formatCurrency(row.credit_value ?? 0) ?? ' - '}`,
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
    rows: data_payment_plan_list,
    pages: pages,
    wrapCells: true,
  })

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio fiduciario',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 col-lg-3',
      options: business_trusts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'project_id',
      label: 'Proyecto inmobiliario',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 col-lg-3',
      options: business_trust_real_estate_project,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'project_stage_id',
      label: 'Etapa',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 col-lg-3',
      options: project_stage,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'nomenclature_id',
      label: 'Apartamento / Casa',
      type: 'q-select',
      value: null,
      class: 'col-12 col-lg-3',
      options: business_trust_properties,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getListPaymentPlan(filters)
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[business_trust_id]': string
    'filter[project_id]': string
    'filter[project_stage_id]': string
    'filter[nomenclature_id]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const deleteModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar el plan de pagos?',
    entityId: null as number | null,
  })

  const openModalDelete = async (id: number) => {
    alertModalConfig.value.entityId = id || null
    deleteModalRef.value.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.entityId) return
    deleteModalRef.value.closeModal()

    openMainLoader(true)
    const success = await _deletePaymentPlan(alertModalConfig.value.entityId)
    if (success) await listAction(filtersFormat.value)

    filtersFormat.value = {
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)

    openMainLoader(false)
  }

  onMounted(async () => {
    // Provisional
    _resetKeys({
      trust_business: [
        'business_trusts',
        'business_trust_real_estate_project',
        'project_stage',
        'business_trust_properties',
      ],
    })
    _clearData()

    await Promise.all([
      _getResources(
        { trust_business: ['business_trusts'] },
        `filter[business_type_id]=${TrustBusinessTypeID.FIDUCIA_INMOBILIARIA}`
      ),
    ])

    const reload = route.query.reload
    if (reload) {
      filtersFormat.value = {
        page: 1,
        rows: filtersFormat.value.rows,
      }

      await listAction(filtersFormat.value)
    }
  })

  onBeforeUnmount(() => {
    _resetKeys({
      trust_business: [
        'business_trusts',
        'business_trust_real_estate_project',
        'project_stage',
        'business_trust_properties',
      ],
    })
  })

  const handleFilterUpdate = async ($filters: {
    'filter[business_trust_id]': string
    'filter[project_id]': string
    'filter[project_stage_id]': string
    'filter[nomenclature_id]': string
  }) => {
    const businessTrustId = $filters['filter[business_trust_id]']
    const projectId = $filters['filter[project_id]']
    const projectStageId = $filters['filter[project_stage_id]']

    // Negocio → Proyectos
    if (businessTrustId !== filtersFormat.value['filter[business_trust_id]']) {
      filterComponentRef.value?.cleanFiltersByNames([
        'project_id',
        'project_stage_id',
        'nomenclature_id',
      ])

      _resetKeys({
        trust_business: [
          'business_trust_real_estate_project',
          'project_stage',
          'business_trust_properties',
        ],
      })

      if (businessTrustId) {
        await _getResources(
          { trust_business: ['business_trust_real_estate_project'] },
          `filter[business_trust_id]=${businessTrustId}`
        )
      }
    }

    // Proyecto → Etapas
    if (projectId !== filtersFormat.value['filter[project_id]']) {
      filterComponentRef.value?.cleanFiltersByNames([
        'project_stage_id',
        'nomenclature_id',
      ])

      _resetKeys({
        trust_business: ['project_stage', 'business_trust_properties'],
      })

      if (projectId) {
        await _getResources(
          { trust_business: ['project_stage'] },
          `filter[business_trust_real_estate_project_id]=${projectId}`
        )
      }
    }

    // Etapa → Propiedades
    if (projectStageId !== filtersFormat.value['filter[project_stage_id]']) {
      filterComponentRef.value?.cleanFiltersByNames(['nomenclature_id'])

      _resetKeys({
        trust_business: ['business_trust_properties'],
      })

      if (projectStageId) {
        await _getResources(
          { trust_business: ['business_trust_properties'] },
          `filter[business_trust_real_estate_project_stage_id]=${projectStageId}`
        )
      }
    }

    filtersFormat.value = {
      ...$filters,
      page: filtersFormat.value.page,
      rows: filtersFormat.value.rows,
    }
  }

  return {
    headerProperties,
    filterComponentRef,
    filterConfig,
    tableProperties,
    deleteModalRef,
    alertModalConfig,
    handleFilterUpdate,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    openModalDelete,
    handleDelete,
    validateRouter,
  }
}

export default usePaymentPlanList

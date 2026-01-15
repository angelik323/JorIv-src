// Vue - Vue Router - Pinia - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IFiduciaryInvestmentPlansAccountList } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'
import { ITabs, StatusID } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Utils
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'

const useAccountManagementList = () => {
  const { getFormatNumber, formatParamsCustom, defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    _clearData,
    _exportExcel,
    _updateStatus,
    _getBankingAccountList,
    _getByIdFiduciaryInvestmentPlan,
  } = useFiduciaryInvestmentPlanStore('v1')

  const {
    banking_account_list,
    fiduciary_investment_plan_pages,
    fiduciary_investment_plan_response,
  } = storeToRefs(useFiduciaryInvestmentPlanStore('v1'))

  const searchId = +route.params.id

  const filtersFormat = ref<Record<string, string | number>>({
    'filter[plan_id]': searchId,
  })
  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
    status_id: null as number | null,
  })

  const headerProps = {
    title: 'Registro y gestión cuentas bancarias giro',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión fiduciarios',
        route: 'FiduciaryInvestmentPlanList',
      },
      {
        label: 'Registro y gestión cuentas bancarias giro',
        route: 'AccountManagementList',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tableProps = ref({
    title: 'Listado cuentas inscritas',
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        align: 'left',
        sortable: false,
        field: (row: IFiduciaryInvestmentPlansAccountList) =>
          tableProps.value.rows.indexOf(row) + 1,
      },
      {
        name: 'payment_method',
        field: (item) => item.payment_method?.code,
        required: false,
        label: 'Forma de pago',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description',
        field: (item) => item.payment_method?.type_mean_of_payments,
        required: false,
        label: 'Descripción',
        align: 'left',
        sortable: true,
      },
      {
        name: 'destination',
        field: (item) =>
          item.destination_bank
            ? `${item.destination_bank?.bank_code} - ${item.destination_bank?.description}`
            : `${item.destination_fund?.fund_code} - ${item.destination_fund?.fund_name}`,
        required: false,
        label: 'Destino (Banco/Fondo)',
        align: 'left',
        sortable: true,
      },
      {
        name: 'destination_number',
        field: (item) =>
          item.account_number ?? item.destination_plan?.code ?? '',
        required: false,
        label: 'Cuenta/Plan',
        align: 'left',
        sortable: true,
      },
      {
        name: 'account_type',
        field: (item) => item.account_type,
        required: false,
        label: 'Tipo de cuenta',
        align: 'left',
        sortable: true,
      },
      {
        name: 'identification_type',
        field: (item) => item.identification_type,
        required: false,
        label: 'Tipo de identificación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'identification_number',
        field: (item) => item.identification_number,
        required: false,
        label: 'Número de identificación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        field: (item) => item.people_name,
        required: false,
        label: 'Nombre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'operation_count_per_day',
        field: (item) => item.operation_count_per_day,
        required: false,
        label: 'Cantidad de operaciones por día',
        align: 'left',
        sortable: true,
      },
      {
        name: 'maximum_value_per_operation',
        field: (item) => getFormatNumber(item.maximum_value_per_operation),
        required: false,
        label: 'Valor por operación máximo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'total_amount_per_day',
        field: (item) => getFormatNumber(item.total_amount_per_day),
        required: false,
        label: 'Monto total al día',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IFiduciaryInvestmentPlansAccountList[],
    pages: fiduciary_investment_plan_pages.value,
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const exportExcel = async () => {
    if (!searchId) return

    const ids = banking_account_list.value
      .map((item) => item.id ?? null)
      .filter((id): id is number => id !== null)
      .join('&ids[]=')

    const xlsResponse = await _exportExcel(ids)

    if (xlsResponse) {
      createAndDownloadBlobByArrayBuffer(
        xlsResponse,
        `Reporte_cuentas_inscritas`,
        new Date()
      )
    }
  }

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const setAlertModalDescription = (statusId: number) => {
    const action = statusId === StatusID.ACTIVE ? 'inactivar' : 'activar'
    return `¿Desea ${action} esta cuenta?`
  }

  const changeStatusAction = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return

    await _updateStatus(alertModalConfig.value.id)
    await listAction(formatParamsCustom(filtersFormat.value))

    openMainLoader(false)
  }

  const openAlertModal = async (row: IFiduciaryInvestmentPlansAccountList) => {
    if (!row.id) return
    alertModalConfig.value.description = setAlertModalDescription(
      Number(row.inscription_status?.status_id) ?? 0
    )
    alertModalConfig.value.id = row.id
    alertModalConfig.value.status_id = Number(row.inscription_status?.status_id)
    await alertModalRef.value.openModal()
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getBankingAccountList(filters)
    await _getByIdFiduciaryInvestmentPlan(searchId)

    tableProps.value.loading = false
  }

  const handleGoTo = (
    goURL: string,
    id: number | null = null,
    fund_id: number | null = null
  ) => {
    if (id)
      goToURL(
        goURL,
        { id },
        {
          query: {
            fund_id:
              fiduciary_investment_plan_response.value?.collective_investment_fund_id?.toString() ||
              fund_id?.toString(),
          },
        }
      )
    else goToURL(goURL)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    await listAction(formatParamsCustom(filtersFormat.value))
  }

  onMounted(async () => {
    _clearData()

    openMainLoader(true)

    await listAction(formatParamsCustom(filtersFormat.value))
    await _getByIdFiduciaryInvestmentPlan(searchId)

    openMainLoader(false)
  })

  watch(
    () => banking_account_list.value,
    () => {
      tableProps.value.rows = banking_account_list.value
      tableProps.value.pages.currentPage =
        fiduciary_investment_plan_pages.value.currentPage
      tableProps.value.pages.lastPage =
        fiduciary_investment_plan_pages.value.lastPage
    },
    { deep: true }
  )

  return {
    tabs,
    searchId,
    tabActive,
    tableProps,
    handleGoTo,
    updatePage,
    headerProps,
    isRowActive,
    exportExcel,
    tabActiveIdx,
    alertModalRef,
    openAlertModal,
    alertModalConfig,
    defaultIconsLucide,
    changeStatusAction,
    fiduciary_investment_plan_response,
  }
}

export default useAccountManagementList

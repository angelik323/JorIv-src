import { ref, onBeforeMount, onMounted, watch } from 'vue'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useInvoiceGenerationStore, useResourceManagerStore } from '@/stores'

// Interfaces
import {
  IInvoiceGenerationForm,
  IInvoiceGenerationList,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

const useInvoiceGenerationCreate = () => {
  const { _getInvoiceGenerationList, _createInvoiceGeneration, _clearData } =
    useInvoiceGenerationStore('v1')

  const { invoice_generation_list, invoice_generation_pages } = storeToRefs(
    useInvoiceGenerationStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: ['business_trusts'],
  }

  // Data de formularios
  const basic_data_form = ref<IInvoiceGenerationForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const utils = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const headerProps = {
    title: 'Generar facturas de comisiones fiduciarias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Generación de facturas',
        route: 'GenerationCommissionInvoicesList',
      },
      {
        label: 'Crear',
        route: 'InvoiceGenerationCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: utils.defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const tableProps = ref({
    title: 'Listado de comisiones autorizadas',
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
        name: 'business_code_snapshot',
        field: 'settled_commission',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        sortable: true,
        format: (val) =>
          val.business_code_snapshot + ' - ' + val.business_name_snapshot,
      },
      {
        name: 'observation',
        field: 'settled_commission',
        required: true,
        label: 'Concepto',
        align: 'left',
        sortable: true,
        format: (val) => val.observation,
      },
      {
        name: 'commission_class_catalog',
        field: 'settled_commission',
        required: true,
        label: 'Clase de comisión',
        align: 'left',
        sortable: true,
        format: (val) => val.commission_class_catalog,
      },
      {
        name: 'commission_type_catalog',
        field: 'commission_type_catalog',
        required: true,
        label: 'Tipo de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'periodicity',
        field: 'settled_commission',
        required: true,
        label: 'Periodicidad',
        align: 'left',
        sortable: true,
        format: (val) => val.periodicity,
      },
      {
        name: 'collection',
        field: 'settled_commission',
        required: true,
        label: 'Cobro',
        align: 'left',
        sortable: true,
        format: (val) => val.collection ?? '-',
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'actions',
      },
      {
        name: 'settlement_date',
        field: 'settled_commission',
        required: true,
        label: 'Fecha de liquidación',
        align: 'left',
        sortable: true,
        format: (val) => val.settlement_date ?? '-',
      },
      {
        name: 'base_amount',
        field: 'settled_commission',
        required: true,
        label: 'Valor base',
        align: 'left',
        sortable: true,
        format: (val) =>
          utils.formatCurrencyString(val.base_amount, {
            currency: 'COP',
            locale: 'es-CO',
          }),
      },
      {
        name: 'iva_amount',
        field: 'settled_commission',
        required: true,
        label: 'IVA',
        align: 'left',
        sortable: true,
        format: (val) =>
          utils.formatCurrencyString(val.iva_amount, {
            currency: 'COP',
            locale: 'es-CO',
          }),
      },
      {
        name: 'rete_fuente_amount',
        field: 'settled_commission',
        required: true,
        label: 'Rete fuente',
        align: 'left',
        sortable: true,
        format: (val) =>
          utils.formatCurrencyString(val.rete_fuente_amount ?? 0, {
            currency: 'COP',
            locale: 'es-CO',
          }),
      },
      {
        name: 'rete_ica_amount',
        field: 'settled_commission',
        required: true,
        label: 'Rete ICA',
        align: 'left',
        sortable: true,
        format: (val) =>
          utils.formatCurrencyString(val.rete_ica_amount ?? 0, {
            currency: 'COP',
            locale: 'es-CO',
          }),
      },
      {
        name: 'rete_iva_amount',
        field: 'settled_commission',
        required: true,
        label: 'Rete IVA',
        align: 'left',
        sortable: true,
        format: (val) =>
          utils.formatCurrencyString(val.rete_iva_amount ?? 0, {
            currency: 'COP',
            locale: 'es-CO',
          }),
      },
      {
        name: 'total_amount',
        field: 'settled_commission',
        required: true,
        label: 'Valor total',
        align: 'left',
        sortable: true,
        format: (val) =>
          utils.formatCurrencyString(val.total_amount, {
            currency: 'COP',
            locale: 'es-CO',
          }),
      },
    ] as QTable['columns'],
    rows: [] as IInvoiceGenerationList[],
    pages: invoice_generation_pages.value,
  })

  // Datos básicos form
  const makeBaseInfoRequest = (data: IInvoiceGenerationForm | null) => {
    if (!data) return {}

    const request: Partial<IInvoiceGenerationForm> = {
      method: data.method,
      payday: data.payday,
      ids: data.rows?.map(({ id }) => id) || [],
    }
    return utils.cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IInvoiceGenerationForm> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createInvoiceGeneration(payload)
    if (success) {
      goToURL('GenerationCommissionInvoicesList')
    }
    openMainLoader(false)
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
    'filter[status_id]': 12,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    if (basic_data_form.value) basic_data_form.value.rows = []
    tableProps.value.loading = true
    await _getInvoiceGenerationList(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  onBeforeMount(async () => {
    _clearData()
    _resetKeys(keys)
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getInvoiceGenerationList({
      ...filtersFormat.value,
    })
    await _getResources(keys, `filter[business_subtype_id]=20`)
    openMainLoader(false)
  })

  watch(
    invoice_generation_list,
    () => {
      tableProps.value.rows = [...invoice_generation_list.value]

      const { currentPage, lastPage } = invoice_generation_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    tableProps,
    utils,

    nextTab,
    backTab,
    onSubmit,
    updatePage,
    updatePerPage,
    goToURL,
  }
}

export default useInvoiceGenerationCreate

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import { IScheduleDeferralItem } from '@/interfaces/customs'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'

import {
  useResourceManagerStore,
  useAccountingResourceStore,
  useProcessDeferredStore,
} from '@/stores'
import { ITabs } from '@/interfaces/global'
import { useRouteValidator } from '@/composables/useRoutesValidator'

const useProcessDeferredList = () => {
  const { validateRouter } = useRouteValidator()
  const {
    _processDeferredVouchers,
    _getDeferredVouchers,
    _showDeferredVoucherDetail,
    _cleanProcessDeferredData,
    _resetDeferredSchedule,
  } = useProcessDeferredStore('v1')
  const { deferred_vouchers, selected_deferred_voucher, deferred_schedule } =
    storeToRefs(useProcessDeferredStore('v1'))
  const {
    deferred_schedule_business_trusts: business_trust,
    account_structures_active_revert_vouchers: account_structures,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const router = useRouter()

  const headerProps = {
    title: 'Procesar diferidos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Programar y procesar diferidos',
        route: 'ScheduleDeferralList',
      },
      {
        label: 'Procesar diferidos',
      },
    ],
    btn: {
      label: 'Programar',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const tableProps = ref({
    title: 'Comprobantes generados',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'period',
        required: true,
        label: 'Periodo',
        align: 'left',
        field: (row: IScheduleDeferralItem) => `${row.period}`,
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row: IScheduleDeferralItem) => `${row.business_trust}`,
        sortable: true,
      },
      {
        name: 'receipt_type',
        required: true,
        label: 'Tipo de comprobante',
        align: 'left',
        field: (row: IScheduleDeferralItem) => `${row.receipt_type.code}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'sub_receipt_type',
        required: true,
        label: 'Sub tipo de comprobante',
        align: 'left',
        field: (row: IScheduleDeferralItem) => `${row.sub_receipt_type.code}`,
        sortable: true,
        style: styleColumn(100),
      },
      {
        name: 'consecutive',
        required: true,
        label: 'Consecutivo',
        align: 'left',
        field: (row: IScheduleDeferralItem) => `${row.consecutive}`,
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
    rows: [] as IScheduleDeferralItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  watch(
    () => deferred_vouchers.value.list,
    () => {
      tableProps.value.rows = deferred_vouchers.value.list
    }
  )

  watch(
    () => deferred_vouchers.value.pages,
    () => {
      tableProps.value.pages = deferred_vouchers.value.pages
    }
  )

  const currentParams = ref<Record<string, string | number>>({})

  const updatePage = (page: number) => {
    currentParams.value.page = page

    _getDeferredVouchers(formatParamsCustom(currentParams.value))
  }

  const updatePerPage = (rowsPerPage: number) => {
    currentParams.value.rows = rowsPerPage
    currentParams.value.page = 1

    _getDeferredVouchers(formatParamsCustom(currentParams.value))
  }

  const basicForm = ref<{
    account_structure_id: number | null
    period: string | null
    from_business_trust_id: number | null
    to_business_trust_id: number | null
  }>({
    account_structure_id: null,
    period: null,
    from_business_trust_id: null,
    to_business_trust_id: null,
  })

  const selectStructure = (structure_id: number) => {
    if (basicForm.value.account_structure_id !== structure_id) {
      basicForm.value.from_business_trust_id = null
      basicForm.value.to_business_trust_id = null
      if (!structure_id) return
      const accountStructureFilter = `filter[account_structure_id]=${structure_id}`
      _getResources(
        {
          accounting: ['deferred_impairment_business_trusts'],
        },
        accountStructureFilter
      )
    }
    basicForm.value.account_structure_id = structure_id
  }

  const informationForm = ref()

  const isSelectiveRequest = ref(false)

  const processVouchers = async () => {
    if (!isSelectiveRequest.value && !(await informationForm.value?.validate()))
      return
    const payload = {
      account_structure_id: basicForm.value.account_structure_id!,
      period: basicForm.value.period!,
      from_business_trust_id: basicForm.value.from_business_trust_id!,
      to_business_trust_id: basicForm.value.to_business_trust_id!,
    }
    const response = await _processDeferredVouchers(payload)
    if (response) {
      currentParams.value = payload
      _getDeferredVouchers(formatParamsCustom(currentParams.value))
    }
    tableProps.value.loading = false
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const voucherModalRef = ref()

  const selectedVoucher = ref({})

  const viewVoucher = (row: IScheduleDeferralItem) => {
    selectedVoucher.value = row
    _showDeferredVoucherDetail(row.id)
    voucherModalRef.value.openModal()
  }

  const keys = {
    accounting: ['account_structures_active'],
  }

  onMounted(async () => {
    _cleanProcessDeferredData()
    if (deferred_schedule.value?.id) {
      isSelectiveRequest.value = true
      basicForm.value.account_structure_id =
        deferred_schedule.value.structure.id
      basicForm.value.period = deferred_schedule.value.period
      basicForm.value.from_business_trust_id =
        deferred_schedule.value.business_trust.id
      basicForm.value.to_business_trust_id =
        deferred_schedule.value.business_trust.id
      processVouchers()
    }
    tableProps.value.rows = deferred_vouchers.value.list
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetDeferredSchedule()
    _cleanProcessDeferredData()
    _resetKeys({
      accounting: [...keys.accounting, 'deferred_schedule_business_trusts'],
    })
  })

  return {
    // Props
    basicForm,
    informationForm,
    headerProps,
    tableProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    business_trust,
    account_structures,
    voucherModalRef,
    selected_deferred_voucher,
    isSelectiveRequest,
    deferred_schedule,
    // Methods
    selectStructure,
    viewVoucher,
    handleGoTo,
    processVouchers,
    updatePage,
    updatePerPage,
    validateRouter,
  }
}

export default useProcessDeferredList

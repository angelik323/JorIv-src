import { useMainLoader, useUtils } from '@/composables'
import { IUploadAccountingVoucherView } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useUploadAccountingVouchersStoreV1 } from '@/stores/accounting/upload-accounting-vouchers/upload-accounting-vouchers-v1'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useUploadAccountingVouchersView = () => {
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const uploadAccountingVouchersId = +route.params.id
  const { uploadAccountingVoucherView } = storeToRefs(
    useUploadAccountingVouchersStoreV1()
  )
  const { _showUploadAccountingVoucher, _exportExcelUploadVouchers } =
    useUploadAccountingVouchersStoreV1()

  const tabs = ref<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: useUtils().defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref<string>(tabs.value[0].name)
  const headerProperties = ref<{
    title: string
    breadcrumbs: Array<{ label: string; route: string }>
  }>({
    title: 'Ver comprobantes contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Cargue de comprobantes contables',
        route: 'UploadAccountingVouchersList',
      },
      {
        label: 'Crear',
        route: 'UploadAccountingVouchersImport',
      },
      {
        label: 'Ver',
        route: '',
      },
      {
        label: uploadAccountingVouchersId.toString(),
        route: '',
      },
    ],
  })

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'register',
        label: 'Registro',
        field: 'id',
        sortable: true,
        align: 'left',
      },
      {
        name: 'nature',
        label: 'Naturaleza',
        field: 'nature',
        sortable: true,
        align: 'left',
      },
      {
        name: 'account',
        label: 'Cuenta',
        field: (row: IUploadAccountingVoucherView) =>
          `${row.account?.code} - ${row.account?.name}` || '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'third_party',
        label: 'Auxiliar',
        field: (row: IUploadAccountingVoucherView) =>
          `${row.third_party?.document || ''} - ${
            row.third_party?.commercial_registration || ''
          }`,
        sortable: true,
        align: 'left',
      },
      {
        name: 'cost_center',
        label: 'Centro de costo',
        field: (row: IUploadAccountingVoucherView) =>
          `${row.cost_center?.code || ''} - ${row.cost_center?.name || ''}`,
        sortable: true,
        align: 'left',
      },
      {
        name: 'register_detail',
        label: 'Detalle del registro',
        field: 'register_detail',
        sortable: true,
        align: 'left',
      },
      {
        name: 'debit',
        label: 'Débito',
        field: (row: IUploadAccountingVoucherView) => row.debit ?? 0,
        sortable: true,
        align: 'center',
      },
      {
        name: 'credit',
        label: 'Crédito',
        field: (row: IUploadAccountingVoucherView) => row.credit ?? 0,
        sortable: true,
        align: 'center',
      },
      {
        name: 'foreign_currency',
        label: 'Moneda extranjera',
        field: 'foreign_currency',
        sortable: true,
        align: 'center',
      },
    ] as QTable['columns'],
    rows: uploadAccountingVoucherView.value.voucher_data || [],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const tabActiveIdx = ref<number>(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )
  const tabActive = ref<string>(tabs.value[0].name)

  const handlerGoToList = () => {
    router.push({ name: 'UploadAccountingVouchersList' })
  }

  const downloadTemplateExcel = () => {
    _exportExcelUploadVouchers(uploadAccountingVouchersId)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _showUploadAccountingVoucher(uploadAccountingVouchersId)
    openMainLoader(false)
  })

  return {
    tableProps,
    uploadAccountingVoucherView,
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    tabActive,
    handlerGoToList,
    downloadTemplateExcel,
  }
}

export default useUploadAccountingVouchersView

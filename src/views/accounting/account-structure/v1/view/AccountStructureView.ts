import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { QTable } from 'quasar'
import { ITabs } from '@/interfaces/global'
import {
  IAccountStructureResponse,
  ICatalogLimitResponse,
} from '@/interfaces/customs'

import { defaultIconsLucide } from '@/utils'

import { useAccountStructuresStore } from '@/stores'

const useAccountStructureView = () => {
  const router = useRouter()
  const route = useRoute()
  const accountStructureId = +route.params.id
  const { _getAccountStructure, accounting_catalog_type } =
    useAccountStructuresStore('v1')

  const accountStructure = ref<IAccountStructureResponse>()

  const isAccountingCatalog = computed(
    () => accountStructure?.value?.type.value === accounting_catalog_type
  )

  const headerProps = {
    title: 'Ver estructura de cuenta',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Estructuras de cuentas',
        route: 'AccountStructureList',
      },
      { label: 'Ver' },
      {
        label: `${accountStructureId}`,
        route: 'AccountStructureview',
        params: {
          id: accountStructureId,
        },
      },
    ],
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

  const catalogLimitsTableProps = ref({
    title: 'Límites de cuentas',
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
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.description}`,
        sortable: true,
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.nature.value}`,
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.type.value}`,
        sortable: true,
      },
      {
        name: 'group',
        required: true,
        label: 'Grupo',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.group.value}`,
        sortable: true,
      },
      {
        name: 'from_account',
        required: true,
        label: 'Desde cuenta',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.from_account}`,
        sortable: true,
      },
      {
        name: 'to_account',
        required: true,
        label: 'Hasta cuenta',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.to_account}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as ICatalogLimitResponse[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const goToList = () => {
    router.push({ name: 'AccountStructureList' })
  }

  onMounted(async () => {
    _getAccountStructure(accountStructureId).then((accountStructureInfo) => {
      accountStructure.value = accountStructureInfo || {
        id: 0,
        code: '',
        structure: '',
        type: {
          name: '',
          value: '',
        },
        status: {
          id: 0,
          name: '',
        },
        purpose: '',
        catalog_limits: [] as ICatalogLimitResponse[],
      }
      if (accountStructure.value)
        catalogLimitsTableProps.value.rows =
          accountStructure.value.catalog_limits ?? []
    })
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    catalogLimitsTableProps,
    accountStructure,
    isAccountingCatalog,
    goToList,
  }
}

export default useAccountStructureView

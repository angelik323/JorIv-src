import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'
import { useCollectionAccountingBlocksStore } from '@/stores'
import { ICollectionAccountingBlocksResponse } from '@/interfaces/customs/treasury/CollectionAccountingBlocks'

const useAccountingParametersCollectionsView = () => {
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const collectionAccountingBlocksEntitieId = +route.params.id

  const {
    type_accounting_blocks_collections_request,
    collectionAccountingBlockSelected
  } = storeToRefs(useCollectionAccountingBlocksStore('v1'))

  const {
    _getByIdCollectionAccountingBlocks,
    _setDataCollectionAccountingBlockSelected
  } = useCollectionAccountingBlocksStore('v1')

  const headerProperties = ref<{
    title: string
    breadcrumbs: Array<{ label: string; route: string }>}>({
    title: 'Ver parámetros contables de recaudo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Bloques contables de recaudo',
        route: 'CollectionAccountingBlocksList',
      },
      {
        label: 'Parámetros contables de recaudo',
        route: '',
      },
      {
        label: collectionAccountingBlocksEntitieId.toString(),
        route: '',
      },
    ],
  })

  const tabs = ref<ITabs[]>([
    {
      name: 'acounting-collection-param',
      label: 'Parámetros contables de recaudo',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'commission',
      label: 'Comisiones',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'commission-param',
      label: 'Parámetros de comisiones',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])
  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(filteredTabs.value.findIndex((tab) => tab.name === tabActive.value))

  const tableProps = ref({
    title: 'Bloques contable',
    loading: false,
    columns: [
      {
        name: 'code',
        field: 'code',
        label: 'Código bloque',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'description',
        field: 'description',
        label: 'Nombre del bloque',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'collection_structure_code',
        field: (row: ICollectionAccountingBlocksResponse) => `${row.collection_structure?.code} - ${row.collection_structure?.purpose}`,
        label: 'Estructura de recaudos',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'accounting_structure_code',
        field: (row: ICollectionAccountingBlocksResponse) => `${row.accounting_structure?.code} - ${row.accounting_structure?.purpose}`,
        label: 'Estructura contable',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'cost_center_structure_code',
        field: (row: ICollectionAccountingBlocksResponse) => `${(row.cost_center_structure?.code ?? '')} - ${(row.cost_center_structure?.purpose ?? '')}`,
        label: 'Estructura centro de costo',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'cash_flow_structure_code',
        field: (row: ICollectionAccountingBlocksResponse) => `${(row.cash_flow_structure?.code ?? '')} - ${(row.cash_flow_structure?.purpose ?? '')}`,
        label: 'Estructura flujo de caja',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'budget_structure_code',
        field: (row: ICollectionAccountingBlocksResponse) => `${(row.budget_structure?.budget_item_code ?? '')} - ${(row.budget_structure?.formatted_structure ?? '')}`,
        label: 'Estructura presupuesto',
        align: 'left',
        sortable: true,
        required: true,
      },
    ] as QTable['columns'],
    rows: [] as ICollectionAccountingBlocksResponse[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const handlerGoTo = (goURL: string): void => {
    router.push({ name: goURL })
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdCollectionAccountingBlocks(collectionAccountingBlocksEntitieId)
    await _setDataCollectionAccountingBlockSelected(collectionAccountingBlocksEntitieId || 0)
    openMainLoader(false)
  })

  watch(type_accounting_blocks_collections_request,
    () => {
      tableProps.value.rows = [{...type_accounting_blocks_collections_request.value}]
    }
  )

  return {
    filteredTabs,
    tabActive,
    tabActiveIdx,
    headerProperties,
    tableProps,
    collectionAccountingBlockSelected,

    handlerGoTo,
  }
}
export default useAccountingParametersCollectionsView

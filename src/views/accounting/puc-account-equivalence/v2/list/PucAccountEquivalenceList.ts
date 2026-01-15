import { ref, onMounted, watch, onUnmounted } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { formatParamsCustom } from '@/utils'
import { useMainLoader, useRouteValidator } from '@/composables'
import {
  usePucAccountEquivalenceStore,
  useResourceManagerStore,
  useAccountingResourceStore,
} from '@/stores/'
import { IAccountEquivalenceRowV2, IFieldFilters } from '@/interfaces/customs'

const usePucAccountEquivalenceList = () => {
  let perPage = 20
  const filterSourceExcel = ref(0)
  const filterEquivalentExcel = ref(0)
  const modalRef = ref()
  const filteredId = ref<string | number>(0)
  const newAccountEquivalence = ref()
  const selectedOrigin = ref()
  const originStructurePuc = ref<
    { value: string | number; label: string; id?: number }[]
  >([])
  const equivalentStructurePuc = ref<
    { value: string | number; label: string; id?: number }[]
  >([])
  const idAccountOrigin = ref()
  const idAccountDestination = ref()
  const purposeStructure = ref()
  const purposeEquivalent = ref()
  const accountReference = ref()
  const structureCode = ref()
  const selectedSourceAccountId = ref()
  const { account_equivalence_list, account_equivalence_pages, account_edit } =
    storeToRefs(usePucAccountEquivalenceStore('v2'))
  const { validateRouter } = useRouteValidator()
  const {
    _getAccountEquivalences,
    _exportAccountingEquivalence,
    _createAccountEquivalence,
  } = usePucAccountEquivalenceStore('v2')

  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    source_account_structures,
    equivalent_account_structures,
    accounts_by_structure,
    accounts_by_structure_id,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const filtersFormat = ref<Record<string, string | number>>({})
  const isAccountEquivalenceEmpty = ref(true)
  const customColumns = ['actions']
  const showState = ref(0)
  const equivalentValue = ref()
  const createModal = ref(true)
  const isUploading = ref(false)
  const selectedOriginStructure = ref()

  const modelsData = ref<{
    source_structure_id: number | null | string
    source_account_id: number | null | string
    puc_structure_origin_id: number | null | string
    equivalent_structure_id: number | null | string
    equivalent_account_id: number | null
  }>({
    source_structure_id: null,
    source_account_id: null,
    puc_structure_origin_id: null,
    equivalent_structure_id: null,
    equivalent_account_id: null,
  })

  const pendingStructureValue = ref<string | null>(null)
  const filtersRef = ref()

  const headerProperties = {
    title: 'Configuración PUC equivalente - fiscal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Configuración PUC equivalente - fiscal',
        route: 'PucAccountEquivalenceList',
      },
    ],
  }
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'source_structure_id',
      label: 'Código de estructura origen *',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: source_account_structures,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'structure',
      label: 'Estructura *',
      type: 'q-input',
      value: pendingStructureValue.value,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'equivalent_structure_id',
      label: 'Código de estructura destino *',
      type: 'q-select',
      value: null,
      autocomplete: true,
      class: 'col-12 col-md-3',
      options: equivalent_account_structures,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'structure_equivalent',
      label: 'Estructura *',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'source_account_id',
      label: 'Puc estructura origen',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: originStructurePuc,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      hide: false,
    },
    {
      name: 'equivalent_account_id',
      label: 'Puc estructura destino',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: equivalentStructurePuc,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      hide: false,
    },
  ])
  const tableProperties = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IAccountEquivalenceRowV2[]
    pages: typeof account_equivalence_pages
    rowsPerPage: number
  }>({
    title: 'Listado PUC equivalente - fiscal',
    loading: false,
    columns: [
      {
        name: 'account_id',
        label: '#',
        field: 'account_id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'source_structure_id',
        label: 'Estructura origen',
        field: (row) => row.source_structure_id,
        align: 'left',
        sortable: false,
      },
      {
        name: 'account_code',
        label: 'Código de la cuenta',
        field: 'account_code',
        align: 'left',
        sortable: false,
      },
      {
        name: 'account_name',
        label: 'Nombre de la cuenta',
        field: 'account_name',
        align: 'left',
        sortable: false,
      },
      {
        name: 'equivalent_structure_id',
        label: 'Estructura destino',
        field: (row) => row.equivalence?.equivalent_structure_id,
        align: 'left',
        sortable: false,
      },
      {
        name: 'account_code_equivalence',
        label: 'Código de la cuenta',
        field: (row) => row.equivalence?.equivalent_account_code,
        align: 'left',
        sortable: true,
      },
      {
        name: 'account_name_equivalence',
        label: 'Nombre de la cuenta',
        field: (row) => row.equivalence?.equivalent_account_name,
        align: 'left',
        sortable: false,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [],
    pages: account_equivalence_pages,
    rowsPerPage: perPage,
  })
  const handleFilter = ($filter: Record<string, string>) => {
    delete $filter['filter[structure]']
    delete $filter['filter[structure_equivalent]']
    filtersFormat.value = { ...$filter }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleUpdateValues = (
    filters: Record<string, string | number | null>
  ) => {
    const structureId = filters['filter[source_structure_id]']
    let value = ''
    if (structureId) {
      const selectedStructure = source_account_structures.value.find(
        (item) => item.id === Number(structureId)
      )
      value = selectedStructure?.structure ?? ''
      filterSourceExcel.value = selectedStructure?.id ?? 0
      purposeStructure.value = selectedStructure?.label
      selectedOriginStructure.value = selectedStructure?.structure ?? ''
      structureCode.value = selectedStructure?.code ?? ''
    }
    if (filtersRef.value) {
      filtersRef.value.setFieldValueByName('structure', value)
      pendingStructureValue.value = null
    } else {
      pendingStructureValue.value = value
    }

    const equivalentStructureId = filters['filter[equivalent_structure_id]']

    if (equivalentStructureId) {
      const selectedEquivalent = equivalent_account_structures.value.find(
        (item) => item.id === Number(equivalentStructureId)
      )
      filterEquivalentExcel.value = selectedEquivalent?.id ?? 0
      equivalentValue.value = selectedEquivalent?.structure ?? ''
      filteredId.value = selectedEquivalent?.id ?? 0
      purposeEquivalent.value = selectedEquivalent?.label ?? ''
    }
    if (filtersRef.value) {
      filtersRef.value.setFieldValueByName(
        'structure_equivalent',
        equivalentValue
      )
    }
  }

  const handleOptions = async (row: IAccountEquivalenceRowV2) => {
    selectedSourceAccountId.value = row.account_id
    if (row && account_edit.value) {
      modelsData.value.source_structure_id = purposeStructure?.value ?? ''
      modelsData.value.source_account_id = selectedOriginStructure?.value ?? ''
      modelsData.value.equivalent_structure_id = purposeEquivalent.value ?? ''
      modelsData.value.equivalent_account_id = equivalentValue.value ?? ''
      modelsData.value.puc_structure_origin_id = row.account_code ?? ''
    }
    accountReference.value = row.equivalence?.equivalent_account_code
    modalRef.value = !modalRef.value
    createModal.value = true
  }

  const exportExcelData = async () => {
    await _exportAccountingEquivalence(
      filterSourceExcel.value,
      filterEquivalentExcel.value
    )
    filterSourceExcel.value = 0
    filterEquivalentExcel.value = 0
  }

  const listAction = async (filters: string = '') => {
    tableProperties.value.loading = true
    tableProperties.value.rows = []

    await _getAccountEquivalences(filters)
    tableProperties.value.loading = false
    const hasResults = account_equivalence_list.value.length > 0
    showState.value = filters ? 1 : 0
    isAccountEquivalenceEmpty.value = !hasResults
  }

  const createDataInformation = async () => {
    openMainLoader(true)
    const payload = {
      equivalences: [
        {
          source_structure_id: filterSourceExcel.value ?? null,
          source_account_id: selectedSourceAccountId.value,
          equivalent_structure_id: filterEquivalentExcel.value,
          equivalent_account_id: modelsData.value.equivalent_account_id ?? null,
        },
      ],
    }
    await _createAccountEquivalence(payload)
    modalRef.value = false
    handleClearFilters()
    openMainLoader(false)
  }
  const updatePage = (page: number) => {
    filtersFormat.value = { ...filtersFormat.value, page, rows: perPage }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = { ...filtersFormat.value, rows: perPage }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    tableProperties.value.rows = []
    filterEquivalentExcel.value = 0
    filterSourceExcel.value = 0
  }

  watch(
    () => account_equivalence_list.value,
    () => {
      tableProperties.value.rows = account_equivalence_list.value
      tableProperties.value.pages = account_equivalence_pages.value
    }
  )

  watch(
    () => filterSourceExcel.value,
    async (newVal) => {
      if (newVal) {
        await _getResources({
          accounting: [
            `accounts_by_structure&filter[account_structure_id]=${filterSourceExcel.value}&filter[type]=Operativo`,
          ],
        }).then(() => {
          originStructurePuc.value = accounts_by_structure.value.map(
            (item) => ({
              value: item.value,
              label: item.code ?? '',
            })
          )
        })
        const matched = accounts_by_structure_id.value.find(
          (item) => item.account_structure_id === filterSourceExcel.value
        )
        idAccountOrigin.value = matched ? matched.id : null

        const matchedAccounting = accounts_by_structure_id.value.find(
          (item) => item.account_structure_id === filterSourceExcel.value
        )
        selectedOrigin.value = matchedAccounting ? matchedAccounting.code : null
      }
    }
  )

  watch(
    () => filterEquivalentExcel.value,
    async () => {
      await _getResources({
        accounting: [
          `accounts_by_structure&filter[account_structure_id]=${filterEquivalentExcel.value}&filter[type]=Operativo`,
        ],
      }).then(() => {
        equivalentStructurePuc.value = accounts_by_structure_id.value.map(
          (item) => ({
            value: item.id ?? '',
            label: item.code ?? '',
          })
        )
      })
      const matched = accounts_by_structure_id.value.find(
        (item) => item.account_structure_id === filterEquivalentExcel.value
      )
      idAccountDestination.value = matched ? matched.id : null
    }
  )

  onMounted(async () => {
    await _getResources({
      accounting: [
        'source_account_structures',
        'equivalent_account_structures',
      ],
    })
  })

  onUnmounted(() => {
    _resetKeys({
      accounting: [
        'source_account_structures',
        'equivalent_account_structures',
      ],
    })
  })

  return {
    filtersRef,
    filterConfig,
    customColumns,
    modelsData,
    tableProperties,
    headerProperties,
    modalRef,
    createModal,
    newAccountEquivalence,
    isUploading,
    filterSourceExcel,
    equivalentStructurePuc,
    selectedOrigin,
    accounts_by_structure_id,
    accountReference,
    equivalentValue,
    updatePage,
    handleFilter,
    handleOptions,
    handleClearFilters,
    updatePerPage,
    exportExcelData,
    createDataInformation,
    handleUpdateValues,
    validateRouter,
    structureCode,
  }
}

export default usePucAccountEquivalenceList

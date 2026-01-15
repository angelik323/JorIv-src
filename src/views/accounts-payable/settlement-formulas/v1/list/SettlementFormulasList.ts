// Vue - pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  ISettlementFormulasItem,
  ISettlementFormulaVariablesMap,
} from '@/interfaces/customs/accounts-payable/SettlementFormulas'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

//Store
import { useSettlementFormulasStore } from '@/stores/accounts-payable/settlement-formulas'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useSettlementFormulasList = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { settlement_formulas_list, settlement_formulas_pages } = storeToRefs(
    useSettlementFormulasStore('v1')
  )

  const { _getSettlementFormulasList, _deleteSettlementFormulas, _clearData } =
    useSettlementFormulasStore('v1')

  const { settlement_formula_person_types } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const { fiscal_responsability } = storeToRefs(useAssetResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const { is_required } = useRules()

  const showState = ref(false)
  const isSettlementFormulasListEmpty = ref(true)

  const alertModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar la fórmula de liquidación?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as number | null,
  })

  const headerProps = {
    title: 'Fórmulas de liquidación',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Fórmulas de liquidación',
        route: 'SettlementFormulasList',
      },
    ],
    btn: {
      icon: defaultIconsLucide.plusCircleOutline,
      label: 'Crear',
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'person_type',
      label: 'Tipo de persona*',
      type: 'q-select',
      value: 'Todos',
      class: 'col-6',
      options: settlement_formula_person_types,
      rules: [
        (val: string) => is_required(val, 'El tipo de persona es requerido'),
      ],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'fiscal_responsibility',
      label: 'Responsabilidad fiscal*',
      type: 'q-select',
      value: 'Todos',
      class: 'col-6',
      options: fiscal_responsability,
      rules: [
        (val: string) =>
          is_required(val, 'La responsabilidad fiscal es requerida'),
      ],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<ISettlementFormulasItem>>({
    title: 'Listado de fórmulas de liquidación',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: false,
        label: 'Código de fórmula',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre de fórmula',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'applies_withholding_tax',
        required: false,
        label: '¿Aplica retención en la fuente?',
        align: 'center',
        field: 'applies_withholding_tax',
        sortable: true,
      },
      {
        name: 'withholding_tax_liquidation_concept',
        required: false,
        label: 'Concepto de liquidación retención en la fuente',
        align: 'left',
        field: 'withholding_tax_liquidation_concept',
        sortable: true,
      },
      {
        name: 'applies_vat',
        required: false,
        label: '¿Aplica IVA?',
        align: 'center',
        field: 'applies_vat',
        sortable: true,
      },
      {
        name: 'vat_liquidation_concept',
        required: false,
        label: 'Concepto de liquidación IVA',
        align: 'left',
        field: 'vat_liquidation_concept',
        sortable: true,
      },
      {
        name: 'applies_vat_withholding',
        required: false,
        label: '¿Aplica retención de IVA?',
        align: 'center',
        field: 'applies_vat_withholding',
        sortable: true,
      },
      {
        name: 'vat_withholding_liquidation_concept',
        required: false,
        label: 'Concepto de liquidación retención de IVA',
        align: 'left',
        field: 'vat_withholding_liquidation_concept',
        sortable: true,
      },
      {
        name: 'applies_ica_withholding',
        required: false,
        label: '¿Aplica retención de ICA?',
        align: 'center',
        field: 'applies_ica_withholding',
        sortable: true,
      },
      {
        name: 'applies_territorial_taxes',
        required: false,
        label: '¿Aplica impuestos territoriales?',
        align: 'center',
        field: 'applies_territorial_taxes',
        sortable: true,
      },
      {
        name: 'territorial_taxes_liquidation_concept',
        required: false,
        label: 'Concepto de liquidación impuestos territoriales',
        align: 'left',
        field: 'territorial_taxes_liquidation_concept',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getSettlementFormulasList(filters)
    tableProps.value.loading = false
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const handleFilter = async ($filters: {
    'filter[person_type]'?: string
    'filter[fiscal_responsibility]'?: string
  }) => {
    if ($filters['filter[fiscal_responsibility]'] === 'Todos') {
      delete $filters['filter[fiscal_responsibility]']
    }

    if ($filters['filter[person_type]'] === 'Todos') {
      delete $filters['filter[person_type]']
    }

    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    _clearData()

    await listAction(filtersFormat.value)

    showState.value = true
    isSettlementFormulasListEmpty.value =
      settlement_formulas_list.value.length === 0
  }

  const handleClearFilters = async () => {
    _clearData()
    isSettlementFormulasListEmpty.value = true
    showState.value = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction(filtersFormat.value)
  }

  const updateRowsPerPage = (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    listAction(filtersFormat.value)
  }

  const openAlertModal = (row: ISettlementFormulasItem) => {
    alertModalConfig.value.id = row.id ?? null
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (await _deleteSettlementFormulas(alertModalConfig.value.id)) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const mapSettlementFormulasList = (list: ISettlementFormulasItem[]) => {
    //Mapeo de tipos de impuestos y variables a asignar valores en vista
    const taxTypeMap: ISettlementFormulaVariablesMap = {
      RFT: {
        applies: 'applies_withholding_tax',
        concept: 'withholding_tax_liquidation_concept',
      },
      IVA: {
        applies: 'applies_vat',
        concept: 'vat_liquidation_concept',
      },
      RIV: {
        applies: 'applies_vat_withholding',
        concept: 'vat_withholding_liquidation_concept',
      },
      RTE: {
        applies: 'applies_territorial_taxes',
        concept: 'territorial_taxes_liquidation_concept',
      },
      RIC: {
        applies: 'applies_ica_withholding',
      },
    }

    return list.map((row) => {
      const newRow = {
        ...row,
        applies_withholding_tax: false,
        withholding_tax_liquidation_concept: '-',
        applies_vat: false,
        vat_liquidation_concept: '-',
        applies_vat_withholding: false,
        vat_withholding_liquidation_concept: '-',
        applies_ica_withholding: false,
        applies_territorial_taxes: false,
        territorial_taxes_liquidation_concept: '-',
      }

      if (row.taxes && row.taxes.length > 0) {
        for (const tax of row.taxes) {
          const map = taxTypeMap[tax.tax_type]
          if (map) {
            newRow[map.applies] = tax.is_applicable

            if (map.concept && tax.is_applicable && tax.concept) {
              newRow[
                map.concept
              ] = `${tax.concept.class} - ${tax.concept.description}`
            }
          }
        }
      }

      return newRow
    })
  }

  watch(
    () => settlement_formulas_list.value,
    (val) => {
      tableProps.value.rows = mapSettlementFormulasList(val)

      const { currentPage, lastPage } = settlement_formulas_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  const keys = {
    accounts_payable: ['settlement_formula_person_types'],
    assets: ['fiscal_responsability'],
  }

  onMounted(async () => {
    await _getResources(keys)
    filterConfig.value[0].options.unshift({ label: 'Todos', value: 'Todos' })
    filterConfig.value[1].options.unshift({ label: 'Todos', value: 'Todos' })
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    defaultIconsLucide,
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isSettlementFormulasListEmpty,
    alertModalRef,
    alertModalConfig,
    handleFilter,
    handleClearFilters,
    openAlertModal,
    handleDelete,
    updatePage,
    updateRowsPerPage,
    goToURL,
    validateRouter,
  }
}

export default useSettlementFormulasList

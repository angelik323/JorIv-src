//Vue - Pinia
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
//Composables
import { useMainLoader, useUtils } from '@/composables'

//Interfaces
import {
  IAvailableTitlesForDivisionAndEncompassResource,
  IFractionationBasicDataForm,
  IFractionationDivisions,
  IFractionationGenericData,
  IFractionationTitles,
} from '@/interfaces/customs'
import { NonEditActionType } from '@/interfaces/global'

import {
  useFractionationTitlesStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'

//Utils
import moment from 'moment'

export const useInformationForm = (
  props: {
    action: NonEditActionType
    data?: IFractionationTitles | null
  },
  emit: Function
) => {
  const { pages } = storeToRefs(useFractionationTitlesStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')
  const descriptionPortfolio = ref('')
  const { openMainLoader } = useMainLoader()
  const nominalValueRef = ref()
  const disabledBtn = ref(false)
  const selectedId =
    ref<IAvailableTitlesForDivisionAndEncompassResource | null>(null)
  const {
    division_inversion_classes,
    investment_portfolio,
    available_titles_for_division_and_encompass_rows,
    operation_type,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { _validateFractionationTitle } = useFractionationTitlesStore('v1')
  const modalRef = ref(false)
  const informationFormRef = ref()
  const inversion_class = ref()
  const confirmChangeValue = ref(false)

  //Estructura de los modelos
  const initialModelsValue: IFractionationBasicDataForm = {
    investment_portfolio_id: null,
    operation_type_id: null,
    operation_date: moment().format('YYYY-MM-DD'),
    title_id: null,
    divisions: [],
  }
  const models = ref<typeof initialModelsValue>({ ...initialModelsValue })
  //Modelos auxiliares para manejo de data
  const divisionModels = ref<IFractionationDivisions>({
    nominal_value_fraction: null,
    buy_value_fraction: null,
    market_value_fraction: null,
    market_unit_value_fraction: null,
  })

  // Array para acumular todas las divisiones
  const accumulatedDivisions = ref<IFractionationDivisions[]>([])

  //Tabla de títulos disponibles para fraccionar
  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IFractionationGenericData[]
    pages: typeof pages
    rowsPerPage: number
  }>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'check',
        label: '',
        field: 'check',
        align: 'left',
        sortable: true,
      },
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'title_number',
        label: 'Número de título',
        field: 'title_number',
        align: 'left',
        sortable: true,
      },
      {
        name: 'inversion_class',
        label: 'Clase de inversión',
        field: (row) => row.inversion_class ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: (row) => row.status?.description ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'emitter',
        label: 'Emisor',
        field: (row) =>
          row.emitter
            ? `${row.emitter.document} - ${row.emitter.description}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'isin_code',
        label: 'ISIN',
        field: (row) => row.isin?.code ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'nemonic',
        label: 'Nemotécnico',
        field: (row) => row.isin?.mnemonic ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'paper',
        label: 'Papel',
        field: (row) =>
          row.paper ? `${row.paper.description} - ${row.paper.code}` : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'emission_date',
        label: 'Fecha de emisión',
        field: 'emission_date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'expiration_date',
        label: 'Fecha de vencimiento',
        field: 'expiration_date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'buyer_date',
        label: 'Fecha Compra',
        field: 'buyer_date',
        align: 'left',
        sortable: true,
      },
      {
        name: 'periodicity',
        label: 'Periodicidad',
        field: 'periodicity',
        align: 'left',
        sortable: true,
      },
      {
        name: 'modality',
        label: 'Modalidad',
        field: 'modality',
        align: 'left',
        sortable: true,
      },
      {
        name: 'rate_type',
        label: 'Tipo de tasa',
        field: 'rate_type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'rate_code',
        label: 'Código tasa',
        field: 'rate_code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'fixed_rate_value',
        label: 'Valor tasa',
        field: 'fixed_rate_value',
        align: 'left',
        sortable: true,
      },
      {
        name: 'spread',
        label: 'Spread',
        field: 'spread',
        align: 'left',
        sortable: true,
      },
      {
        name: 'currency',
        label: 'Moneda',
        field: (row) => row.currency?.code ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'currency_value',
        label: 'Valor moneda',
        field: (row) => useUtils().formatCurrency(row.currency?.value) ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'counterparty',
        label: 'Contraparte',
        field: (row) =>
          row.counterparty
            ? `${row.counterparty.description} - ${row.counterparty.document}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'nominal_value',
        label: 'Valor nominal',
        field: (row) => useUtils().formatCurrency(row.nominal_value) ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'purchase_value',
        label: 'Valor compra',
        field: (row) => useUtils().formatCurrency(row.purchase_value) ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'purchase_tir',
        label: 'TIR compra',
        field: (row) => row.tir?.capital ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'market_value',
        label: 'Valor de Mercado',
        field: (row) => useUtils().formatCurrency(row.market_value) ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'deposit',
        label: 'Depósito',
        field: (row) =>
          row.deposit
            ? `${row.deposit.description} - ${row.deposit.document}`
            : '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'compensation_system',
        label: 'Sistema compensación',
        field: 'compensation_system',
        align: 'left',
        sortable: true,
      },
      {
        name: 'folio_number',
        label: 'Folio',
        field: 'folio_number',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: pages,
    rowsPerPage: 25,
  })

  //Tabla de titulos fraccionados
  const tableFractionationTitles = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IFractionationGenericData[]
    pages: number
    rowsPerPage: number
  }>({
    title: 'Títulos a fraccionar',
    loading: false,
    columns: [
      {
        name: 'id',
        label: 'Identificador',
        field: (row) => row.id ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'title_number',
        label: 'Número de Título',
        field: (row) => row.title_number ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'Tipo de operación',
        label: 'Número de operación',
        field: (row) => row.purchasable_type ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'invertion_class',
        label: 'Clase de Inversión',
        field: (row) => row.inversion_class ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
        align: 'left',
        sortable: true,
      },
      {
        name: 'emitter',
        label: 'Emisor',
        field: (row) =>
          (row.emitter.description ?? '-') +
          ' - ' +
          (row.emitter.document ?? '-'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'isin_code',
        label: 'ISIN',
        field: (row) => row.isin.code ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'nemonic',
        label: 'Nemotécnico',
        field: (row) => row.isin.mnemonic ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'paper',
        label: 'Papel',
        field: (row) =>
          (row.paper.code ?? '-') + ' - ' + (row.paper.description ?? '-'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'issue_date',
        label: 'Fecha de emisión',
        field: (row) => row.emission_date ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'maturity_date',
        label: 'Fecha de vencimiento',
        field: (row) => row.expiration_date ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'purchase_date',
        label: 'Fecha Compra',
        field: (row) => row.buyer_date,
        align: 'left',
        sortable: true,
      },
      {
        name: 'periodicity',
        label: 'Periodicidad',
        field: (row) => row.periodicity,
        align: 'left',
        sortable: true,
      },
      {
        name: 'rate_mode',
        label: 'Modalidad',
        field: (row) => row.modality,
        align: 'left',
        sortable: true,
      },
      {
        name: 'rate_type',
        label: 'Tipo de tasa',
        field: (row) => row.rate_type,
        align: 'left',
        sortable: true,
      },
      {
        name: 'rate_code',
        label: 'Código tasa',
        field: (row) => row.rate_type,
        align: 'left',
        sortable: true,
      },
      {
        name: 'rate_value',
        label: 'Valor tasa',
        field: (row) => row.fixed_rate_value,
        align: 'left',
        sortable: true,
      },
      {
        name: 'spread',
        label: 'Spread',
        field: (row) => row.spread,
        align: 'left',
        sortable: true,
      },
      {
        name: 'currency',
        label: 'Moneda',
        field: (row) => row.currency?.code ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'currency_value',
        label: 'Valor moneda',
        field: (row) => useUtils().formatCurrency(row.currency.value) ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'counterparty',
        label: 'Contraparte',
        field: (row) =>
          (row.counterparty.document ?? '-') +
          ' - ' +
          (row.counterparty.description ?? '-'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'nominal_value',
        label: 'Valor nominal',
        field: (row) => useUtils().formatCurrency(row.nominal_value) ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'purchase_value',
        label: 'Valor compra',
        field: (row) => useUtils().formatCurrency(row.purchase_value) ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'purchase_tir',
        label: 'TIR compra',
        field: (row) => useUtils().formatCurrency(row.tir?.capital ?? '-'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'market_value',
        label: 'Valor de Mercado',
        field: (row) => useUtils().formatCurrency(row.market_value) ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'deposit',
        label: 'Depósito',
        field: (row) =>
          (row.deposit.document ?? '-') +
          ' - ' +
          (row.deposit.description ?? '-'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'clearing_system',
        label: 'Sistema compensación',
        field: (row) => row.compensation_system,
        align: 'left',
        sortable: true,
      },
      {
        name: 'folio',
        label: 'Folio',
        field: (row) => row.folio_number,
        align: 'left',
        sortable: true,
      },
      {
        name: 'market_value_units',
        label: 'Valor Mercado Unidades',
        field: (row) => row.market_unit_value,
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: 1,
    rowsPerPage: 25,
  })

  const closeModal = () => {
    modalRef.value = false
  }

  const addDivisionToAccumulated = () => {
    if (
      divisionModels.value?.nominal_value_fraction !== null &&
      divisionModels.value?.buy_value_fraction !== null &&
      divisionModels.value?.market_value_fraction !== null &&
      divisionModels.value?.market_unit_value_fraction !== null
    ) {
      accumulatedDivisions.value.push({
        nominal_value_fraction: Number(
          divisionModels.value?.nominal_value_fraction
        ),
        buy_value_fraction: Number(
          Number(divisionModels.value?.buy_value_fraction).toFixed(2)
        ),
        market_value_fraction: Number(
          Number(divisionModels.value?.market_value_fraction).toFixed(2)
        ),
        market_unit_value_fraction: Number(
          Number(divisionModels.value?.market_unit_value_fraction).toFixed(2)
        ),
      })
    }
  }

  //Funcion para limpiar las divisiones acumuladas
  const clearAccumulatedDivisions = () => {
    accumulatedDivisions.value = []
  }

  //Funcion para validar y pre-enviar el formulario, lo cual nos carga los fraccionamientos parciales
  const preSubmit = async () => {
    if (
      models.value.operation_type_id &&
      models.value.investment_portfolio_id
    ) {
      if (
        divisionModels.value?.nominal_value_fraction === null ||
        divisionModels.value?.buy_value_fraction === null ||
        divisionModels.value?.market_value_fraction === null ||
        divisionModels.value?.market_unit_value_fraction === null
      ) {
        return
      }

      addDivisionToAccumulated()

      const payload = {
        investment_portfolio_id: models.value.investment_portfolio_id,
        operation_type_id: models.value.operation_type_id,
        operation_date: moment().format('YYYY-MM-DD'),
        title_id: selectedId.value?.title_number ?? 0,
        divisions: [...accumulatedDivisions.value],
      }
      models.value.title_id = selectedId.value?.title_number ?? 0
      models.value.divisions = [...accumulatedDivisions.value]

      openMainLoader(true)
      const response = await _validateFractionationTitle(payload)
      if (response) {
        confirmChangeValue.value = true
        if (selectedId.value && selectedId.value.nominal_value) {
          const totalUsed = accumulatedDivisions.value.reduce(
            (sum, division) => {
              return sum + (division.nominal_value_fraction || 0)
            },
            0
          )
          const originalNominalValue = Number(selectedId.value.nominal_value)
          nominalValueRef.value = originalNominalValue - totalUsed
        }
        tableFractionationTitles.value.rows = response.divisions
        modalRef.value = false
        disabledBtn.value = true
      } else {
        accumulatedDivisions.value.pop()
      }
      openMainLoader(false)
    }
  }

  //Funcion para abrir el modal
  const openModal = () => {
    modalRef.value = true
    confirmChangeValue.value = false
  }

  //Funcion para setear los valores del modelo
  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
    const parent = props.data as IFractionationTitles
    tableProps.value.rows = parent.origin_title ? [parent.origin_title] : []
    tableFractionationTitles.value.rows = Array.isArray(parent.divisions)
      ? parent.divisions
      : []
  }

  // Carga inicial de títulos disponibles para fraccionar
  onMounted(() => {
    tableFractionationTitles.value.rows = []
    tableProps.value.rows = []
    _setValueModel()
  })

  onUnmounted(() => {
    tableFractionationTitles.value.rows = []
    tableProps.value.rows = []
    models.value = { ...initialModelsValue }
    divisionModels.value = {
      nominal_value_fraction: null,
      buy_value_fraction: null,
      market_value_fraction: null,
      market_unit_value_fraction: null,
    }
  })

  // Watch para cargar títulos basado en los filtros seleccionados
  watch(
    () => ({
      investment_portfolio: models.value.investment_portfolio_id,
      operation_type: models.value.operation_type_id,
      inversion_class: inversion_class.value,
    }),
    async ({ investment_portfolio, operation_type, inversion_class }) => {
      tableProps.value.rows = []
      selectedId.value = null

      if (!investment_portfolio || !operation_type || !inversion_class) return

      try {
        openMainLoader(true)

        await _getResources(
          {
            investment_portfolio: [
              'available_titles_for_division_and_encompass',
            ],
          },
          `filter[investment_portfolio_id]=${investment_portfolio}&filter[operation_type_id]=${operation_type}&filter[investment_class_type]=${inversion_class}`
        )

        if (
          !Array.isArray(
            available_titles_for_division_and_encompass_rows.value
          ) ||
          available_titles_for_division_and_encompass_rows.value.length === 0
        ) {
          tableProps.value.rows = []
          return
        }

        tableProps.value.rows = [
          ...available_titles_for_division_and_encompass_rows.value,
        ] as IFractionationGenericData[]
      } finally {
        openMainLoader(false)
      }
    },
    { immediate: false, deep: true }
  )

  //Watch para carga info de las tablas
  watch(
    () => available_titles_for_division_and_encompass_rows.value,
    () => {
      openMainLoader(true)
      tableProps.value.rows =
        available_titles_for_division_and_encompass_rows.value as IFractionationGenericData[]
      openMainLoader(false)
    }
  )

  //Sincroniza las operaciones para los modelos del fraccionamiento en base al valor nominal
  watch(
    () => divisionModels.value?.nominal_value_fraction,
    (newVal) => {
      if (!divisionModels.value) return

      if (!newVal) {
        divisionModels.value.buy_value_fraction = null
        divisionModels.value.market_value_fraction = null
        divisionModels.value.market_unit_value_fraction = null
        return
      }

      if (!selectedId.value) return

      const nominalValue = Number(selectedId.value.nominal_value)
      const purchaseValue = Number(selectedId.value.purchase_value)
      const marketValue = Number(selectedId.value.market_value)
      const marketUnitValue = Number(selectedId.value.market_unit_value)

      if (!nominalValue || nominalValue === 0) return

      const percentage = Number(((newVal / nominalValue) * 100).toFixed(2))

      divisionModels.value.buy_value_fraction = Number(
        (purchaseValue * (percentage / 100)).toFixed(2)
      )

      divisionModels.value.market_value_fraction = Number(
        (marketValue * (percentage / 100)).toFixed(2)
      )

      divisionModels.value.market_unit_value_fraction = Number(
        (marketUnitValue * (percentage / 100)).toFixed(2)
      )
    }
  )

  //Sincroniza el modelo con las props
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )
  // Watch para emitir cambios en el modelo
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', useUtils().isEmptyOrZero(val) ? null : val)
    },
    { deep: true, immediate: true }
  )

  // Watch para calcular el valor nominal disponible
  watch(
    () => ({
      selectedId: selectedId.value,
      accumulatedDivisions: accumulatedDivisions.value,
    }),
    ({ selectedId: selected }) => {
      if (!selected || !selected.nominal_value) {
        nominalValueRef.value = 0
        return
      }

      const originalNominalValue = Number(selected.nominal_value)
      nominalValueRef.value = originalNominalValue
    },
    { deep: true, immediate: true }
  )

  //Sincroniza el ID en cuestion y si este cambia, limpia el estado anterior de la info del modal
  watch(
    () => selectedId.value,
    (newSelectedId, oldSelectedId) => {
      if (newSelectedId?.title_number !== oldSelectedId?.title_number) {
        clearAccumulatedDivisions()
        tableFractionationTitles.value.rows = []
      }
    }
  )

  //Sincroniza la descripcion del portafolio con el ID actual
  watch(
    () => models.value.investment_portfolio_id,
    (newId) => {
      if (!newId) {
        descriptionPortfolio.value = ''
        return
      }
      const portfolioRef = investment_portfolio.value.find(
        (item) => item.value === Number(newId)
      )
      descriptionPortfolio.value = portfolioRef
        ? portfolioRef.description ?? ''
        : ''
    }
  )

  return {
    tableProps,
    selectedId,
    tableFractionationTitles,
    division_inversion_classes,
    investment_portfolio,
    modalRef,
    operation_type,
    informationFormRef,
    descriptionPortfolio,
    disabledBtn,
    inversion_class,
    nominalValueRef,
    accumulatedDivisions,
    divisionModels,
    models,
    openModal,
    closeModal,
    preSubmit,
    addDivisionToAccumulated,
    clearAccumulatedDivisions,
  }
}

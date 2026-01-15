import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { NonEditActionType } from '@/interfaces/global'
import {
  ITitlesMergingBasicDataForm,
  IMergedTitlesValues,
  ITitlesToMerge,
  IAvailableTitlesForDivisionAndEncompassResource,
  IMergedTitle,
} from '@/interfaces/customs'
import { QTable, debounce } from 'quasar'
import { useMainLoader, useUtils, useAlert } from '@/composables'
import moment from 'moment'

import {
  useTitlesMergingStore,
  useResourceManagerStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useBasicDataForm = (
  props: {
    action: NonEditActionType
    data: ITitlesMergingBasicDataForm | null
  },
  emit: Function
) => {
  const { _previewMergedTitle } = useTitlesMergingStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    investment_portfolio,
    operation_type,
    list_emitter_associated_trader: emitter,
    encompass_inversion_classes,
    paper_type_encompass_and_division,
    isin_codes_mnemonics_portfolio,
    available_titles_for_division_and_encompass,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { openMainLoader } = useMainLoader()
  const { formatCurrencyString, isEmptyOrZero } = useUtils()
  const { showAlert } = useAlert()

  const formElementRef = ref()
  const titlesTableListRef = ref()

  const initialModelsValues: ITitlesMergingBasicDataForm = {
    investment_portfolio: null,
    operation_type: null,
    emitter: null,
    inversion_class: null,
    paper: null,
    isin: null,
    issue_date: null,
    periodicity: null,
    modality: null,
    rate_type: null,
    rate_code: null,
    rate_value: null,
    spread: null,
    currency: null,
    titles: [],
    selectedTitles: [],
    mergedTitlesPreview: [],
  }

  const initialMergedTitlesValues: IMergedTitlesValues = {
    title: null,
    nominal_value: null,
    market_value: null,
    market_unit_value: null,
    tir_value: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })
  const mergedTitlesValues = ref<typeof initialMergedTitlesValues>({
    ...initialMergedTitlesValues,
  })

  const titlesTableProperties = ref({
    loading: false,
    columns: [
      {
        name: 'title_number',
        required: true,
        label: 'Número título',
        align: 'left',
        field: (row: IAvailableTitlesForDivisionAndEncompassResource) =>
          `${row.title_number ?? '-'}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: (row: IAvailableTitlesForDivisionAndEncompassResource) =>
          `${row.status?.id ?? '-'}`,
        sortable: true,
      },
      {
        name: 'nominal_value',
        required: true,
        label: 'Valor nominal',
        align: 'left',
        field: (row: IAvailableTitlesForDivisionAndEncompassResource) =>
          `${formatCurrencyString(row.nominal_value) ?? '-'}`,
        sortable: true,
      },
      {
        name: 'purchase_value',
        required: true,
        label: 'Valor compra',
        align: 'left',
        field: (row: IAvailableTitlesForDivisionAndEncompassResource) =>
          `${formatCurrencyString(row.purchase_value) ?? '-'}`,
        sortable: true,
      },
      {
        name: 'buyer_date',
        required: true,
        label: 'Fecha de compra',
        align: 'left',
        field: (row: IAvailableTitlesForDivisionAndEncompassResource) =>
          `${row.buyer_date ?? '-'}`,
        sortable: true,
      },
      {
        name: 'market_value',
        required: true,
        label: 'Valor mercado',
        align: 'left',
        field: (row: IAvailableTitlesForDivisionAndEncompassResource) =>
          `${formatCurrencyString(row.market_value) ?? '-'}`,
        sortable: true,
      },
      {
        name: 'market_unit_value',
        required: true,
        label: 'Valor mercado unidades',
        align: 'left',
        field: (row: IAvailableTitlesForDivisionAndEncompassResource) =>
          `${row.market_unit_value ?? '-'}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: computed(() => models.value.titles ?? []),
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    wrapCells: true,
  })

  const mergedtitleTableProperties = ref({
    loading: false,
    columns: [
      {
        name: 'operation_type',
        required: true,
        label: 'Número de operación',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${row.title_result?.operation_type?.code ?? '-'}`,
        sortable: true,
      },
      ...(props.action === 'view'
        ? [
            {
              name: 'title_number',
              required: true,
              label: 'Número de título',
              align: 'left',
              field: (row: IMergedTitle) =>
                `${row.title_result?.title_number ?? '-'}`,
              sortable: true,
            },
          ]
        : []),
      {
        name: 'inversion_class',
        required: true,
        label: 'Clase de Inversión',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${row.title_information?.inversion_class ?? '-'}`,
        sortable: true,
      },
      {
        name: 'emitter',
        required: true,
        label: 'Emisor',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${row.title_result?.emitter?.document} - ${row.title_result?.emitter?.description}`,
        sortable: true,
      },
      {
        name: 'isin_code',
        required: true,
        label: 'ISIN',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${row.title_result?.isin_code?.isin_code ?? '-'}`,
        sortable: true,
      },
      {
        name: 'start_date',
        required: true,
        label: 'Fecha de emisión',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${row.title_result?.emission_date ?? '-'}`,
        sortable: true,
      },
      {
        name: 'end_date',
        required: true,
        label: 'Fecha de vencimiento',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${row.title_result?.expiration_date ?? '-'}`,
        sortable: true,
      },
      {
        name: 'nominal_value',
        required: true,
        label: 'Valor nominal',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${formatCurrencyString(row.title_result?.nominal_value) ?? '-'}`,
        sortable: true,
      },
      {
        name: 'fixed_rate_value',
        required: true,
        label: 'Valor tasa',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${row.title_result?.isin_code?.fixed_rate_value ?? '-'}`,
        sortable: true,
      },
      {
        name: 'periodicity',
        required: true,
        label: 'Periodicidad',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${row.title_result?.isin_code?.periodicity ?? '-'}`,
        sortable: true,
      },
      {
        name: 'modality',
        required: true,
        label: 'Modalidad',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${row.title_result?.isin_code?.modality ?? '-'}`,
        sortable: true,
      },
      {
        name: 'tir',
        required: true,
        label: 'Valor TIR compra',
        align: 'left',
        field: (row: IMergedTitle) => `${row.title_result?.tir?.value ?? '-'}`,
        sortable: true,
      },
      {
        name: 'market_value',
        required: true,
        label: 'Valor mercado',
        align: 'left',
        field: (row: IMergedTitle) =>
          `${formatCurrencyString(row.title_result?.market_value) ?? '-'}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: (row: IMergedTitle) => `${row.title_result?.status?.id ?? '-'}`,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: computed(() => models.value.mergedTitlesPreview ?? []),
    wrapCells: true,
  })

  const handleRowSelection = async (selection: {
    selected: IAvailableTitlesForDivisionAndEncompassResource[] | null
  }) => {
    const { selected } = selection
    if (!selected) {
      models.value.selectedTitles = []
      return
    }

    models.value.selectedTitles = [...selected]
  }

  const addMergedTitle = async () => {
    const newMergedTitle = mergedTitlesValues.value.title
    if (!newMergedTitle) {
      showAlert(
        'Debe seleccionar titulos a englobar',
        'warning',
        undefined,
        3000
      )
      return
    }

    if (models.value.mergedTitlesPreview.length < 1)
      models.value.mergedTitlesPreview.push(newMergedTitle)
  }

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  // Filtrado de emisores por portafolio seleccionado
  watch(
    () => models.value.investment_portfolio,
    async (newVal) => {
      _resetKeys({ investment_portfolio: ['list_emitter_associated_trader'] })
      models.value.emitter = null

      if (newVal) {
        await _getResources(
          { investment_portfolio: ['list_emitter_associated_trader'] },
          `filter[investment_portfolio_id]=${newVal}`
        )
      }
    }
  )

  // Tipo de papel por clase de inversión
  watch(
    () => models.value.inversion_class,
    async (newVal) => {
      _resetKeys({
        investment_portfolio: ['paper_type_encompass_and_division'],
      })
      models.value.paper = null

      if (newVal) {
        await _getResources(
          { investment_portfolio: ['paper_type_encompass_and_division'] },
          `filter[investment_class]=${newVal}`
        )
      }
    }
  )

  // Campos derivados del isin seleccionado
  watch(
    () => models.value.isin,
    (newIsin) => {
      if (props.action !== 'create') return

      const isin = isin_codes_mnemonics_portfolio.value.find(
        ({ value }) => value === newIsin
      )

      models.value.issue_date = isin?.issue_date ?? null
      models.value.periodicity = isin?.perioricity ?? null
      models.value.modality = isin?.modality ?? null
      models.value.rate_type = isin?.rate_type ?? null
      models.value.rate_code = isin?.rate_code ?? null
      models.value.rate_value = isin?.fixed_rate_value ?? null
      models.value.spread = isin?.spread ?? null
    }
  )

  // Campos derivados del papel seleccionado
  watch(
    () => models.value.paper,
    (newPaper) => {
      if (props.action !== 'create') return

      const paper = paper_type_encompass_and_division.value.find(
        ({ value }) => value === newPaper
      )
      models.value.currency = paper?.currency?.code ?? null
    }
  )

  // Filtrado de titulos por campos seleccionados
  watch(
    () => ({
      investment_portfolio: models.value.investment_portfolio,
      operation_type: models.value.operation_type,
      emitter: models.value.emitter,
      inversion_class: models.value.inversion_class,
      paper: models.value.paper,
    }),
    async ({
      investment_portfolio,
      operation_type,
      emitter,
      inversion_class,
      paper,
    }) => {
      // Se limpian variables y modelos
      titlesTableListRef.value?.clearSelection()
      models.value.titles = []
      models.value.selectedTitles = []
      models.value.mergedTitlesPreview = []
      mergedTitlesValues.value = {
        ...initialMergedTitlesValues,
      }

      if (
        !investment_portfolio ||
        !operation_type ||
        !emitter ||
        !inversion_class ||
        !paper
      )
        return

      try {
        openMainLoader(true)

        await _getResources(
          {
            investment_portfolio: [
              'available_titles_for_division_and_encompass',
            ],
          },
          `filter[investment_portfolio_id]=${investment_portfolio}&filter[operation_type_id]=${operation_type}&filter[issuer_id]=${emitter}&filter[investment_class_type]=${inversion_class}&filter[paper_type_id]=${paper}`
        )

        if (
          !Array.isArray(available_titles_for_division_and_encompass.value) ||
          available_titles_for_division_and_encompass.value.length === 0
        ) {
          models.value.titles = []
          return
        }

        models.value.titles = [
          ...available_titles_for_division_and_encompass.value,
        ]
      } finally {
        openMainLoader(false)
      }
    },
    { immediate: false, deep: true }
  )

  watch(
    () => models.value.selectedTitles,
    debounce(
      async (
        newSelection: IAvailableTitlesForDivisionAndEncompassResource[]
      ) => {
        // Se limpian variables y modelos
        models.value.mergedTitlesPreview = []
        mergedTitlesValues.value = {
          ...initialMergedTitlesValues,
        }

        if (newSelection.length > 1) {
          const payload: ITitlesToMerge = {
            operation_date: moment().format('YYYY-MM-DD'),
            titles: newSelection.map((item) => ({ title_id: item.id })),
          }

          openMainLoader(true)
          const response = await _previewMergedTitle(payload)
          if (response) {
            mergedTitlesValues.value = {
              title: response,
              nominal_value: response.title_result?.nominal_value || null,
              market_value: response.title_result?.market_value || null,
              market_unit_value:
                response.title_result?.market_unit_value || null,
              tir_value: response.title_result?.tir?.value || null,
            }
          }
          openMainLoader(false)
        }
      },
      1000
    )
  )

  onBeforeUnmount(() => {
    const keys = {
      investment_portfolio: [
        'available_titles_for_division_and_encompass',
        'paper_type_encompass_and_division',
        'isin_code_mnemonics',
      ],
    }
    _resetKeys(keys)
  })

  return {
    investment_portfolio,
    operation_type,
    emitter,
    encompass_inversion_classes,
    paper_type_encompass_and_division,
    isin_codes_mnemonics_portfolio,
    formElementRef,
    titlesTableListRef,
    models,
    mergedTitlesValues,
    titlesTableProperties,
    mergedtitleTableProperties,
    handleRowSelection,
    addMergedTitle,
  }
}

export default useBasicDataForm

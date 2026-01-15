// Vue - pinia
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IAvailableTitlesForDivisionAndEncompassResource,
  ITitlesMergingBasicDataForm,
  ITitlesMergingResponse,
  IMergedTitle,
} from '@/interfaces/customs'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useTitlesMergingStore, useResourceManagerStore } from '@/stores'

const useTitlesMergingView = () => {
  const { _getByMergedTitleId, _clearData } = useTitlesMergingStore('v1')
  const { headerPropsDefault, titles_merging_response } = storeToRefs(
    useTitlesMergingStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const router = useRouter()

  const keys = {
    finantial_obligations: ['financial_obligations'],
  }

  const mergedTitleId = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const basic_data_form = ref<ITitlesMergingBasicDataForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const headerProperties = {
    title: 'Ver englobe de títulos',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'TitlesMergingView',
      },
      {
        label: mergedTitleId.toString(),
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
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

  const setFormView = (data: ITitlesMergingResponse) => {
    // Mapeo de titulos originales
    const mappedTitles: IAvailableTitlesForDivisionAndEncompassResource[] = (
      data.origin_titles || []
    ).map((item) => ({
      id: item.id,
      title_number: item.id ?? null,
      status: item.status,
      purchase_value: item.purchase_value,
      buyer_date: item.purchase_date,
      nominal_value: item.nominal_value,
      market_value: item.market_value,
      market_unit_value: item.market_unit_value,
    }))

    // Mapeo de titulo englobado
    const mappedMergedTitlesPreview: IMergedTitle[] = [
      {
        title_information: {
          created_by: data.title_information?.created_by?.complete_name || null,
          inversion_class: data.title_information?.inversion_class || '',
          emitter: {
            id: data.title_information?.emitter?.id ?? 0,
            description: data.title_information?.emitter?.description ?? '',
            document: data.title_information?.emitter?.document ?? '',
          },
          paper_type: {
            id: data.title_information?.paper_type?.id ?? 0,
            code: data.title_information?.paper_type?.code ?? '',
            description: data.title_information?.paper_type?.description ?? '',
            investment_type:
              data.title_information?.paper_type?.investment_type ?? '',
            investment_class:
              data.title_information?.paper_type?.investment_class ?? '',
            rate_type: data.title_information?.paper_type?.rate_type ?? null,
            rate_class: data.title_information?.paper_type?.rate_class ?? null,
            rate: data.title_information?.paper_type?.rate ?? null,
            rate_mode: data.title_information?.paper_type?.rate_mode ?? null,
            base_flow_rate:
              data.title_information?.paper_type?.base_flow_rate ?? null,
            flow_type: data.title_information?.paper_type?.flow_type ?? null,
            payment_flow:
              data.title_information?.paper_type?.payment_flow ?? null,
            amortization_type:
              data.title_information?.paper_type?.amortization_type ?? null,
          },
          isin_code: {
            id: data.title_information?.isin_code?.id ?? 0,
            isin_code: data.title_information?.isin_code?.isin_code ?? '',
            mnemonic: data.title_information?.isin_code?.mnemonic ?? '',
            issuer_code: data.title_information?.isin_code?.issuer_code ?? '',
            administrator_code:
              data.title_information?.isin_code?.administrator_code ?? '',
            issuance_series:
              data.title_information?.isin_code?.issuance_series ?? '',
            issuance_year:
              data.title_information?.isin_code?.issuance_year ?? 0,
            title_class: data.title_information?.isin_code?.title_class ?? '',
            modality: data.title_information?.isin_code?.modality ?? '',
            spread: data.title_information?.isin_code?.spread ?? '',
            periodicity: data.title_information?.isin_code?.periodicity ?? '',
            rate_type: data.title_information?.isin_code?.rate_type ?? '',
            fixed_rate_value:
              data.title_information?.isin_code?.fixed_rate_value ?? '',
            rate_code: data.title_information?.isin_code?.rate_code ?? '',
            rate_behavior:
              data.title_information?.isin_code?.rate_behavior ?? '',
          },
        },
        origin_titles: (data.origin_titles || []).map((ot) => ({
          id: ot.id ?? 0,
          status: {
            id: ot.status?.id ?? 0,
            description: ot.status?.description ?? '',
          },
          purchase_value: ot.purchase_value ?? 0,
          purchase_date: ot.purchase_date ?? '',
          nominal_value: ot.nominal_value ?? 0,
          market_value: ot.market_value ?? 0,
          market_unit_value: ot.market_unit_value ?? 0,
        })),
        title_result: {
          id: data.title_result?.id ?? null,
          title_number: data.title_result?.title_number ?? null,
          emission_date: data.title_result?.emission_date ?? null,
          expiration_date: data.title_result?.expiration_date ?? null,
          status: {
            id: data.title_result?.status?.id ?? 0,
            status: data.title_result?.status?.status ?? '',
          },
          emitter: {
            id: data.title_result?.emitter?.id ?? 0,
            description: data.title_result?.emitter?.description ?? '',
            document: data.title_result?.emitter?.document ?? '',
          },
          operation_type: data.title_result?.operation_type
            ? {
                id: data.title_result.operation_type.id ?? 0,
                code: data.title_result.operation_type.code ?? 0,
                description: data.title_result.operation_type.description ?? '',
              }
            : undefined,
          paper_type: {
            id: data.title_result?.paper_type?.id ?? 0,
            code: data.title_result?.paper_type?.code ?? '',
            description: data.title_result?.paper_type?.description ?? '',
            investment_type:
              data.title_result?.paper_type?.investment_type ?? '',
            investment_class:
              data.title_result?.paper_type?.investment_class ?? '',
            rate_type: data.title_result?.paper_type?.rate_type ?? null,
            rate_class: data.title_result?.paper_type?.rate_class ?? null,
            rate: data.title_result?.paper_type?.rate ?? null,
            rate_mode: data.title_result?.paper_type?.rate_mode ?? null,
            base_flow_rate:
              data.title_result?.paper_type?.base_flow_rate ?? null,
            flow_type: data.title_result?.paper_type?.flow_type ?? null,
            payment_flow: data.title_result?.paper_type?.payment_flow ?? null,
            amortization_type:
              data.title_result?.paper_type?.amortization_type ?? null,
          },
          isin_code: data.title_result?.isin_code
            ? {
                id: data.title_result.isin_code.id ?? 0,
                isin_code: data.title_result.isin_code.isin_code ?? '',
                mnemonic: data.title_result.isin_code.mnemonic ?? '',
                issuer_code: data.title_result.isin_code.issuer_code ?? '',
                administrator_code:
                  data.title_result.isin_code.administrator_code ?? '',
                issuance_series:
                  data.title_result.isin_code.issuance_series ?? '',
                issuance_year: data.title_result.isin_code.issuance_year ?? 0,
                title_class: data.title_result.isin_code.title_class ?? '',
                modality: data.title_result.isin_code.modality ?? '',
                spread: data.title_result.isin_code.spread ?? '',
                periodicity: data.title_result.isin_code.periodicity ?? '',
                rate_type: data.title_result.isin_code.rate_type ?? '',
                fixed_rate_value:
                  data.title_result.isin_code.fixed_rate_value ?? '',
                rate_code: data.title_result.isin_code.rate_code ?? '',
                rate_behavior: data.title_result.isin_code.rate_behavior ?? '',
              }
            : undefined,
          nominal_value: data.title_result?.nominal_value ?? 0,
          tir: {
            id: data.title_result?.tir?.id ?? null,
            capita: Number(data.title_result?.tir?.capita) || 0,
            value: Number(data.title_result?.tir?.value) || 0,
          },
          market_value: data.title_result?.market_value ?? 0,
          market_unit_value: data.title_result?.market_unit_value ?? 0,
        },
      },
    ]

    // Seteo del formulario
    basic_data_form.value = {
      id: data.id,
      investment_portfolio: data.title_result?.investment_portfolio
        ? `${data.title_result.investment_portfolio.code} - ${data.title_result.investment_portfolio.name}`
        : null,
      operation_type: data.title_result?.operation_type
        ? `${data.title_result.operation_type.code} - ${data.title_result.operation_type.description}`
        : null,
      emitter: data.title_result?.emitter
        ? `${data.title_result.emitter.document} - ${data.title_result.emitter.description}`
        : null,
      inversion_class: data.title_information?.inversion_class || null,
      paper: data.title_result?.paper_type
        ? `${data.title_result.paper_type.code} - ${data.title_result.paper_type.description}`
        : null,
      isin: data.title_result?.isin_code?.isin_code || null,
      issue_date: data.title_information?.emission_date || null,
      periodicity: data.title_result?.isin_code?.periodicity || null,
      modality: data.title_result?.isin_code?.modality || null,
      rate_type: data.title_result?.isin_code?.rate_type || null,
      rate_code: data.title_result?.isin_code?.rate_code || null,
      rate_value: data.title_result?.isin_code?.fixed_rate_value || null,
      spread: data.title_result?.isin_code?.spread || null,
      currency: data.title_result?.paper_type?.currency?.code || null,
      titles: mappedTitles,
      selectedTitles: [],
      mergedTitlesPreview: mappedMergedTitlesPreview,
      created_by: data.title_information?.created_by?.complete_name || null,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await Promise.all([_getResources(keys), _getByMergedTitleId(mergedTitleId)])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => titles_merging_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    titles_merging_response,
    basic_data_form,
    basicDataFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
  }
}

export default useTitlesMergingView

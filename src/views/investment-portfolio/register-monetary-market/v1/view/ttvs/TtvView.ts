import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ITabs } from '@/interfaces/global'
import { defaultIconsLucide } from '@/utils'
import { useMonetaryMarketOperationsStore } from '@/stores'
import { useGoToUrl } from '@/composables'
import {
  ITtvResponse,
  ITtvInformationFormData,
  ITitleDelivered,
  ITitlesReceived,
  IOperationHistory,
  ITtvBackendResponse,
  CommissionModality,
  CommissionBaseMonetaryMarket,
  PositionTypes,
  TtvTypes,
} from '@/interfaces/customs/investment-portfolio/RegisterMonetaryMarket'

const useRegisterMonetaryMarketView = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const operationNumber = Number(route.params.operationNumber)
  const { _getTtvOperation } = useMonetaryMarketOperationsStore('v1')

  const ttvRaw = ref<ITtvResponse | null>(null)
  const ttv = computed(() => ttvRaw.value)

  const headerProps = {
    title: 'Ver operación TTV’s',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Operaciones de mercado' },
      { label: 'TTV’s', route: 'RegisterMonetaryMarketList' },
      {
        label: 'Ver',
        route: 'RegisterMonetaryMarketView',
        params: { operationNumber },
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
    {
      name: 'delivered',
      label: 'Título entregado',
      icon: defaultIconsLucide.file,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'received',
      label: 'Título recibido',
      icon: defaultIconsLucide.fileOutline,
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

  const goToNextTab = () => {
    const currentIndex = tabActiveIdx.value
    if (currentIndex < filteredTabs.value.length - 1) {
      tabActive.value = filteredTabs.value[currentIndex + 1].name
      tabActiveIdx.value = currentIndex + 1
    }
  }

  onMounted(async () => {
    const response: ITtvBackendResponse | null = await _getTtvOperation(
      operationNumber
    )
    if (!response || !response.success) return

    const info = response.data
    const basic = info.basic_data
    const op = info.information_operation
    const hist = info['history of monetary transactions']
    const delivered = info.titles_awarded
    const received = info.titles_received

    const information: ITtvInformationFormData = {
      user: basic.created_by_user,
      operation_date: basic.operation_date,
      investment_portfolio_id: basic.portfolio_code || null,
      description_portfolio_name:
        basic.portfolio_description && basic.portfolio_description.trim() !== ''
          ? basic.portfolio_description
          : '-',

      status: basic.status ?? '-',
      title_number: String(basic.number_title ?? '-'),
      operation_number: String(basic.number_operation ?? '-'),
      ttv_type:
        op.ttvs === 'Valores contra valores'
          ? TtvTypes.VALUES_VS_VALUES
          : op.ttvs === 'Valores contra dinero'
          ? TtvTypes.VALUES_VS_MONEY
          : null,

      position:
        op.position === 'Originador'
          ? PositionTypes.ORIGINATOR
          : PositionTypes.RECEIVER,
      paper_id: null,
      paper_description: op.paper_type?.split('-')[1] ?? op.paper_type ?? '-',
      isin_code: '',
      operation_type_id: null,
      operation_type_description: op.operation_type,
      number_days: op.number_days,
      end_date: op.end_date,
      counterparty_id: null,
      counterparty_description: op.counterparty ?? '-',
      currency_id: null,
      currency_value: Number(op.currency_value) || null,
      folio: op.folio,
      compensation_system: op.compensation_system,
      negotiation_value: Number(op.ttv_negotiation_value) || null,
      nominal_delivered: Number(op.face_value_title_delivered) || null,
      market_delivered: Number(op.market_value_title_delivered) || null,
      nominal_received:
        op.face_value_title_received != null
          ? Number(op.face_value_title_received)
          : null,
      market_received:
        op.market_value_title_received != null
          ? Number(op.market_value_title_received)
          : null,
      money_value: Number(op.value_money) || null,
      money_yield: Boolean(op.money_perfomance),
      yield_percentage: op.percentage_yield
        ? Number(op.percentage_yield)
        : null,
      yield_value:
        op.perfomance_value === null ||
        op.perfomance_value === undefined ||
        op.perfomance_value === ''
          ? 0
          : Number(op.perfomance_value),

      comission_base:
        op.comission_base === 'Porcentaje'
          ? CommissionBaseMonetaryMarket.PERCENTAGE
          : op.comission_base === 'Valor fijo'
          ? CommissionBaseMonetaryMarket.FIXED_VALUE
          : CommissionBaseMonetaryMarket.NOT_APPLICABLE,

      commission_value: Number(op.commission_value) || null,
      commission_result: null,
      commission_modality:
        op.commission_modality === 'Anticipada'
          ? CommissionModality.ADVANCED
          : op.commission_modality === 'Vencida'
          ? CommissionModality.EXPIRED
          : null,

      return_value: Number(op.return_value) || null,
      paper_type_id: null,
    }

    const titleDelivered: ITitleDelivered = {
      title_id: delivered.title_id,
      issuer_id: delivered.issuer,
      isin_code_id: delivered.isin ?? null,
      mnemonic: delivered.mnemonic,
      paper_type_id: null,
      paper_description: delivered.paper ?? '-',
      issue_date: delivered.issue_date,
      maturity_date: delivered.maturity_date,
      rate_type: delivered.rate_type,
      rate_code: delivered.rate_code,
      rate_value: Number(delivered.fixed_rate_value),
      spread: delivered.spread ? Number(delivered.spread) : null,
      modality: delivered.modality,
      currency_id: null,
      currency_description: delivered.currency ?? '-',
      periodicity: delivered.perioricity,
      tir_purchase: Number(delivered.irr_purchase),
      deposit_id: null,
      deposit_description: delivered.deposit_id ?? '-',
      face_value: Number(delivered.face_value),
      units_value:
        delivered.face_value && delivered.market_value
          ? Number(delivered.face_value) / Number(delivered.market_value)
          : null,
      market_value: Number(delivered.market_value),
    }

    const titleReceived: ITitlesReceived = {
      title_id: received.title_id,
      issuer_id: received.issuer,
      isin_code_id: received.isin ?? null,
      mnemonic: received.mnemonic,
      paper_type_id: null,
      paper_description: received.paper ?? '-',
      issue_date: received.issue_date,
      maturity_date: received.maturity_date,
      rate_type: received.rate_type,
      rate_code: received.rate_code,
      rate_value: Number(received.fixed_rate_value),
      spread: received.spread ? Number(received.spread) : null,
      modality: received.modality,
      currency: null,
      currency_description: received.currency ?? '-',
      periodicity: received.perioricity,
      tir_purchase: Number(received.irr_purchase),
      deposit_id: null,
      deposit_description: received.deposit_id ?? '-',
      face_value: Number(received.face_value),
      units_value:
        received.face_value &&
        received.market_value &&
        Number(received.market_value) !== 0
          ? Number(received.face_value) / Number(received.market_value)
          : null,

      market_value: Number(received.market_value),
    }

    const history: IOperationHistory = {
      created_at: hist.created_at,
      updated_at: hist.updated_at ?? '-',
      creator_data: hist.created_by_user,
      update_data: hist.updated_by_user ?? '-',
    }

    ttvRaw.value = {
      information,
      delivered: titleDelivered,
      received: titleReceived,
      history,
    }
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    ttv,
    goToURL,
    goToNextTab,
  }
}

export default useRegisterMonetaryMarketView

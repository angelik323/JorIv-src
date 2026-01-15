import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { QTable } from 'quasar'
import { ITabs } from '@/interfaces/global'
import { defaultIconsLucide } from '@/utils'
import { useMonetaryMarketOperationsStore } from '@/stores'
import {
  IRepoResponse,
  IOperationHistory,
  IWarrantyFormData,
  IRepoInformationForm,
  RateClasses,
  RepoTypes,
  RepoPosition,
} from '@/interfaces/customs'
import { useGoToUrl } from '@/composables'

const useOperationReposView = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const operationNumber = Number(route.params.operationNumber)

  const { _getRepoOperation } = useMonetaryMarketOperationsStore('v1')

  const operationRaw = ref<IRepoResponse | null>(null)
  const operation = computed(() => operationRaw.value)

  const headerProps = {
    title: 'Ver operación Repo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Operaciones de mercado' },
      { label: 'Repo', route: 'RegisterMonetaryMarketList' },
      {
        label: 'Ver',
        route: 'OperationReposView',
        params: { id: operationNumber },
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
      name: 'warranty',
      label: 'Garantía',
      icon: defaultIconsLucide.file,
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

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: { id: number; flow_date: string; interest: number }[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: false,
      },
      {
        name: 'flow_date',
        label: 'Fecha',
        align: 'center',
        field: 'flow_date',
        sortable: false,
      },
      {
        name: 'interest',
        label: 'Valor interés',
        align: 'right',
        field: (row) =>
          new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
          }).format(row.interest),
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  onMounted(async () => {
    const response = await _getRepoOperation(operationNumber)
    if (!response || !response.success) return

    const info = response.data
    const basic = info.basic_data
    const op = info.information_operation
    const guarantee = info.guarantee

    const information: IRepoInformationForm = {
      user: basic.created_by_user,
      operation_date: basic.operation_date,
      investment_portfolio_id: null,
      portfolio_code: basic.portfolio_code || '-',
      description_portfolio_name:
        basic.portfolio_description && basic.portfolio_description.trim() !== ''
          ? basic.portfolio_description
          : '-',

      repo:
        op.repo === 'Activo'
          ? ('Activo' as RepoPosition)
          : ('Pasivo' as RepoPosition),
      repo_type:
        op.repo_type === 'Abierto'
          ? ('Abierto' as RepoTypes)
          : ('Cerrado' as RepoTypes),
      paper_id: null,
      paper_description: op.paper_type?.split('-')[1] ?? op.paper_type ?? '-',
      operation_type_description: op.operation_type,
      operation_type_id: null,
      start_date: op.start_date,
      days_number: Number(op.number_days),
      end_date: op.end_date,
      rate_value: Number(op.agreed_rate),
      rate_class: op.rate_class as RateClasses,
      days_base: Number(op.base_days) as 360 | 365,
      nominal_value: Number(op.face_value),
      counterparty_id: null,
      counterparty_description: op.counterparty ?? '-',
      currency_id: null,
      folio: Number(op.folio),
      compensation_system: op.compensation_system,
      warranty_value: Number(op.guarantee_value),
      warranty_percentage: Number(op.guarantee_percentage),
      return_value: Number(op.return_value),
      status: basic.status,
      operation_number: String(basic.number_operation),
      title_number: String(basic.number_title),
      isin_code: '',
      negotiation_value: null,
      yield_value: null,
      yield_percentage: null,
      commission_base: null,
      commission_value: null,
      commission_mode: null,
    }

    const warranty: IWarrantyFormData = {
      title_id: guarantee.title_id,
      issuer_id: null,
      issuer_description: guarantee.issuer ?? '-',
      isin_code: guarantee.isin,
      mnemonic: guarantee.mnemonic,
      paper_id: null,
      paper_description: guarantee.paper ?? '-',
      issue_date: guarantee.issue_date,
      maturity_date: guarantee.maturity_date,
      rate_type: guarantee.rate_type,
      rate_code: guarantee.rate_code,
      rate_value: Number(guarantee.fixed_rate_value),
      spread: guarantee.spread ? Number(guarantee.spread) : null,
      modality: guarantee.modality,
      currency_id: null,
      currency_description: guarantee.currency ?? '-',
      periodicity: guarantee.perioricity,
      tir_purchase: Number(guarantee.irr_purchase),
      deposit_id: null,
      deposit_description: guarantee.deposit_id ?? '-',
      face_value: Number(guarantee.face_value),
      units_value:
        guarantee.face_value &&
        guarantee.market_value &&
        Number(guarantee.market_value) !== 0
          ? Number(guarantee.face_value) / Number(guarantee.market_value)
          : null,
      market_value: Number(guarantee.market_value),
    }

    const interests =
      info.interests?.map((item) => ({
        id: item.id,
        flow_date: item.flow_date,
        interest: Number(item.interest),
        number_days:
          item.number_days !== undefined ? Number(item.number_days) : 0,
      })) || []

    if (interests.length) {
      tableProps.value.rows = interests
    }

    const history: IOperationHistory = {
      created_at: basic.operation_date,
      updated_at: '',
      creator_data: basic.created_by_user,
      update_data: '-',
    }

    operationRaw.value = { information, warranty, history, interests }
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    operation,
    tableProps,
    goToURL,
  }
}

export default useOperationReposView

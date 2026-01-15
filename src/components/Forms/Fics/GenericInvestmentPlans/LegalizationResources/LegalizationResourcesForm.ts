// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QForm } from 'quasar'

// Components
import TableList from '@/components/table-list/TableList.vue'

// Interfaces
import { IFicsFundResource } from '@/interfaces/customs/resources/Fics'
import { ITableProps, Nullable, IPages } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import {
  IGenericInvestmentPlansLegalizeFormData,
  IGenericInvestmentPlansLegalizeResponse,
  IGenericInvestmentPlansLegalizeDestination,
  IGenericInvestmentPlansLegalizeContribution,
  IGenericInvestmentPlansLegalizeDestinationItemList,
} from '@/interfaces/customs/fics/GenericInvestmentPlans'

// Composables
import { useRules, useUtils, useAlert, useMainLoader } from '@/composables'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessStore } from '@/stores/trust-business'

const useLegalizationResourcesForm = (props: {
  action: ActionType
  data?: {
    genericInvestmentPlan: IGenericInvestmentPlansLegalizeResponse | null
    unidentifiedContributions: {
      data: IGenericInvestmentPlansLegalizeContribution[]
      loading: boolean
      pages: IPages
    }
  }
}) => {
  const { _getResources } = useResourceManagerStore('v1')

  const { funts_to_investment_plans, fiduciary_investment_plans } = storeToRefs(
    useFicResourceStore('v1')
  )

  const { trust_business_response } = storeToRefs(useTrustBusinessStore('v1'))

  const { defaultIconsLucide, formatCurrencyString, toSafeNumber } = useUtils()
  const { is_required } = useRules()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  const formElementRef = ref<QForm>()
  const unidentifiedContributionsTableRef = ref<InstanceType<
    typeof TableList
  > | null>(null)

  const unidentifiedContributionsTableProps = computed<
    ITableProps<IGenericInvestmentPlansLegalizeContribution>
  >(() => ({
    title: 'Aportes sin identificar',
    loading: props.data?.unidentifiedContributions.loading ?? false,
    columns: [
      {
        field: 'id',
        label: '#',
        name: 'id',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        field: 'operation_number',
        label: 'Número de operación',
        name: 'operation_number',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        field: (row: IGenericInvestmentPlansLegalizeContribution) =>
          row.contribution_date ?? '-',
        label: 'Fecha de aporte',
        name: 'contribution_date',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        field: 'value',
        label: 'Valor del aporte',
        name: 'contribution_value',
        align: 'left',
        required: true,
        sortable: true,
        format: (item) => (item ? formatCurrencyString(item) : '-'),
      },
      {
        field: 'returns',
        label: 'Rendimientos',
        name: 'contribution_returns',
        align: 'left',
        required: true,
        sortable: true,
        format: (item) => (item ? formatCurrencyString(item) : 0),
      },
      {
        field: 'balance',
        label: 'Saldo del aporte',
        name: 'contribution_balance',
        align: 'left',
        required: true,
        sortable: true,
        format: (item) => (item ? formatCurrencyString(item) : 0),
      },
      {
        field: 'retention',
        label: 'Retención contingente',
        name: 'contribution_retention',
        align: 'left',
        required: true,
        sortable: true,
        format: (item) => (item ? formatCurrencyString(item) : 0),
      },
    ],
    rows: props.data?.unidentifiedContributions.data ?? [],
    pages: props.data?.unidentifiedContributions.pages ?? {
      currentPage: 1,
      lastPage: 1,
    },
  }))

  const selectedUnidentifiedContribution =
    ref<IGenericInvestmentPlansLegalizeContribution | null>(null)

  const contributionValuePercentage = computed<number>(() => {
    if (!selectedUnidentifiedContribution.value) return 0

    return (
      selectedUnidentifiedContribution.value.value /
      selectedUnidentifiedContribution.value.balance
    )
  })

  const returnsPercentage = computed<number>(() => {
    if (!selectedUnidentifiedContribution.value) return 0

    return (
      selectedUnidentifiedContribution.value.returns /
      selectedUnidentifiedContribution.value.balance
    )
  })

  const lastInvestmentPlanDestinationId = ref<number>(1)

  const investmentPlanDestinationsTableProps = ref<
    ITableProps<Nullable<IGenericInvestmentPlansLegalizeDestinationItemList>>
  >({
    title: 'Plan de inversión destino',
    loading: false,
    columns: [
      {
        field: 'id',
        label: '#',
        name: 'id',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        field: 'collective_investment_fund_id',
        label: 'Código fondo de inversión',
        name: 'collective_investment_fund_id',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        field: 'fiduciary_investment_plan_id',
        label: 'Plan de inversión destino',
        name: 'fiduciary_investment_plan_id',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        field: 'business',
        label: 'Negocio',
        name: 'business',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        field: 'value',
        label: 'Saldo traslado',
        name: 'value',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        field: (row: IGenericInvestmentPlansLegalizeDestinationItemList) => {
          row.capital_value = row.value * contributionValuePercentage.value
          return row.capital_value
            ? formatCurrencyString(row.capital_value)
            : '-'
        },
        label: 'Valor de capital',
        name: 'capital_value',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        field: (row: IGenericInvestmentPlansLegalizeDestination) => {
          row.transfer_returns = row.value * returnsPercentage.value
          return row.transfer_returns
            ? formatCurrencyString(row.transfer_returns)
            : '-'
        },
        label: 'Rendimientos traslado',
        name: 'transfer_returns',
        align: 'left',
        required: true,
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
        required: false,
      },
    ],
    pages: { currentPage: 0, lastPage: 0 },
    rows: [],
  })

  const totalOperationCost = computed<string>(() => {
    const cost = investmentPlanDestinationsTableProps.value.rows.reduce(
      (acc, curr) => acc + (Number(curr.value) ?? 0),
      0
    )
    return formatCurrencyString(cost) ?? String(cost)
  })

  const isView = computed(() => ['view'].includes(props.action))

  const _handleIncreaseLastPlanDestiantionId = () => {
    lastInvestmentPlanDestinationId.value++
  }

  const handleAddInvestmentPlanDestinationRow = async () => {
    const currentFundId =
      props.data?.genericInvestmentPlan?.collective_investment_fund?.id ?? null

    const newRow: Nullable<IGenericInvestmentPlansLegalizeDestinationItemList> =
      {
        id: lastInvestmentPlanDestinationId.value,
        collective_investment_fund_id: currentFundId,
        fiduciary_investment_plan_id: null,
        value: null,
        transfer_returns: null,
        business: null,
        capital_value: null,
        fiduciary_investment_plan_options: [],
      }

    _handleIncreaseLastPlanDestiantionId()
    investmentPlanDestinationsTableProps.value.rows.push(newRow)

    if (currentFundId) {
      await handleCollectiveInvestmentFundIdChange(newRow.id, currentFundId)
    }
  }

  const handleRemoveInvestmentPlanDestinationRow = (rowId: number) => {
    investmentPlanDestinationsTableProps.value.rows =
      investmentPlanDestinationsTableProps.value.rows.filter(
        (row) => row.id !== rowId
      )
  }

  const handleSelectUnidentifiedContribution = (
    selectedContributions: (
      | IGenericInvestmentPlansLegalizeContribution
      | undefined
    )[]
  ) => {
    const [contribution] = selectedContributions
    selectedUnidentifiedContribution.value = contribution ?? null
  }

  const handleUnselectUnidentifiedContribution = () => {
    selectedUnidentifiedContribution.value = null
    unidentifiedContributionsTableRef.value?.clearSelection()
  }

  const handleCollectiveInvestmentFundIdChange = async (
    rowId: number | null,
    fundId: number
  ) => {
    const row = investmentPlanDestinationsTableProps.value.rows.find(
      (r) => r.id === rowId
    )
    if (!row) return

    row.collective_investment_fund_id = fundId
    row.fiduciary_investment_plan_id = null

    const fundObj = funts_to_investment_plans.value.find(
      (fund) => fund.id === fundId
    ) as IFicsFundResource | undefined

    if (!fundObj) return

    openMainLoader(true)

    await _getResources(
      { fics: ['fiduciary_investment_plans'] },
      `filter[collective_investment_fund_id]=${fundId}&noGeneric=true&status_id=1`
    )

    row.business = trust_business_response.value?.business_code ?? '-'
    row.fiduciary_investment_plan_options = fiduciary_investment_plans.value

    openMainLoader(false)
  }
  const handleSelectFiduciaryInvestmentPlanIdChange = (
    rowId: number | null,
    planId: number | null
  ) => {
    if (!rowId || !planId) return

    const row = investmentPlanDestinationsTableProps.value.rows.find(
      (r) => r.id === rowId
    )
    if (!row) return

    const selectedPlan = fiduciary_investment_plans.value.find(
      (plan) => plan.id === planId
    )

    if (!selectedPlan) {
      row.fiduciary_investment_plan_id = null
      row.business = null
      return
    }

    const businessCode = selectedPlan.business_trust?.business_code ?? ''
    const businessName = selectedPlan.business_trust?.name ?? ''
    row.business = `${businessCode} - ${businessName}`
  }
  const handleGetFormValues = (): IGenericInvestmentPlansLegalizeFormData => {
    const destinations = investmentPlanDestinationsTableProps.value.rows.map(
      (dest) => ({
        collective_investment_fund_id: toSafeNumber(
          dest.collective_investment_fund_id
        ),
        fiduciary_investment_plan_id: toSafeNumber(
          dest.fiduciary_investment_plan_id
        ),
        value: toSafeNumber(dest.value),
        transfer_returns: toSafeNumber(dest.transfer_returns),
      })
    )

    return {
      operation_investment_plan_id: selectedUnidentifiedContribution.value
        ?.id as number,
      total_value: destinations.reduce((acc, curr) => acc + curr.value, 0),
      total_transfer_returns: destinations.reduce(
        (acc, curr) => acc + curr.transfer_returns,
        0
      ),
      destinations,
    }
  }

  const handleValidateTotalOperationCost = (): boolean => {
    const contributionBalance = selectedUnidentifiedContribution.value?.balance
    const formValues = handleGetFormValues()

    if (formValues.destinations.length === 0) {
      showAlert('Debe ingresar al menos un plan de inversión destino', 'error')
      return false
    }

    if (formValues.total_value !== contributionBalance) {
      showAlert(
        'El total del saldo trasladado debe ser igual al saldo del aporte',
        'error'
      )
      return false
    }

    return true
  }

  watch(
    () => props.data,
    (data) => {
      if (!data) return
      handleUnselectUnidentifiedContribution()
    },
    { deep: true, immediate: true }
  )

  watch(
    selectedUnidentifiedContribution,
    () => (investmentPlanDestinationsTableProps.value.rows = [])
  )

  return {
    isView,
    is_required,
    formElementRef,
    defaultIconsLucide,
    totalOperationCost,
    handleGetFormValues,
    funts_to_investment_plans,
    handleValidateTotalOperationCost,
    selectedUnidentifiedContribution,
    unidentifiedContributionsTableRef,
    unidentifiedContributionsTableProps,
    handleSelectUnidentifiedContribution,
    investmentPlanDestinationsTableProps,
    handleAddInvestmentPlanDestinationRow,
    handleCollectiveInvestmentFundIdChange,
    handleRemoveInvestmentPlanDestinationRow,
    handleSelectFiduciaryInvestmentPlanIdChange,
  }
}

export default useLegalizationResourcesForm

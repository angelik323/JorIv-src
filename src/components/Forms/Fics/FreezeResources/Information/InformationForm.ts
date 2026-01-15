// Vue - Pinia - Quasar - Router
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Constantes
import { freezeOptions } from '@/constants'

// Interfaces
import {
  IFreezeOperationsResourcesCreate,
  IFreezeResourcesCreate,
  IFreezeResourcesCreateList,
} from '@/interfaces/customs/fics/FreezeResources'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFreezeResourcesStore } from '@/stores/fics/freeze-resources'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useInformationForm = (props: {
  action: 'freeze' | 'unFreeze'
}) => {
  const { isEmptyOrZero, formatCurrency, cleanValue } = useUtils()
  const route = useRoute()

  const { third_parties_fics } = storeToRefs(useTreasuryResourceStore('v1'))
  const { fiduciary_investment_plans_by_holder } = storeToRefs(
    useFicResourceStore('v1')
  )
  const { _setDataInformationForm } = useFreezeResourcesStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const descriptionUser = ref<string | null>(null)
  const userIdentifier = ref<number | null>(null)
  const selectedIds = ref<number[]>([])
  const typeFreeze = ref<boolean>(false)

  const userID = Number(route.query.id)

  const modelsFreeze = ref<IFreezeOperationsResourcesCreate>({
    freeze_type: '',
    freeze_value: null,
    unfreeze_value: null,
    orderer_identification: '',
    orderer_description: '',
    observations: '',
  })

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IFreezeResourcesCreateList[]
    pages: number
    rowsPerPage: number
  }>({
    title: 'Detalle congelamiento',
    loading: false,
    columns: [
      {
        name: 'check',
        label: '',
        field: 'check',
        align: 'left',
      },
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'investmentFundCode',
        label: 'Código fondo de inversión',
        field: 'investmentFundCode',
        align: 'left',
        sortable: true,
      },
      {
        name: 'destinationInvestmentPlan',
        label: 'Plan de inversión destino',
        field: 'destinationInvestmentPlan',
        align: 'left',
        sortable: true,
      },
      {
        name: 'investmentPlanDescription',
        label: 'Descripción plan de inversión',
        field: 'investmentPlanDescription',
        align: 'left',
        sortable: true,
        format: (_item) => descriptionUser.value,
      },
      {
        name: 'investmentPlanBalance',
        label: 'Saldo plan de inversión',
        field: (row) => formatCurrency(row.investmentPlanBalance ?? 0),
        align: 'left',
        sortable: true,
      },
      {
        name: 'unfreeze_balance',
        label: 'Saldo no congelado',
        field: (row) => formatCurrency(row.unfreeze_balance ?? 0),
        align: 'left',
        sortable: false,
      },
      {
        name: 'freezeType',
        label: 'Congelamiento',
        field: 'freezeType',
        align: 'left',
        sortable: false,
      },
      {
        name: 'freezeValue',
        label: 'Valor congelamiento',
        field: 'freezeValue',
        align: 'left',
        sortable: false,
      },
      {
        name: 'status_id',
        label: 'Estado',
        field: 'status',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: 1,
    rowsPerPage: 10,
  })

  const tablePropsUnFreeze = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IFreezeResourcesCreateList[]
    pages: number
    rowsPerPage: number
  }>({
    title: 'Detalle descongelamiento',
    loading: false,
    columns: [
      {
        name: 'check',
        label: '',
        field: 'check',
        align: 'left',
      },
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'investmentFundCode',
        label: 'Código fondo de inversión',
        field: 'investmentFundCode',
        align: 'left',
        sortable: true,
      },
      {
        name: 'destinationInvestmentPlan',
        label: 'Plan de inversión destino',
        field: 'destinationInvestmentPlan',
        align: 'left',
        sortable: true,
      },
      {
        name: 'investmentPlanDescription',
        label: 'Descripción plan de inversión',
        field: 'investmentPlanDescription',
        align: 'left',
        sortable: true,
        format: (_item) => descriptionUser.value,
      },
      {
        name: 'investmentPlanBalance',
        label: 'Saldo plan de inversión',
        field: (row) => formatCurrency(row.investmentPlanBalance ?? 0),
        align: 'left',
        sortable: true,
      },
      {
        name: 'freezeValue',
        label: 'Saldo congelado',
        field: (row) => formatCurrency(row.freezeValue ?? 0),
        align: 'left',
        sortable: false,
      },
      {
        name: 'freezeType',
        label: 'Descongelamiento',
        field: 'freezeType',
        align: 'left',
        sortable: false,
      },
      {
        name: 'unfreezeValue',
        label: 'Valor descongelamiento',
        field: 'unfreezeValue',
        align: 'left',
        sortable: false,
      },
      {
        name: 'status_id',
        label: 'Estado',
        field: 'status',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: 1,
    rowsPerPage: 10,
  })

  const handleOptions = (action: 'freeze' | 'unFreeze') => {
    const actionHandlers: Record<'freeze' | 'unFreeze', () => void> = {
      freeze: () => (typeFreeze.value = true),
      unFreeze: () => (typeFreeze.value = false),
    }
    actionHandlers[action]?.()
  }

  const loadUserData = async (id: number) => {
    if (props.action === 'unFreeze')
      await _getResources(
        {
          fics: [
            `fiduciary_investment_plans_by_holder&filter[holder_id]=${id}`,
          ],
        },
        'filter[unfreeze]=true'
      )
    else
      await _getResources({
        fics: [`fiduciary_investment_plans_by_holder&filter[holder_id]=${id}`],
      })

    tableProps.value.rows = fiduciary_investment_plans_by_holder.value.map(
      (item) => ({
        id: item.id ?? 0,
        selected: false,
        investmentFundCode: item.collective_investment_fund?.fund_code ?? '',
        destinationInvestmentPlan: item.code ?? '',
        investmentPlanDescription:
          item.collective_investment_fund?.fund_name ?? '',
        investmentPlanBalance: item.balance ?? 0,
        freezeType: '',
        freezeValue: 0,
        status: item.status?.status_id ?? '',
        unfreeze_balance: item.unfreeze_balance,
      })
    )

    tablePropsUnFreeze.value.rows =
      fiduciary_investment_plans_by_holder.value.map((item) => ({
        id: item.id ?? 0,
        selected: false,
        investmentFundCode: item.collective_investment_fund?.fund_code ?? '',
        destinationInvestmentPlan: item.code ?? '',
        investmentPlanDescription:
          item.collective_investment_fund?.fund_name ?? '',
        investmentPlanBalance: item.balance ?? 0,
        freezeType: '',
        freezeValue: item.freeze_balance ?? 0,
        unfreezeValue: 0,
        status: item.status?.status_id ?? '',
      }))

    const searchDescription = third_parties_fics.value.find(
      (item) => item.value === id
    )
    descriptionUser.value = searchDescription?.description ?? null
  }

  const uodateCheckId = (val: string, id: number) => {
    if (val) selectedIds.value.push(id)
    else selectedIds.value = selectedIds.value.filter((id) => id !== id)
  }

  const handleFreezeTypeChange = (
    row: IFreezeResourcesCreateList,
    val: string | null | undefined
  ) => {
    const type = val?.toLowerCase().trim() ?? ''
    row.freezeType = val ?? ''

    if (!type && typeFreeze.value) row.freezeValue = 0
    else row.unfreezeValue = 0

    if (typeFreeze.value) {
      if (type === 'total') row.freezeValue = row.unfreeze_balance ?? 0
      else row.freezeValue = 0

      if (selectedIds.value.includes(row.id)) {
        modelsFreeze.value.freeze_type = type
        modelsFreeze.value.freeze_value =
          row.freezeValue !== 0 ? row.freezeValue : null
      }
    } else {
      if (type === 'total') row.unfreezeValue = row.freezeValue ?? 0
      else row.unfreezeValue = 0

      if (selectedIds.value.includes(row.id)) {
        modelsFreeze.value.freeze_type = type
        modelsFreeze.value.freeze_value =
          row.unfreezeValue !== 0 ? row.unfreezeValue : null
      }
    }

    const tableRows = typeFreeze.value
      ? tableProps.value.rows
      : tablePropsUnFreeze.value.rows

    const selectedRows = tableRows.filter((r) =>
      selectedIds.value.includes(r.id)
    )

    const payloadList = selectedRows.map((r) => ({
      fiduciary_investment_plan_id: r.id,
      freeze_type: r.freezeType,
      freeze_value: r.freezeValue !== 0 ? r.freezeValue : null,
      unfreeze_value: r.unfreezeValue !== 0 ? r.unfreezeValue : null,
    }))

    _setDataInformationForm({
      orderer_identification: modelsFreeze.value.orderer_identification,
      orderer_description: modelsFreeze.value.orderer_description,
      observations: modelsFreeze.value.observations,
      operation_type: typeFreeze.value ? 'Congelamiento' : 'Descongelamiento',
      operations: payloadList,
    } as IFreezeResourcesCreate)
  }

  onMounted(async () => {
    handleOptions(props.action)

    if (userID) {
      userIdentifier.value = userID

      await loadUserData(userIdentifier.value)
    }
  })

  watch(
    () => userIdentifier.value,
    async (newVal) => {
      if (newVal) await loadUserData(Number(newVal))
    }
  )
  watch(
    () => selectedIds.value,
    (newList) => {
      if (!newList.length) {
        _setDataInformationForm(null)
        return
      }

      const tableRows = typeFreeze.value
        ? tableProps.value.rows
        : tablePropsUnFreeze.value.rows

      const selectedRows = tableRows.filter((row) => newList.includes(row.id))

      const payloadList = selectedRows.map((row) => {
        return {
          fiduciary_investment_plan_id: row.id,
          freeze_type: row.freezeType,
          freeze_value: row.freezeValue !== 0 ? row.freezeValue : null,
          unfreeze_value: row.unfreezeValue !== 0 ? row.unfreezeValue : null,
        }
      })

      _setDataInformationForm({
        orderer_identification: modelsFreeze.value.orderer_identification,
        orderer_description: modelsFreeze.value.orderer_description,
        observations: modelsFreeze.value.observations,
        operation_type: typeFreeze.value ? 'Congelamiento' : 'Descongelamiento',
        operations: payloadList,
      } as IFreezeResourcesCreate)
    }
  )

  watch(
    () => modelsFreeze.value,
    () => {
      if (!selectedIds.value.length || isEmptyOrZero(modelsFreeze.value)) {
        _setDataInformationForm(null)
        return
      }

      const tableRows = typeFreeze.value
        ? tableProps.value.rows
        : tablePropsUnFreeze.value.rows

      const selectedRows = tableRows.filter((row) =>
        selectedIds.value.includes(row.id)
      )

      const basePayload = {
        orderer_identification: modelsFreeze.value.orderer_identification,
        orderer_description: modelsFreeze.value.orderer_description,
        observations: modelsFreeze.value.observations,
        operation_type: typeFreeze.value ? 'Congelamiento' : 'Descongelamiento',
      }

      const payloadList = selectedRows.map((row) => ({
        fiduciary_investment_plan_id: row.id,
        freeze_type: row.freezeType,
        freeze_value: row.freezeValue !== 0 ? row.freezeValue : null,
        unfreeze_value: row.unfreezeValue !== 0 ? row.unfreezeValue : null,
      }))

      _setDataInformationForm({
        ...basePayload,
        operations: payloadList,
      })
    },
    { deep: true }
  )
  watch(
    [() => tableProps.value.rows, () => tablePropsUnFreeze.value.rows],
    () => {
      if (!selectedIds.value.length) {
        _setDataInformationForm(null)
        return
      }

      const tableRows = typeFreeze.value
        ? tableProps.value.rows
        : tablePropsUnFreeze.value.rows

      const selectedRows = tableRows.filter((row) =>
        selectedIds.value.includes(row.id)
      )

      const basePayload = {
        orderer_identification: modelsFreeze.value.orderer_identification,
        orderer_description: modelsFreeze.value.orderer_description,
        observations: modelsFreeze.value.observations,
        operation_type: typeFreeze.value ? 'Congelamiento' : 'Descongelamiento',
      }

      const payloadList = selectedRows.map((row) => ({
        fiduciary_investment_plan_id: row.id,
        freeze_type: row.freezeType,
        freeze_value: row.freezeValue !== 0 ? row.freezeValue : null,
        unfreeze_value: row.unfreezeValue !== 0 ? row.unfreezeValue : null,
      }))

      _setDataInformationForm({
        ...basePayload,
        operations: payloadList,
      } as IFreezeResourcesCreate)
    },
    { deep: true }
  )

  return {
    tableProps,
    selectedIds,
    cleanValue,
    modelsFreeze,
    freezeOptions,
    uodateCheckId,
    userIdentifier,
    descriptionUser,
    tablePropsUnFreeze,
    third_parties_fics,
    handleFreezeTypeChange,
  }
}

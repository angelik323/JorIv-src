// Vue - Pinia - Router
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import type { IFreezeResourceModel } from '@/interfaces/customs/fics/FreezeResources'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useUtils } from '@/composables'

// Stores
import { useFreezeResourcesStore } from '@/stores/fics/freeze-resources'

export const useFreezeResourcesView = () => {
  const { formatCurrency, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const store = useFreezeResourcesStore('v1')

  const { freeze_details_id } = storeToRefs(store)
  const { _getFreezeId } = store

  const models = ref<IFreezeResourceModel | null>(null)

  const freezeResourcesId = Number(route.params.id)

  const headerProps = ref({
    title: 'Ver congelamiento/descongelamiento de recursos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Congelamiento y descongelamiento de recursos',
        route: 'FreezeResourcesList',
      },
      { label: 'Ver', route: 'FreezeResourcesView' },
      {
        label: String(freezeResourcesId),
      },
    ],
  })

  const fields = computed(() => [
    {
      label: 'Código fondo de inversión',
      value: () => models.value?.fund?.fund_code || 'No registrado',
      fallback: 'No registrado',
    },
    {
      label: 'Plan de inversión destino',
      value: () => models.value?.plan?.plan_code || 'No registrado',
      fallback: 'No registrado',
    },
    {
      label: 'Descripción plan de inversión',
      value: () =>
        models.value?.holder?.document && models.value?.holder?.name
          ? `${models.value?.holder?.document} - ${models.value?.holder?.name}`
          : 'No registrado',
      fallback: 'No registrado',
    },
    {
      label: 'Saldo plan de inversión',
      value: () => formatCurrency(models.value?.plan?.plan_balance || 0),
      fallback: 'No registrado',
    },
    {
      label: 'Tipo de ' + (models.value?.operation_type || ''),
      value: () => models.value?.freeze_type || 'No registrado',
      fallback: 'No registrado',
    },
    {
      label: 'Valor congelado',
      value: () => formatCurrency(models.value?.freeze_value || 0),
      fallback: 'No registrado',
    },
    {
      label: 'Valor descongelado',
      value: () => formatCurrency(models.value?.unfreeze_value || 0),
      fallback: 'No registrado',
    },
    {
      label: 'Número congelamiento',
      value: () =>
        models.value?.operation_number?.toString() || 'No registrado',
      fallback: 'No registrado',
    },
    {
      label: 'Estado',
      value: () => models.value?.plan?.plan_status?.status || 'No registrado',
      fallback: 'No registrado',
    },
  ])
  const fields_orderer = [
    {
      label: 'Identificación ordenador',
      value: () => models.value?.orderer_identification || 'No registrado',
      fallback: 'No registrado',
    },
    {
      label: 'Descripción ordenador',
      value: () => models.value?.orderer_description || 'No registrado',
      fallback: 'No registrado',
    },
  ]

  const firstFields = [
    {
      label: 'Identificación',
      value: () => models.value?.holder?.document || 'No registrado',
      fallback: 'No registrado',
    },
    {
      label: 'Descripción titular',
      value: () => models.value?.holder?.name || 'No registrado',
      fallback: 'No registrado',
    },
  ]

  const refObservation = [
    {
      label: 'Observaciones',
      value: () => models.value?.observations || 'No registrado',
      fallback: 'No registrado',
    },
  ]

  const tabs: ITabs[] = [
    {
      name: 'InformationForm',
      label: 'Datos básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ]

  const activeTab = tabs[0].name
  const tabActiveIdx = 0

  const chunkArray = <T>(arr: T[], size: number): T[][] => {
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size))
    }
    return result
  }

  const fieldRows = computed(() => chunkArray(fields.value, 4))
  const fieldRowsOrderer = chunkArray(fields_orderer, 4)
  const firstRows = chunkArray(firstFields, 4)
  const observationRows = chunkArray(refObservation, 4)

  const setListDetail = () => {
    if (freeze_details_id.value) {
      const detail = freeze_details_id.value
      models.value = {
        id: detail.id,
        operation_type: detail.operation_type,
        collective_investment_fund_id: detail.collective_investment_fund_id,
        fund: detail.fund,
        fiduciary_investment_plan_id: detail.fiduciary_investment_plan_id,
        plan: detail.plan,
        plan_status: detail.plan_status,
        investment_plan_balance: detail.investment_plan_balance,
        freeze_type: detail.freeze_type,
        freeze_value: detail.freeze_value,
        operation_number: detail.operation_number,
        orderer_identification: detail.orderer_identification,
        orderer_description: detail.orderer_description,
        observations: detail.observations,
        holder: detail.holder,
        unfreeze_value: detail.unfreeze_value,
      }
    }
  }

  const handleGoToList = () =>
    goToURL('FreezeResourcesList', undefined, { reload: true })

  onMounted(async () => {
    await _getFreezeId(freezeResourcesId)
    setListDetail()
  })

  return {
    tabs,
    models,
    activeTab,
    fieldRows,
    firstRows,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    observationRows,
    fieldRowsOrderer,
  }
}

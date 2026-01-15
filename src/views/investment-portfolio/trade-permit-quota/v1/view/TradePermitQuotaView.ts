import { useMainLoader, useUtils } from '@/composables'
import { useTradePermitQuotaStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useTradePermitQuotaView = () => {
  const route = useRoute()
  const { _getTradePermitQuotaById } = useTradePermitQuotaStore('v1')
  const { data_information_form } = storeToRefs(useTradePermitQuotaStore('v1'))
  const { openMainLoader } = useMainLoader()

  const KEEP_EXISTING_DATE_AND_ADD_HOUR = true

  const headerProps = ref({
    title: 'Ver cupos y permisos Trader',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Definición cupos y permisos Trader',
        route: 'TradePermitQuotaList',
      },
      { label: 'Ver', route: 'TradePermitQuotaView' },
      { label: route.params.id.toString() },
    ],
  })

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const models = ref({
    id: '',
    trader_id: '',
    document_trader: '',
    description_trader: '',
    portfolio_code: '',
    description_portfolio_name: '',
    counterpart_id: '',
    document_counterpart: '',
    description_counterpart_name: '',
    emitter_id: '',
    document_emitter: '',
    description_emitter_name: '',
    general_quota: '',
    individual_quota: '',
    type_of_investment: '',
    Papers: '',
    created_at: '',
    creator_data: '',
    updated_at: '',
    update_data: '',
  })

  const rows = [
    {
      title: 'Información Trader',
      columns: [
        {
          label: 'Trader',
          value: () =>
            `${models.value.trader_id} / ${models.value.document_trader}`,
        },
        { label: 'Descripción', value: () => models.value.description_trader },
      ],
    },
    {
      title: 'Cupo Trader',
      columns: [
        { label: 'Cupo General', value: () => models.value.general_quota },
        {
          label: 'Cupo Individual',
          value: () => models.value.individual_quota,
        },
      ],
    },
    {
      title: 'Permisos',
      columns: [
        {
          label: 'Código Portafolio',
          value: () => models.value.portfolio_code,
        },
        {
          label: 'Descripción Portafolio',
          value: () => models.value.description_portfolio_name,
        },
        { label: 'ID Emisor', value: () => models.value.emitter_id },
        {
          label: 'Descripción Emisor',
          value: () => models.value.description_emitter_name,
        },
        { label: 'ID Contraparte', value: () => models.value.counterpart_id },
        {
          label: 'Descripción Contraparte',
          value: () => models.value.description_counterpart_name,
        },
        {
          label: 'Tipo Inversión',
          value: () => models.value.type_of_investment,
        },
        { label: 'Papeles', value: () => models.value.Papers },
      ],
    },
    {
      title: 'Historial de cupos y permisos Trader',
      columns: [
        { label: 'Fecha de creación', value: () => models.value.created_at },
        { label: 'Creado por', value: () => models.value.creator_data },
        {
          label: 'Fecha de actualización',
          value: () => models.value.updated_at,
        },
        {
          label: 'Actualizado por',
          value: () => models.value.update_data || 'No aplica',
        },
      ],
    },
  ]

  onMounted(async () => {
    openMainLoader(true)
    await _getTradePermitQuotaById(Number(route.params.id))

    if (data_information_form.value) {
      const h = data_information_form.value.history_permits_quotas_counterpart

      Object.assign(models.value, {
        id: data_information_form.value.id,
        trader_id: data_information_form.value.trader_id,
        document_trader: data_information_form.value.document_trader,
        description_trader: data_information_form.value.description_trader,
        portfolio_code: data_information_form.value.portfolio_code,
        description_portfolio_name:
          data_information_form.value.description_portfolio_name,
        counterpart_id: data_information_form.value.counterpart_id,
        document_counterpart: data_information_form.value.document_counterpart,
        description_counterpart_name:
          data_information_form.value.description_counterpart_name,
        emitter_id: data_information_form.value.emitter_id,
        document_emitter: data_information_form.value.document_emitter,
        description_emitter_name:
          data_information_form.value.description_emitter_name,
        general_quota: data_information_form.value.general_quota,
        individual_quota: data_information_form.value.individual_quota,
        type_of_investment: data_information_form.value.type_of_investment,
        Papers: data_information_form.value.Papers || '',

        created_at: useUtils().formatAuditDate(
          h?.created_at,
          KEEP_EXISTING_DATE_AND_ADD_HOUR
        ),
        creator_data: h?.creator_data,
        updated_at: useUtils().formatAuditDate(
          h?.updated_at,
          KEEP_EXISTING_DATE_AND_ADD_HOUR
        ),
        update_data: h?.update_data,
      })
    }
    openMainLoader(false)
  })

  onUnmounted(() => {
    data_information_form.value = null
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    models,
    rows,
  }
}

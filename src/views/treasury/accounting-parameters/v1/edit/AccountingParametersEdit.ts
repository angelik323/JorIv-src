import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useAccountingParamaterStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onBeforeMount, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAccountingParametersEdit = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form, idSelected, id_selected_edit } = storeToRefs(
    useAccountingParamaterStore('v1')
  )
  const accountingId = Number(id_selected_edit.value)

  const {
    _setDataInformationForm,
    _updateAccountingParameter,
    _getAccountingParameter,
  } = useAccountingParamaterStore('v1')

  const headerProps = ref({
    title: 'Editar parámetros contables de comisión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Bloques contables de recaudo',
        route: 'AccountingParametersList',
      },
      {
        label: 'Parámetros contables de recaudos',
        route: 'AccountingParametersList',
      },
      {
        label: 'Editar',
        route: 'AccountingParametersEdit',
      },
      {
        label: `${id_selected_edit.value}`,
        route: '',
      },
    ],
  })

  const tabs = reactive<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: 'list_bulleted',
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
  ])

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const makeDataRequest = () => ({
    accounting_blocks_collection_id: Number(idSelected.value),
    account_chart_id: data_information_form.value?.account_chart_id ?? 1,
    cost_center_id: data_information_form.value?.cost_center_id ?? 1,
    aux_type: data_information_form.value?.aux_type ?? '',
    third_party_id: data_information_form.value?.third_party_id ?? 1,
    cash_flow_structure_id:
      data_information_form.value?.cash_flow_structure_id ?? 1,
    contra_account_chart_id:
      data_information_form.value?.contra_account_chart_id ?? 1,
    contra_cost_center_id:
      data_information_form.value?.contra_cost_center_id ?? 1,
    contra_aux_type: data_information_form.value?.contra_aux_type ?? null,
    contra_third_party_id:
      data_information_form.value?.contra_third_party_id ?? null,
    contra_cash_flow_structure_id:
      data_information_form.value?.contra_cash_flow_structure_id ?? 1,
  })

  onBeforeMount(async () => {
    await _getAccountingParameter(accountingId)
  })

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()
    if (await _updateAccountingParameter(accountingId, payload)) {
      openMainLoader(false)
      router.push({ name: 'CollectionAccountingBlocksList' })
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
    openMainLoader(false)
  }

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  return {
    headerProps,
    data_information_form,
    activeTab,
    tabActiveIdx,
    tabs,
    onSubmit,
  }
}

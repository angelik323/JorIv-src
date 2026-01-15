import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useAccountingParamaterStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAccountingParametersCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form, idSelected } = storeToRefs(
    useAccountingParamaterStore('v1')
  )
  const { _createAccountingParameter, _setDataInformationForm } =
    useAccountingParamaterStore('v1')

  const headerProps = {
    title: 'Crear parámetros contables de comisión',
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
        label: 'Crear',
        route: 'AccountingParametersCreate',
      },
    ],
  }

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
    accounting_blocks_collection_id: idSelected.value,

    account_chart_id: data_information_form.value?.account_chart_id ?? 1,
    cost_center_id: data_information_form.value?.cost_center_id ?? 1,
    aux_type: data_information_form.value?.aux_type ?? '',
    third_party_id: data_information_form.value?.third_party_id ?? 1,
    cash_flow_structure_id:
      data_information_form.value?.cash_flow_structure_id ?? 1,
    contra_account_chart_id:
      data_information_form.value?.contra_account_chart_id ?? 1,
    contra_cost_center_id:
      data_information_form.value?.contra_cost_center_id ?? null,
    contra_aux_type: data_information_form.value?.contra_aux_type ?? '',
    contra_third_party_id:
      data_information_form.value?.contra_third_party_id ?? 1,
    contra_cash_flow_structure_id:
      data_information_form.value?.contra_cash_flow_structure_id ?? 1,
  })

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()
    if (await _createAccountingParameter(payload)) {
      openMainLoader(false)
      router.push({
        name: 'CollectionAccountingBlocksList',
        params: { id: idSelected.value },
      })
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
    activeTab,
    tabs,
    tabActiveIdx,
    onSubmit,
  }
}

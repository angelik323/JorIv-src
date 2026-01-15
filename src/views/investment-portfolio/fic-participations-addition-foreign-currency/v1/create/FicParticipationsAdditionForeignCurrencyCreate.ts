import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

import { defaultIconsLucide } from '@/utils'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'

import { IBasicDataForm, IComplianceConditionsForm, IDataOperationForeignCurrencyForm, IParticipationsAdditionForeignCurrencyCreate } from '@/interfaces/customs'
import { useResourceManagerStore, useFicParticipationsAdditionStore } from '@/stores'

const useFicParticipationsAdditionForeignCurrencyCreate = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createFicParticipationsAdditionForeignCurrency, _resetStore } = useFicParticipationsAdditionStore('v1')

  const data_information_form = ref<IBasicDataForm | null>(null)
  const data_operation_form = ref<IDataOperationForeignCurrencyForm | null>(null)
  const data_compliance_form = ref<IComplianceConditionsForm | null>(null)

  const informationFormRef = ref()
  const operationDataFormRef = ref()
  const complianceFormRef = ref()

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const keys = [
    //Basic data
    'investment_portfolio_code_local_currency',
    'emitter',
    'emitter_buyer',
    'administrators_codes',

    //Operation data
    'fic_participation_value_foreign',
    'class_portfolio',
    'currency_foreign',
    'operation_type',
    'isin_code_mnemonics',
  ]

  const headerProps = {
    title: `Registro adición participación FIC's moneda extranjera`,
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversión',
        route: '',
      },
      {
        label: `Registro adición participación FIC's moneda extranjera`,
        route: 'FicParticipationsAdditionForeignCurrencyCreate',
      }
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
      required: true,
    },
    {
      name: 'operation',
      label: 'Datos operación',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'compliance',
      label: 'Condiciones de cumplimiento',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(filteredTabs.value.findIndex((tab) => tab.name === tabActive.value))

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef, operationDataFormRef, complianceFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IBasicDataForm> = {
      ...makeBaseInfoRequest(data_information_form.value, data_operation_form.value, data_compliance_form.value),
    }

    return apiRequestBody
  }

  const makeBaseInfoRequest = (data: IBasicDataForm | null, data_operation: IDataOperationForeignCurrencyForm | null, data_compliance: IComplianceConditionsForm | null) => {
    if(data_operation) data_operation.origin_currency_balance = String(Math.round((Number(data_operation?.origin_currency_balance) + Number.EPSILON) * 100) / 100)
    if (!data) return {}
    const request: Partial<IParticipationsAdditionForeignCurrencyCreate> = {
      investment_portfolio_id: data.investment_portfolio_id,
      operation_date: data.operation_date,
      issuer_id: data.issuer_id,
      counterparty_id: data.counterparty_id,
      administrator_id: data.administrator_id,
      data_operation: data_operation || undefined,
      compliance: data_compliance || undefined,
    }
    return cleanEmptyFields(request)
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createFicParticipationsAdditionForeignCurrency(payload)
    if (success) {
      setTimeout(() => {
        data_information_form.value = null
        data_operation_form.value = null
        data_compliance_form.value = null

        tabActiveIdx.value = 0
        tabActive.value = filteredTabs.value[0].name
      }, 1000)

      _resetStore()
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources({
      investment_portfolio: keys,
    })
  })

  watch(
    () => data_information_form.value?.issuer_id,
    () => {
      data_operation_form.value = null
      data_compliance_form.value = null
    }
  )

  onBeforeUnmount(() => {
    _resetKeys({
      investment_portfolio: keys,
    })
  })

  return {
    data_information_form,
    data_operation_form,
    data_compliance_form,
    informationFormRef,
    operationDataFormRef,
    complianceFormRef,
    headerProps,
    tabs,
    filteredTabs,
    tabActive,
    tabActiveIdx,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useFicParticipationsAdditionForeignCurrencyCreate
// vue - quasar
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IAccountingConfigurationCreate,
  IAccountingConfigurationForm,
} from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'

// composables
import {
  useAlert,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// stores
import { useAccountingConfigurationStore } from '@/stores/fixed-assets/accounting-configuration'

const useAccountingConfigurationCreate = () => {
  // imports
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  // principal data store
  const { headerPropsDefault } = storeToRefs(
    useAccountingConfigurationStore('v1')
  )
  const { _createAccountingConfiguration } =
    useAccountingConfigurationStore('v1')

  // breadcrumb
  const headerPropsCreate = {
    title: `Crear ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Crear',
          route: 'AccountingConfigurationCreate',
        },
      ],
    ],
  }

  // tabs
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
  ])
  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  // form
  const informationFormRef = ref()
  const data_information_form = ref<IAccountingConfigurationForm | null>(null)

  const validateForms = async () => {
    const validation = await informationFormRef.value?.validateAllForms()

    if (!validation.isValid) {
      showAlert(validation.message, 'error', undefined, 3000)
      return false
    }

    return true
  }

  // actions
  const goToList = () => {
    router.push({ name: 'AccountingConfigurationList' })
  }

  const goToImport = () => {
    router.push({ name: 'AccountingConfigurationImport' })
  }

  const makeDataRequest = (): IAccountingConfigurationCreate | null => {
    if (!data_information_form.value) return null

    const form = data_information_form.value

    const completedParameters = (form.accounting_parameters || [])
      .filter(
        (setting) =>
          setting.configuration_novelty_type_id &&
          setting.debit_nature &&
          setting.debit_accounts_chart_id &&
          setting.credit_nature &&
          setting.credit_accounts_chart_id &&
          setting.detail_transaction
      )
      .map(({ novelty_code, ...rest }) => ({
        ...rest,
        configuration_novelty_type_id: Number(
          rest.configuration_novelty_type_id
        ),
      }))

    return {
      source: form.source,
      business_trust_id: form.business_trust_id,
      configuration_type_id: form.configuration_type_id,
      configuration_subtype_id: form.configuration_subtype_id,
      receipt_type_id: form.receipt_type_id,
      receipt_subtype_id: form.receipt_subtype_id,
      accounting_parameters: completedParameters,
    }
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    if (!payload) {
      openMainLoader(false)
      return
    }
    const success = await _createAccountingConfiguration(payload)

    if (success) {
      setTimeout(() => {
        openMainLoader(false)
        goToList()
      }, 5000)
    } else {
      openMainLoader(false)
    }
  }

  return {
    headerPropsCreate,
    tabs,
    tabActive,
    tabActiveIdx,

    informationFormRef,
    data_information_form,

    goToList,
    goToImport,
    onSubmit,
    validateRouter,
  }
}

export default useAccountingConfigurationCreate

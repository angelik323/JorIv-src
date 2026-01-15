// vue
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  IAccountingConfigurationCreate,
  IAccountingConfigurationForm,
} from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'

// composables
import { useAlert, useMainLoader, useUtils } from '@/composables'

// stores
import { useAccountingConfigurationStore } from '@/stores'

const useAccountingConfigurationEdit = () => {
  // imports
  const { showAlert } = useAlert()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  // principal data store
  const { headerPropsDefault } = storeToRefs(
    useAccountingConfigurationStore('v1')
  )
  const {
    _clearData,
    _getAccountingConfigurationById,
    _updateAccountingConfiguration,
  } = useAccountingConfigurationStore('v1')

  // router
  const router = useRouter()
  const route = useRoute()
  const accountingConfigurationId = +route.params.id

  // breadcrumb
  const headerPropsCreate = {
    title: `Editar ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      ...[
        {
          label: 'Editar',
          route: 'AccountingConfigurationEdit',
        },
      ],
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
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
  const original_data = ref<IAccountingConfigurationForm | null>(null)

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
    const success = await _updateAccountingConfiguration(
      payload,
      accountingConfigurationId
    )

    if (success) {
      setTimeout(() => {
        openMainLoader(false)
        goToList()
      }, 5000)
    } else {
      openMainLoader(false)
    }
  }

  // lifecycle
  onMounted(async () => {
    if (!accountingConfigurationId) return
    openMainLoader(true)

    const response = await _getAccountingConfigurationById(
      accountingConfigurationId
    )

    data_information_form.value = response as IAccountingConfigurationForm
    original_data.value = response as IAccountingConfigurationForm
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(() => {
    _clearData()
  })

  return {
    accountingConfigurationId,
    headerPropsCreate,

    tabs,
    tabActive,
    tabActiveIdx,

    informationFormRef,
    data_information_form,

    goToList,
    onSubmit,
  }
}

export default useAccountingConfigurationEdit

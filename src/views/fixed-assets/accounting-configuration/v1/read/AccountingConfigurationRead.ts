// vue
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IAccountingConfigurationForm } from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'

// composables
import { useMainLoader, useUtils } from '@/composables'

// stores
import { useAccountingConfigurationStore } from '@/stores'

const useAccountingConfigurationRead = () => {
  // imports
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  // principal data store
  const { headerPropsDefault } = storeToRefs(
    useAccountingConfigurationStore('v1')
  )
  const { _clearData, _getAccountingConfigurationById } =
    useAccountingConfigurationStore('v1')

  // router
  const router = useRouter()
  const route = useRoute()
  const accountingConfigurationId = +route.params.id

  // breadcrumb
  const headerPropsRead = {
    title: `Ver ${headerPropsDefault.value.title.toLowerCase()}`,
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: `Ver - ID: ${accountingConfigurationId}`,
        route: 'AccountingConfigurationRead',
      },
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

  // actions
  const goToList = () => {
    router.push({ name: 'AccountingConfigurationList' })
  }

  // lifecycle
  onBeforeMount(async () => {
    if (!accountingConfigurationId) return
    openMainLoader(true)

    const response = await _getAccountingConfigurationById(
      accountingConfigurationId
    )
    data_information_form.value = response as IAccountingConfigurationForm

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _clearData()
  })

  return {
    accountingConfigurationId,
    headerPropsRead,

    tabs,
    tabActive,
    tabActiveIdx,

    informationFormRef,
    data_information_form,

    goToList,
  }
}

export default useAccountingConfigurationRead

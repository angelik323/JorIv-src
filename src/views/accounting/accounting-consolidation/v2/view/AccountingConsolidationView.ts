// Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl, useMainLoader } from '@/composables'

// Interfaces
import { IAccountingConsolidationBasicData } from '@/interfaces/customs/accounting/AccountingConsolidationV2'
import { ITabs } from '@/interfaces/global'

// Stores
import { useResourceManagerStore } from '@/stores'
import { useAccountingConsolidationStore } from '@/stores/accounting/accounting-consolidation'

const useAccountingConsolidationView = () => {
  // Destructure store and refs
  const { headerProps, consolidation_response } = storeToRefs(
    useAccountingConsolidationStore('v2')
  )
  const { _getProcessConsolidation } = useAccountingConsolidationStore('v2')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  //Router and Composables
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const routeParams = route.params.id
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // Header properties
  const headerProperties = {
    title: 'Ver consolidación de contabilidades',
    breadcrumbs: [
      ...headerProps.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'AccountingConsolidationView',
      },
      {
        label: String(routeParams),
        route: '',
      },
    ],
  }

  //Form data
  const basic_data_form = ref<IAccountingConsolidationBasicData | null>(null)

  //Tabs properties
  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const setFormView = (data: IAccountingConsolidationBasicData) => {
    basic_data_form.value = { ...data }
  }
  // Prepare request data for children filters
  const accountingKeys = {
    accounting: [
      'account_structures',
      'business_trusts_to_consolidate',
      'consolidate_status',
    ],
  }

  // Lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)
    await _getResources(accountingKeys, '', 'v2')
    await _getProcessConsolidation(Number(routeParams))
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(accountingKeys)
  })

  watch(
    () => consolidation_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    //Header and tabs properties
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,

    //Form refs and data
    basic_data_form,

    //Submit function
    goToURL,
  }
}

export default useAccountingConsolidationView

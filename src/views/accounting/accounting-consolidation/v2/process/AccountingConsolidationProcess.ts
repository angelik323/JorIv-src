// Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
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

const useAccountingConsolidationProcess = () => {
  // Destructure store and refs
  const { headerProps } = storeToRefs(useAccountingConsolidationStore('v2'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { goToURL } = useGoToUrl()
  //Router and Composables
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  // Header properties
  const headerProperties = {
    title: 'Procesar consolidación de contabilidades',
    breadcrumbs: [
      ...headerProps.value.breadcrumbs,
      {
        label: 'Procesar',
        route: 'AccountingConsolidationProcess',
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

  // Prepare request data for children filters
  const accountingKeys = {
    accounting: ['business_trusts_to_consolidate'],
  }
  //account_chart_structure_accounting

  // Lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)
    await _getResources(accountingKeys)
    await _getResources(
      {
        accounting: [
          'consolidate_status',
          'account_chart_structure_accounting',
        ],
      },
      '',
      'v2'
    )
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(accountingKeys)
    _resetKeys({
      accounting: ['consolidate_status', 'account_chart_structure_accounting'],
    })
  })

  return {
    //Header and tabs properties
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
    //Form refs and data
    basic_data_form,
  }
}

export default useAccountingConsolidationProcess

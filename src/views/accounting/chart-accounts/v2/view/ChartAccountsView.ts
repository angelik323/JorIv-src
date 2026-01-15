// vue | store
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useChartAccountsStore, useResourceManagerStore } from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'

// interface

const useChartAccountsView = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const chartAccountId = +route.params.id

  const { defaultIconsLucide } = useUtils()

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form, chart_accounts_request } = storeToRefs(
    useChartAccountsStore('v2')
  )
  const { _setDataInformationForm, _getByIdChartAccount } =
    useChartAccountsStore('v2')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // props
  const headerProps = {
    title: 'Ver plan de cuentas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Plan de cuentas', route: 'ChartAccountsList' },
      { label: 'Ver', route: 'ChartAccountsView' },
      { label: `${chartAccountId}` },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
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

  // keys
  const keys = [
    'account_structures_available',
    'catalog_limit_types',
    'catalog_limit_groups_balance',
    'catalog_limit_groups_results',
    'catalog_limit_groups_control',
  ]

  // onMount
  onMounted(async () => {
    _resetKeys({
      accounting: [
        ...keys,
        'type_operators',
        'type_nature',
        'accounting_account_structures',
      ],
    })
    _getResources({ accounting: keys })
    _getResources(
      {
        accounting: [
          'type_operators',
          'type_nature',
          'accounting_account_structures',
        ],
      },
      '',
      'v2'
    )
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getByIdChartAccount(chartAccountId)
    openMainLoader(false)
  })

  // Submit
  const onSubmit = async () => {
    router.push({
      name: 'ChartAccountsList',
    })
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    chart_accounts_request,
    onSubmit,
  }
}

export default useChartAccountsView

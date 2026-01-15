// vue | store
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useChartAccountsStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIcons } from '@/utils'

// interface
import { ITabs } from '@/interfaces/customs/Tab'

const useChartAccountsView = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const chartAccountId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form, chart_accounts_request } = storeToRefs(
    useChartAccountsStore('v1')
  )
  const { _setDataInformationForm, _getByIdChartAccount } =
    useChartAccountsStore('v1')

  const { _getAccountingResources } = useResourceStore('v1')

  // keys
  const keys = ['account_structures_available']

  // props
  const headerProps = {
    title: 'Ver plan de cuentas',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Plan de cuentas',
        route: 'ChartAccountsList',
      },
      {
        label: 'Ver',
        route: 'ChartAccountsView',
      },
      {
        label: `${chartAccountId}`,
      },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
      icon: defaultIcons.bulletList,
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

  // onMount
  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
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

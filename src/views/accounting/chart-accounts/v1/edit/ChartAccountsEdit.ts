// vue | store
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useChartAccountsStore, useResourceManagerStore } from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIcons } from '@/utils'

// interface
import { ITabs } from '@/interfaces/customs/Tab'
import { IChartAccountCreate } from '@/interfaces/customs'

const useChartAccountsEdit = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const chartAccountId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form, chart_accounts_request } = storeToRefs(
    useChartAccountsStore('v1')
  )

  const { _updateChartAccount, _setDataInformationForm, _getByIdChartAccount } =
    useChartAccountsStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  // keys
  const keys = { accounting: ['account_structures_available_for_store'] }

  // props
  const headerProps = {
    title: 'Editar plan de cuentas',
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
        label: 'Editar',
        route: 'ChartAccountsEdit',
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

  // refs
  const formInformation = ref()

  // actions
  const makeDataRequest = (): IChartAccountCreate => {
    return {
      account_structure_id:
        data_information_form.value?.account_structure_id ?? undefined,
      accounts:
        data_information_form.value?.accounts?.map((item) => ({
          ...item,
          code: !item.id ? item.code ?? '' : undefined,
          status_id: item.status_id
            ? item.status_id
            : item.status?.id ?? undefined,
          status: undefined,
        })) ?? [],
      accounts_to_delete: data_information_form.value?.accounts_to_delete ?? [],
    }
  }

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  // onMount
  onMounted(async () => {
    await _getResources(keys, '', 'v2')
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

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const data: IChartAccountCreate = makeDataRequest()
      if (await _updateChartAccount(data, chartAccountId)) {
        router.push({
          name: 'ChartAccountsList',
        })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    chart_accounts_request,
    onSubmit,
  }
}

export default useChartAccountsEdit

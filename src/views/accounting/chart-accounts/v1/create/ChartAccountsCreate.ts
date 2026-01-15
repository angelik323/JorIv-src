// vue | store
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { useChartAccountsStore, useResourceManagerStore } from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interface
import { ITabs } from '@/interfaces/customs/Tab'
import { IChartAccountCreate } from '@/interfaces/customs'

const useChartAccountsCreate = () => {
  const router = useRouter()

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(useChartAccountsStore('v1'))
  const { _createChartAccount, _setDataInformationForm, _saveImport } =
    useChartAccountsStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  // keys
  const keys = { accounting: ['account_structures_available_for_store'] }

  // props
  const headerProps = {
    title: 'Crear plan de cuentas',
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
        label: 'Crear',
        route: 'ChartAccountsCreate',
      },
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

  // refs
  const formInformation = ref()

  // actions
  const makeDataRequest = () => {
    return {
      account_structure_id:
        data_information_form.value?.account_structure_id ?? undefined,
      accounts: data_information_form.value?.accounts ?? [],
    }
  }

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  const isImport = async () => {
    return (await formInformation.value?.isImport()) ?? false
  }

  // onMount
  onMounted(async () => {
    await _getResources(keys, '', 'v2')
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  const onSubmit = async () => {
    if (!(await validateForm())) return

    openMainLoader(true)

    try {
      if (await isImport()) {
        await _saveImport()
        router.push({ name: 'ChartAccountsList' })
      } else {
        const data: IChartAccountCreate = makeDataRequest()
        const created = await _createChartAccount(data)
        if (created) {
          router.push({ name: 'ChartAccountsList' })
        }
      }
    } finally {
      setTimeout(() => openMainLoader(false), 1000)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    data_information_form,
    onSubmit,
  }
}

export default useChartAccountsCreate

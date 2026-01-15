// vue | store
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interface
import { ITabs } from '@/interfaces/customs/Tab'
import { IChartAccountCreate } from '@/interfaces/customs'

import { useChartAccountsStore, useResourceManagerStore } from '@/stores'

const useChartAccountsCreate = () => {
  const router = useRouter()

  const { goToURL } = useGoToUrl()

  const { defaultIconsLucide } = useUtils()
  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form, selected_structure_accounts } = storeToRefs(
    useChartAccountsStore('v2')
  )
  const { _createChartAccount, _setDataInformationForm, _saveImport } =
    useChartAccountsStore('v2')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  // props
  const headerProps = {
    title: 'Crear plan de cuentas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Plan de cuentas', route: 'ChartAccountsList' },
      { label: 'Crear', route: 'ChartAccountsCreate' },
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

  const keys = {
    accounting: [
      'accounting_account_structures',
      'third_parties_formatted',
      'type_operators',
      'type_nature',
    ],
  }
  onMounted(async () => {
    openMainLoader(true)
    _resetKeys({
      accounting: [
        'accounting_account_structures',
        'third_parties_formatted',
        'account_chart_types',
        'account_structures_available',
        'catalog_limit_types',
        'catalog_limit_groups_balance',
        'catalog_limit_groups_results',
        'catalog_limit_groups_control',
      ],
      investment_portfolio: ['coins'],
      fics: ['movements_codes'],
    })
    await _getResources(keys, '', 'v2')
    await _getResources({
      investment_portfolio: ['coins'],
      accounting: [
        'account_chart_types',
        'account_structures_available',
        'catalog_limit_types',
        'catalog_limit_groups_balance',
        'catalog_limit_groups_results',
        'catalog_limit_groups_control',
      ],
      fics: ['movements_codes'],
    })
    openMainLoader(false)
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
        if (!data.accounts?.length) {
          goToURL('ChartAccountsList')
          return
        }
        const created = await _createChartAccount(data)
        if (created) {
          goToURL('ChartAccountsList')
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
    defaultIconsLucide,
    data_information_form,
    selected_structure_accounts,
    onSubmit,
  }
}

export default useChartAccountsCreate

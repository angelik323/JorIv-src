// vue | store
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useChartAccountsStore, useResourceManagerStore } from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader, useUtils } from '@/composables'

// interface
import { ITabs } from '@/interfaces/customs/Tab'
import { IChartAccountCreate } from '@/interfaces/customs'

const useChartAccountsEdit = () => {
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

  const { _updateChartAccount, _setDataInformationForm, _getByIdChartAccount } =
    useChartAccountsStore('v2')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // keys
  const keys = {
    accounting: [
      'account_structures_available_for_store',
      'accounting_account_structures',
      'third_parties_formatted',
      'type_operators',
      'type_nature',
    ],
  }

  // props
  const headerProps = {
    title: 'Editar plan de cuentas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Plan de cuentas', route: 'ChartAccountsList' },
      { label: 'Editar', route: 'ChartAccountsEdit' },
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

  // refs
  const formInformation = ref()

  // actions
  const makeDataRequest = (): IChartAccountCreate => {
    return {
      account_structure_id:
        data_information_form.value?.account_structure_id ?? undefined,
      accounts: data_information_form.value?.accounts?.map((item) => {
        const accountData = {
          ...item,
          code: !item.id ? item.code ?? '' : undefined,
          status_id: item.status_id
            ? item.status_id
            : item.status?.id ?? undefined,
          status: undefined,
        }
        if (accountData.is_currency_reexpressed) {
          accountData.reexpression_settings = {
            positive: {
              account_code_id:
                item.reexpression_settings?.positive?.account_code_id || null,
              third_party_id:
                item.reexpression_settings?.positive?.third_party_id || null,
              fund_movement_id:
                item.reexpression_settings?.positive?.fund_movement_id || null,
            },
            negative: {
              account_code_id:
                item.reexpression_settings?.negative?.account_code_id || null,
              third_party_id:
                item.reexpression_settings?.negative?.third_party_id || null,
              fund_movement_id:
                item.reexpression_settings?.negative?.fund_movement_id || null,
            },
          }
        } else if (
          !accountData.is_currency_reexpressed &&
          accountData.reexpression_settings
        ) {
          delete accountData.reexpression_settings
        }
        return accountData
      }),
      accounts_to_delete: data_information_form.value?.accounts_to_delete ?? [],
    }
  }

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  // onMount
  onMounted(async () => {
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
    _getResources(
      { accounting: ['account_chart_by_account_structure'] },
      `filter[account_structure_id]=${chartAccountId}`,
      'v2'
    )
    _getResources({
      investment_portfolio: ['coins'],
      accounting: [
        'account_chart_types',
        'account_structures_available',
        'accounting_account_structures',
        'catalog_limit_types',
        'catalog_limit_groups_balance',
        'catalog_limit_groups_results',
        'catalog_limit_groups_control',
      ],
      fics: ['movements_codes'],
    })
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

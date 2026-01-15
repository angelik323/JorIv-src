// Core
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'

const usePeriodClosureParameterCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { _createPeriodClosureParameter, _cleanPeriodClosureParametersData } =
    usePeriodClosureParametersStore('v2')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const periodClosureParameterForm = ref()

  const headerProps = {
    title: 'Crear parámetros de cierre',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Parámetro de cierre',
        route: 'PeriodClosureParameterList',
      },
      { label: 'Crear' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    return periodClosureParameterForm?.value?.validateForm()
  }

  const { goToURL } = useGoToUrl()

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = periodClosureParameterForm.value.getFormData()
      if (!payload.daily_parameters.length) {
        delete payload.daily_parameters
      }
      if (!payload.monthly_parameters.length) {
        delete payload.monthly_parameters
      }
      if (!payload.yearly_parameters.length) {
        delete payload.yearly_parameters
      }
      if (await _createPeriodClosureParameter(payload)) {
        goToURL('PeriodClosureParameterList')
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const keys = {
    accounting: [
      'account_closing_events',
      'account_closing_natures',
      'available_accounting_structures',
    ],
  }

  const keysV2 = {
    accounting: [
      'accounting_closing_parameter_third_parties',
      'account_closing_natures_full',
      'closing_third_party_types',
      'third_parties_formatted',
    ],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    _getResources(keysV2, '', 'v2')
    _getResources(
      { accounting: ['sub_receipt_types'] },
      'filter[is_cancellation]=false&filter[voucher_type]=Automático&filter[status_id]=1',
      'v2'
    )
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: [
        'account_closing_events',
        'account_closing_natures',
        'available_accounting_structures',
        'accounting_closing_parameter_third_parties',
        'account_closing_natures_full',
        'closing_third_party_types',
        'third_parties_formatted',
        'sub_receipt_types',
        'account_structures_for_params',
        'accounting_chart_operative_by_structure',
      ],
    })
    _cleanPeriodClosureParametersData()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    periodClosureParameterForm,
    onSubmit,
  }
}

export default usePeriodClosureParameterCreate

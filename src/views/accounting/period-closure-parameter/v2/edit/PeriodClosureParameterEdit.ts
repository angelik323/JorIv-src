// Core
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'

const usePeriodClosureParameterEdit = () => {
  const route = useRoute()
  const periodClosureParameterId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const {
    _updatePeriodClosureParameter,
    _getPeriodClosureParameter,
    _cleanPeriodClosureParametersData,
  } = usePeriodClosureParametersStore('v2')

  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const periodClosureParameterForm = ref()

  const headerProps = {
    title: 'Editar parámetros cierre de período',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Parámetro cierre de periodo',
        route: 'PeriodClosureParameterList',
      },
      { label: 'Editar' },
      { label: `${periodClosureParameterId}` },
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
      if (
        await _updatePeriodClosureParameter(periodClosureParameterId, payload)
      ) {
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

  const paramsData = ref()

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    _getResources(keysV2, '', 'v2')
    _getResources(
      { accounting: ['sub_receipt_types'] },
      'filter[is_cancellation]=false&filter[voucher_type]=Automático&filter[status_id]=1',
      'v2'
    )
    if (periodClosureParameterId) {
      _getResources(
        { accounting: ['accounting_chart_operative_by_structure'] },
        `filter[account_structures_id]=${periodClosureParameterId}`
      )
    }
    paramsData.value = await _getPeriodClosureParameter(
      periodClosureParameterId
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
    periodClosureParameterId,
    paramsData,
    onSubmit,
  }
}

export default usePeriodClosureParameterEdit

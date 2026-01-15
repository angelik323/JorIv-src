import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { defaultIconsLucide } from '@/utils'
import { useMainLoader } from '@/composables'

import { IAccountingClosingParameterModel } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'

const usePeriodClosureParameterCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _createPeriodClosureParameter, _cleanPeriodClosureParametersData } =
    usePeriodClosureParametersStore('v1')

  const { period_closure_parameter } = storeToRefs(
    usePeriodClosureParametersStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { account_closing_events, available_accounting_structures } =
    storeToRefs(useAccountingResourceStore('v1'))

  const periodClosureParameterForm = ref()

  const headerProps = {
    title: 'Crear parámetros cierre de período',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Parámetro cierre de periodo',
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

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = periodClosureParameterForm.value.getFormData()
      payload.parameters.forEach(
        (parameter: IAccountingClosingParameterModel) => {
          parameter.structure_id = payload.structure.id
          if (parameter.cost_center_id === 0) {
            delete parameter.cost_center_id
          }
          if (parameter.counterpart_cost_center_id === 0) {
            delete parameter.counterpart_cost_center_id
          }
        }
      )
      if (await _createPeriodClosureParameter(payload)) {
        router.push({ name: 'PeriodClosureParameterList' })
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
      'accounting_closing_parameter_cost_centers',
    ],
  }

  const keysV2 = {
    accounting: ['accounting_closing_parameter_third_parties'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    available_accounting_structures.value =
      available_accounting_structures.value.map((item) => ({
        ...item,
        value: item.value,
        label: `${item.code} - ${item.structure} - ${item.purpose}`,
      }))
    period_closure_parameter.value.parameters.forEach((parameter) => {
      const closing_param = account_closing_events.value.find(
        (event) => event.value !== parameter.event
      )
      if (closing_param) {
        _cleanPeriodClosureParametersData()
      }
    })
    _getResources(keysV2, '', 'v2')
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysV2)
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

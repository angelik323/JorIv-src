import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { IAccountingClosingParameterModel } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'

const usePeriodClosureParameterEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const periodClosureParameterId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const {
    _updatePeriodClosureParameter,
    _getPeriodClosureParameter,
    _cleanPeriodClosureParametersData,
  } = usePeriodClosureParametersStore('v1')

  const { period_closure_parameter } = storeToRefs(
    usePeriodClosureParametersStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { available_accounting_structures } = storeToRefs(
    useAccountingResourceStore('v1')
  )

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

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = periodClosureParameterForm.value.getFormData()
      payload.parameters.forEach(
        (parameter: IAccountingClosingParameterModel) => {
          if (parameter.cost_center_id === 0) {
            delete parameter.cost_center_id
          }
          if (parameter.counterpart_cost_center_id === 0) {
            delete parameter.counterpart_cost_center_id
          }
        }
      )
      if (
        await _updatePeriodClosureParameter(periodClosureParameterId, payload)
      ) {
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
    _getResources(keysV2, '', 'v2')

    _getPeriodClosureParameter(periodClosureParameterId).then(() => {
      const selectedStructureId =
        period_closure_parameter.value.parameters[0].structure_id
      if (selectedStructureId) {
        _getResources(
          { accounting: ['accounting_chart_operative_by_structure'] },
          `filter[account_structures_id]=${selectedStructureId}`
        )
        _getResources(
          { accounting: ['accounting_closing_parameter_cost_centers'] },
          `filter[accounts_chart_id]=${selectedStructureId}`
        )
      }
    })
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
    periodClosureParameterId,
    onSubmit,
  }
}

export default usePeriodClosureParameterEdit

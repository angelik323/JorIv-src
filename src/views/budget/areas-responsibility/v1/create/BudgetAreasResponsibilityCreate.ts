// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IAreasResponsibilityBasicDataForm } from '@/interfaces/customs/budget/AreasResponsibility'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useBudgetAreasResponsibilityStore } from '@/stores/budget/areas-responsibility'

export const useAreasResponsibilityCreate = () => {
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { headerPropsDefault, data_areas_responsibility_form } = storeToRefs(
    useBudgetAreasResponsibilityStore('v1')
  )

  const { _setDataAreasResponsibilityForm, _createAreasResponsibility } =
    useBudgetAreasResponsibilityStore('v1')

  const { budget_account_structures: account_structures } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const area_structures = ref()
  const cost_center_structures = ref()

  const headerProperties = {
    title: 'Crear áreas de responsabilidad',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'BudgetAreasResponsibilityCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'BasicDataAreasResponsibility',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const makeDataRequest = (): IAreasResponsibilityBasicDataForm => {
    return {
      structure_area_id:
        data_areas_responsibility_form.value?.structure_area_id ?? null,
      structure_cost_center_id:
        data_areas_responsibility_form.value?.structure_cost_center_id ?? null,
      code: data_areas_responsibility_form.value?.code ?? '',
      description: data_areas_responsibility_form.value?.description ?? '',
      type: data_areas_responsibility_form.value?.type ?? '',
      cost_center_id:
        data_areas_responsibility_form.value?.cost_center_id ?? null,
      auxiliary_id: data_areas_responsibility_form.value?.auxiliary_id ?? null,
    }
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const areasResponsibilityBasicData = ref()

  const validateForm = async () => {
    return (await areasResponsibilityBasicData.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(
      { accounting: ['account_structures'] },
      'filter[type]=Catálogo de unidades ejecutoras&filter[status_id]=Activo'
    )
    area_structures.value = account_structures.value
    await _getResources(
      { accounting: ['account_structures'] },
      'filter[type]=Catálogo de centros de costo&filter[status_id]=Activo'
    )
    await _getResources(
      {
        accounting: ['cost_center_active'],
      },
      '',
      'v2'
    )
    cost_center_structures.value = account_structures.value
    await _getResources({
      accounting: ['third_parties'],
      budget: ['areas_resposabilities_types'],
    })
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: [
        'account_structures',
        'third_parties',
        'areas_resposabilities_types',
        'cost_center_active',
      ],
      budget: ['areas_resposabilities_types'],
    })
    _setDataAreasResponsibilityForm(null)
  })

  const onSubmit = async (): Promise<void> => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IAreasResponsibilityBasicDataForm = makeDataRequest()
      if (await _createAreasResponsibility(payload)) {
        goToURL('BudgetAreasResponsibilityList')
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    headerProperties,
    areasResponsibilityBasicData,
    area_structures,
    cost_center_structures,
    goToURL,
    onSubmit,
    _setDataAreasResponsibilityForm,
  }
}

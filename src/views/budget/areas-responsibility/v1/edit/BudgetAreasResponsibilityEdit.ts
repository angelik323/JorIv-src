// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IAreasResponsibilityBasicDataForm,
  IAreasResponsibilityBasicDataResponse,
} from '@/interfaces/customs/budget/AreasResponsibility'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useBudgetAreasResponsibilityStore } from '@/stores/budget/areas-responsibility'

// Composable
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

export const useAreasResponsibilityEdit = () => {
  const router = useRouter()
  const areaResponsibilityId = Number(router.currentRoute.value.params.id)
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { headerPropsDefault, data_areas_responsibility_form } = storeToRefs(
    useBudgetAreasResponsibilityStore('v1')
  )

  const {
    _updateAreasResponsibility,
    _getByIdAreasResponsibility,
    _setDataAreasResponsibilityForm,
  } = useBudgetAreasResponsibilityStore('v1')

  const { budget_account_structures: account_structures } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { goToURL } = useGoToUrl()

  const area_structures = ref()
  const cost_center_structures = ref()

  const headerProperties = {
    title: 'Editar áreas de responsabilidad',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'BudgetAreasResponsibilityEdit',
      },
      {
        label: `${areaResponsibilityId}`,
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

  const responsibilityAreaData =
    ref<IAreasResponsibilityBasicDataResponse | null>(null)

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
    cost_center_structures.value = account_structures.value
    await _getResources({
      accounting: ['third_parties'],
      budget: ['areas_resposabilities_types'],
    })
    await _getResources(
      {
        accounting: ['cost_center_active'],
      },
      '',
      'v2'
    )
    responsibilityAreaData.value = await _getByIdAreasResponsibility(
      areaResponsibilityId
    )
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

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IAreasResponsibilityBasicDataForm = makeDataRequest()
      if (await _updateAreasResponsibility(areaResponsibilityId, payload)) {
        goToURL('BudgetAreasResponsibilityList')
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    responsibilityAreaData,
    areasResponsibilityBasicData,
    area_structures,
    cost_center_structures,
    onSubmit,
    goToURL,
  }
}

export default useAreasResponsibilityEdit

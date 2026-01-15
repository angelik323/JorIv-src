// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICostCenterInformationForm,
  ICostCenterToCreate,
} from '@/interfaces/customs/accounting/CostCenterV2'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'
import { useAlert } from '@/composables/useAlert'

// Stores
import { useCostCenterStore } from '@/stores/accounting/cost-centers'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCostCenterCreate = () => {
  const { showAlert } = useAlert()
  const { _createCostCenter, _clearData } = useCostCenterStore('v2')
  const { headerPropsDefault } = storeToRefs(useCostCenterStore('v2'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  // Data de formularios
  const information_form = ref<ICostCenterInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear centro de costos',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'CostCenterCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information_form',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }

    if (
      information_form.value &&
      information_form.value.costCenters.some((center) => center.code === '0')
    ) {
      showAlert(
        'No se puede actualizar con código de centro de costos igual a 0',
        'error'
      )
      return false
    }

    return valid
  }

  // Information form
  const makeBaseInfoRequest = (data: ICostCenterInformationForm | null) => {
    if (!data) return {}

    const request: ICostCenterToCreate = {
      account_structures_id: Number(data.account_structure),
      centers: data.costCenters.map((item) => ({
        code: item.code?.toString() ?? '',
        name: item.name ?? '',
        type: item.type ?? '',
      })),
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ICostCenterToCreate> = {
      ...makeBaseInfoRequest(information_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createCostCenter(payload)

    if (success) {
      goToURL('CostCenterList')
    }

    openMainLoader(false)
  }

  const keys = {
    accounting: ['available_cost_center_structures', 'cost_center_types'],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    goToURL,
    onSubmit,
  }
}

export default useCostCenterCreate

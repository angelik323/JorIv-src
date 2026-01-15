// Vue - pinia - moment
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITypesCoverageInformationForm,
  ITypesCoverageToCreate,
} from '@/interfaces/customs/investment-portfolio/TypesCoverage'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useTypesCoverageStore } from '@/stores/investment-portfolio/types-coverage'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useTypesCoverageCreate = () => {
  const { _createCoverageType, _clearData } = useTypesCoverageStore('v1')
  const { headerPropsDefault } = storeToRefs(useTypesCoverageStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()

  // Data de formularios
  const data_information_form = ref<ITypesCoverageInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProps = {
    title: 'Crear tipo de cobertura',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'TypesCoverageCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
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

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

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
    return valid
  }

  // Information form
  const makeBaseInfoRequest = (data: ITypesCoverageInformationForm | null) => {
    if (!data) return {}

    const request: ITypesCoverageToCreate = {
      code: data.code ?? null,
      description: data.description ?? null,
      operation_coverage_type_id: data.operation_coverage_type_id ?? null,
      operation_coverage_type_element_id:
        data.operation_coverage_type_element_id ?? null,
    }

    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ITypesCoverageToCreate> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createCoverageType(payload)
    if (success) {
      goToURL('TypesCoverageList')
    }
    openMainLoader(false)
  }

  const keys = ['operation_coverage']

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources({
      investment_portfolio: keys,
    })
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      investment_portfolio: keys,
    })
  })

  return {
    data_information_form,
    informationFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    goToURL,
    nextTab,
    backTab,
    onSubmit,
  }
}

export default useTypesCoverageCreate

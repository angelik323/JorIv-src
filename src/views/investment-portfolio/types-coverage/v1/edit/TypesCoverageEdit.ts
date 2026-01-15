// Vue - pinia
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITypesCoverageInformationForm,
  ITypesCoverageToEdit,
} from '@/interfaces/customs/investment-portfolio/TypesCoverage'

// Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores'
import { useTypesCoverageStore } from '@/stores/investment-portfolio/types-coverage'

export const useTypesCoverageEdit = () => {
  const { _getByIdTypesCoverage, _editTypeCoverage, _clearData } =
    useTypesCoverageStore('v1')

  const { headerPropsDefault, types_coverage_response } = storeToRefs(
    useTypesCoverageStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()
  const id = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const data_information_form = ref<ITypesCoverageInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProps = {
    title: 'Editar tipo de cobertura',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'TypesCoverageEdit',
      },
      {
        label: id.toString(),
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

  const setFormEdit = (data: ITypesCoverageInformationForm) => {
    const {
      code,
      description,
      operation_coverage_type_id,
      operation_coverage_type_element_id,
    } = data

    data_information_form.value = {
      code: code?.toString() ?? '',
      description: description ?? '',
      operation_coverage_type_id: operation_coverage_type_id ?? 0,
      operation_coverage_type_element_id:
        operation_coverage_type_element_id ?? 0,
    }
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      valid = (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
    }
    return valid
  }

  // Information form request
  const makeBaseInfoRequest = (data: ITypesCoverageInformationForm | null) => {
    if (!data) return {}

    const request: Partial<ITypesCoverageToEdit> = {
      code: data.code ?? null,
      description: data.description ?? null,
      operation_coverage_type_id: data.operation_coverage_type_id ?? null,
      operation_coverage_type_element_id:
        data.operation_coverage_type_element_id ?? null,
    }

    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ITypesCoverageToEdit> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _editTypeCoverage(payload, id)
    if (success) {
      router.push({ name: 'TypesCoverageList' })
    }
    openMainLoader(false)
  }

  const keys = ['operation_coverage']

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdTypesCoverage(id)
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

  watch(
    () => types_coverage_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    types_coverage_response,
    data_information_form,
    informationFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    nextTab,
    backTab,
    goToURL,
    onSubmit,
  }
}

// Vue - pinia - moment
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import moment from 'moment'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITitlesMergingBasicDataForm,
  ITitlesToMerge,
} from '@/interfaces/customs/investment-portfolio/TitlesMerging'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useTitlesMergingStore } from '@/stores/investment-portfolio/titles-merging'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useTitlesMergingCreate = () => {
  const { _createMergedTitle, _clearData } = useTitlesMergingStore('v1')
  const { headerPropsDefault } = storeToRefs(useTitlesMergingStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const router = useRouter()

  // Data de formularios
  const basic_data_form = ref<ITitlesMergingBasicDataForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const headerProperties = {
    title: 'Crear englobe de títulos',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'TitlesMergingCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
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

  const validateForms = async () => {
    let valid = false
    const forms = [basicDataFormRef]

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

  // Basic data form
  const makeBaseInfoRequest = (data: ITitlesMergingBasicDataForm | null) => {
    if (!data) return {}

    const request: ITitlesToMerge = {
      operation_date: moment().format('YYYY-MM-DD'),
      titles: data.selectedTitles.map((item) => ({ title_id: item.id })),
    }

    return cleanEmptyFields(request, true)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ITitlesToMerge> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const mergedTitleId = await _createMergedTitle(payload)

    if (mergedTitleId) {
      router.push({ name: 'TitlesMergingList' })
    }

    openMainLoader(false)
  }

  const keys = {
    investment_portfolio: [
      'investment_portfolio',
      'operation_type',
      'encompass_inversion_classes',
      'isin_code_mnemonics',
    ],
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
    basic_data_form,
    basicDataFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    onSubmit,
  }
}

export default useTitlesMergingCreate

// vue - router - quasar
import { ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Interfaces
import { ITypeCommissionsInformationForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore, useTypeCommissionsStore } from '@/stores'

const useTypeCommissionsCreate = () => {
  const { _createTypeCommissions, _clearData } = useTypeCommissionsStore('v1')

  // Data de formularios
  const data_information_form = ref<ITypeCommissionsInformationForm | null>(
    null
  )

  // Referencias a formularios
  const informationFormRef = ref()

  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    settlement_commissions: [
      'commission_class_catalogs',
      'commission_type_catalogs',
    ],
  }

  const headerProps = {
    title: 'Crear tipo de comisión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Definir tipos de comisión',
        route: 'CommissionTypesList',
      },
      {
        label: 'Crear',
        route: 'TypeCommissionsCreate',
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

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: ITypeCommissionsInformationForm | null
  ) => {
    if (!data) return {}

    const request: Partial<ITypeCommissionsInformationForm> = {
      description: data.description ?? null,
      commission_class_catalog_id: data.commission_class_catalog_id ?? null,
      commission_type_catalog_id: data.commission_type_catalog_id ?? null,
      value: data.value ?? 0,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ITypeCommissionsInformationForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
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

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createTypeCommissions(payload)
    if (success) {
      router.push({ name: 'CommissionTypesList' })
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    _clearData()
  })

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    data_information_form,
    informationFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useTypeCommissionsCreate

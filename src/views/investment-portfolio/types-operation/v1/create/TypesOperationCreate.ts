//Vue-Pinia
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
//Composables
import { useMainLoader, useUtils } from '@/composables'
//Interfaces
import { ITabs } from '@/interfaces/global'
import { ITypesOperation } from '@/interfaces/customs'
//Stores
import { useResourceManagerStore, useTypesOperationStore } from '@/stores'
//Components
import InformationForm from '@/components/Forms/InvestmentPortfolio/TypesOperation/information/InformationForm.vue'

export const useTypesOperationCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _setDataInformationForm, _createTypesOperation } =
    useTypesOperationStore('v1')
  const headerProps = {
    title: 'Crear tipo de operación',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Tipos de operación',
        route: 'TypesOperationList',
      },
      {
        label: 'Crear',
        route: 'TypesOperationCreate',
      },
    ],
  }

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { defaultIconsLucide } = useUtils()
  const informationFormRef = ref<InstanceType<typeof InformationForm> | null>(
    null
  )

  const tabs = reactive<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const activeTab = ref(tabs[0].name)

  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const makeDataRequest = () => {
    const formData = informationFormRef.value?.getFormData()

    return {
      code: formData?.code ?? '',
      description: formData?.description ?? '',
      generates_fic_movement: formData?.generates_fic_movement ?? false,
      fic_movement_code: formData?.fic_movement_code ?? null,
      operation_nature: formData?.operation_nature ?? null,
      accounting_origin: formData?.accounting_origin ?? null,
      generates_papeleta: formData?.generates_papeleta ?? false,
      treasury_movement_code_id: formData?.treasury_movement_code_id ?? null,
      inversion_type_id: formData?.inversion_type_id ?? null,
    } as ITypesOperation
  }

  const onSubmit = async () => {
    if (!(await informationFormRef.value?.validateForm())) return

    openMainLoader(true)
    const payload = makeDataRequest()

    if (await _createTypesOperation(payload)) {
      openMainLoader(false)
      router.push({ name: 'TypesOperationList' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 500)
  }

  onMounted(async () => {
    await _getResources({
      investment_portfolio: ['description', 'inversion_types'],
      fics: ['movements'],
      treasury: ['treasury_movement_codes'],
    })
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
    _resetKeys({
      investment_portfolio: ['description', 'inversion_types'],
      fics: ['movements'],
      treasury: ['treasury_movement_codes'],
    })
  })

  return {
    informationFormRef,
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    onSubmit,
  }
}

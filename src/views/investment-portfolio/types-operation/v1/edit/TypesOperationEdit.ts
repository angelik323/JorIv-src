//Vue-Pinia
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
//Composables
import { useMainLoader, useUtils } from '@/composables'
//Interfaces
import { ITypesOperation } from '@/interfaces/customs'
//Stores
import { useResourceManagerStore, useTypesOperationStore } from '@/stores'
//Utils
//Components
import InformationForm from '@/components/Forms/InvestmentPortfolio/TypesOperation/information/InformationForm.vue'

export const useTypeOperationEdit = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()
  const route = useRoute()
  const { data_information_form } = storeToRefs(useTypesOperationStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _updateTypesOperation, _getTypesOperationById } =
    useTypesOperationStore('v1')
  const headerProps = {
    title: 'Editar tipo de operación',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      { label: 'Tipo de operaciones', route: 'TypeOperationList' },
      { label: 'Editar', route: '' },
      { label: String(route.params.id), route: '' },
    ],
  }
  const { defaultIconsLucide } = useUtils()
  const tabs = reactive([
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

  const activeTab = ref('information')
  const tabActiveIdx = ref(0)

  const informationFormRef = ref<InstanceType<typeof InformationForm> | null>(
    null
  )

  const makeDataRequest = () => {
    const formData = informationFormRef.value?.getFormData()

    return {
      description: formData?.description ?? null,
      code: formData?.code ?? null,
      generates_fic_movement: formData?.generates_fic_movement ?? null,
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

    if (await _updateTypesOperation(payload, Number(route.params.id))) {
      router.push({ name: 'TypesOperationList' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 5000)
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getTypesOperationById(route.params.id as string)
    setTimeout(() => openMainLoader(false), 1200)
  })

  onMounted(async () => {
    await _getResources({
      investment_portfolio: ['description', 'inversion_types'],
      fics: ['movements'],
      treasury: ['treasury_movement_codes'],
    })
  })

  onUnmounted(() => {
    data_information_form.value = null
    _resetKeys({
      investment_portfolio: ['description', 'inversion_types'],
      fics: ['movements'],
      treasury: ['treasury_movement_codes'],
    })
  })
  onUnmounted(() => {
    data_information_form.value = null
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    data_information_form,
    onSubmit,
  }
}

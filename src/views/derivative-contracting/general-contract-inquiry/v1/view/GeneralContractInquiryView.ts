
// Vue - Pinia - Router - Quasar
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

//Interfaces
import { ITabs } from '@/interfaces/global'
import { IGeneralContractInquiryForm } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

//Composables
import {
  useUtils,
  useMainLoader,
  useGoToUrl,
} from '@/composables'

//Stores
import { useGeneralContractInquiryStore } from '@/stores/derivative-contracting/general-contract-inquiry'

const useGeneralContractInquiryView = () => {
  const route = useRoute()
  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { _getGeneralContractInquiryById } = useGeneralContractInquiryStore('v1')
  
  const generalContractInquiryId = +route.params.id

  const basicDataFormRef = ref()
  const basicDataForm = ref<IGeneralContractInquiryForm | null>(
    null
  )



  const headerProps = {
    title: 'Ver consulta general de contratos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contratación derivada' },
      {
        label: 'Ver consulta general de contratos',
        route: 'GeneralContractInquiryList',
      },
      { label: 'Ver' },
      { label: `${generalContractInquiryId}`, route: 'GeneralContractInquiryView' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'tab_basic_data',
      label: 'Datos basicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'tab_scheduled_payment_milestones',
      label: 'Hitos de pagos programados',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'tab_associated_budget',
      label: 'Presupuesto asociado',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'tab_attached_documents',
      label: 'Documentos anexos',
      icon: defaultIconsLucide.book,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'tab_clauses',
      label: 'Cláusulas',
      icon: defaultIconsLucide.filePenLine,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const setDataToForm = (data: IGeneralContractInquiryForm) => {
    if (!data) return

    basicDataForm.value = { ...data }

    }

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    
    const response = await _getGeneralContractInquiryById(generalContractInquiryId)
    if (response) {
      await setDataToForm(response)
    }
    
    openMainLoader(false)
  })



  return {
    headerProps,
    defaultIconsLucide,
    tabs,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basicDataForm,
    generalContractInquiryId,

    goToURL,
    nextTab,
    backTab,
  }
}

export default useGeneralContractInquiryView

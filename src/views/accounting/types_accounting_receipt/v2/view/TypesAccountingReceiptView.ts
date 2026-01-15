// vue | store
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { useTypeAccountingReceiptStore } from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIcons } from '@/utils'

// interface
import { ITabs } from '@/interfaces/customs/Tab'

const useTypesAccountingReceiptView = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const typeAccountingReceiptId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form, type_accounting_request } = storeToRefs(
    useTypeAccountingReceiptStore('v2')
  )

  const { _setDataInformationForm, _getByIdTypeAccounting, _getListAction } =
    useTypeAccountingReceiptStore('v2')

  // props
  const headerProps = {
    title: 'Ver tipos de comprobantes contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Tipos de comprobantes',
        route: 'TypeAccountingReceiptList',
      },
      {
        label: 'Ver',
        route: 'TypeAccountingReceiptView',
      },
      {
        label: `${typeAccountingReceiptId}`,
      },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
      icon: defaultIcons.bulletList,
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

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getByIdTypeAccounting(typeAccountingReceiptId)
    openMainLoader(false)
  })

  // Submit
  const onSubmit = async () => {
    _getListAction('')

    router.push({
      name: 'TypeAccountingReceiptList',
    })
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    type_accounting_request,
    onSubmit,
  }
}

export default useTypesAccountingReceiptView

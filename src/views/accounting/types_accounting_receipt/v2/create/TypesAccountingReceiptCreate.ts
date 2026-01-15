// vue | store
import { useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import {
  useResourceManagerStore,
  useTypeAccountingReceiptStore,
} from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interface
import { ITabs } from '@/interfaces/customs/Tab'
import {
  ITypeAccountingAction,
  ITypeAccountingDetail,
} from '@/interfaces/customs'

const useTypesAccountingReceiptCreate = () => {
  const router = useRouter()

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(
    useTypeAccountingReceiptStore('v2')
  )
  const {
    _createTypeAccountingReceipt,
    _setDataInformationForm,
    _getListAction,
  } = useTypeAccountingReceiptStore('v2')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // keys
  const keys = {
    accounting: ['sub_receipt_types'],
  }

  // props
  const headerProps = {
    title: 'Crear tipos de comprobantes',
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
        label: 'Crear',
        route: 'TypeAccountingReceiptCreate',
      },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
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

  // refs
  const formInformation = ref()

  // actions
  const makeDataRequest = (): ITypeAccountingAction => {
    const info = data_information_form.value
    return {
      id: info?.id ?? undefined,
      code: info?.code ?? undefined,
      name: info?.name ?? '',
      type: info?.type ?? '',
      status_id: Number(info?.status) || 0,
      sub_receipt_types:
        info?.details?.map((item: ITypeAccountingDetail) => ({
          id: item.id ?? undefined,
          name: item.name ?? '',
          is_cancellation: item.is_proof_cancellation ?? false,
          cancellation_association_id: Number(item.proof_cancellation) || null,
          is_upload_receipt: item.proof_charge ?? false,
          status_id: item.status_id === 1 ? 1 : 2,
        })) ?? [],
    }
  }

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  // onMount
  onMounted(async () => {
    await _getResources(keys)
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const data: ITypeAccountingAction = makeDataRequest()
      if (await _createTypeAccountingReceipt(data)) {
        _getListAction('')
        router.push({
          name: 'TypeAccountingReceiptList',
        })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    data_information_form,
    onSubmit,
  }
}

export default useTypesAccountingReceiptCreate

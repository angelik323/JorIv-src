// vue | store
import { useRoute, useRouter } from 'vue-router'
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'
import {
  useTypeAccountingReceiptStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIcons } from '@/utils'

// interface
import { ITabs } from '@/interfaces/customs/Tab'
import {
  ITypeAccountingAction,
  ITypeAccountingDetail,
} from '@/interfaces/customs'

const useTypesAccountingReceiptEdit = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const typeAccountingReceiptId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form, type_accounting_request } = storeToRefs(
    useTypeAccountingReceiptStore('v2')
  )
  const {
    _updateTypeAccountingReceipt,
    _getByIdTypeAccounting,
    _setDataInformationForm,
  } = useTypeAccountingReceiptStore('v2')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // keys
  const keys = {
    accounting: ['sub_receipt_types'],
  }

  // props
  const headerProps = {
    title: 'Editar tipos de comprobantes contables',
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
        label: 'Editar',
        route: 'TypeAccountingReceiptEdit',
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
      observation: info?.observation ?? '',
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

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getByIdTypeAccounting(typeAccountingReceiptId)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const data: ITypeAccountingAction = makeDataRequest()
      if (await _updateTypeAccountingReceipt(data, typeAccountingReceiptId)) {
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
    type_accounting_request,
    onSubmit,
  }
}

export default useTypesAccountingReceiptEdit

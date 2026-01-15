import { useAlert, useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useCheckDeliveryStore, useResourceManagerStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useCheckDeliveryEdit = () => {
  const route = useRoute()
  const router = useRouter()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  const { _getByIdCheckDeliveryToEdit, _updateCheckDelivery } =
    useCheckDeliveryStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  // props
  const informationFormRef = ref()

  const headerProps = {
    title: 'Editar entrega de cheques',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Entrega de cheques',
        route: 'CheckDeliveryList',
      },

      {
        label: 'Editar',
        route: '',
      },

      {
        label: id,
        route: '',
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

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  // handlers / actions
  const makeDataRequest = () => {
    const form = informationFormRef.value.models
    return {
      delivery_date: form?.delivery_date,
      authorized_document: form?.authorized_document,
      authorized_identification: form?.authorized_identification,
      instructions: form?.instructions,
    }
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser actualizado.', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateCheckDelivery(payload, Number(id))

    if (success) {
      router.push({ name: 'CheckDeliveryList' })
    }
    openMainLoader(false)
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdCheckDeliveryToEdit(Number(id))
    openMainLoader(false)
  })

  const keys = ['document_type', 'third_parties']

  onBeforeUnmount(() => _resetKeys({ treasury: keys }))
  onMounted(async () => {
    await _getResources({ treasury: keys })
  })

  return {
    informationFormRef,
    tabActiveIdx,
    filteredTabs,
    headerProps,
    tabActive,
    tabs,
    onSubmit,
  }
}

export default useCheckDeliveryEdit

import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { useAssignEncryptStore, useResourceManagerStore } from '@/stores'
import { IAssignEncryptDocument } from '@/interfaces/customs'
import InformationForm from '@/components/Forms/Treasury/AssignEncryption/InformationForm.vue'
import { useAlert } from '@/composables'
import router from '@/router'

const useAssignEncryptionEdit = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const route = useRoute()
  const { fetchAssignEncryptDocumentDetail, updateAssignEncryptDocument } =
    useAssignEncryptStore('v1')
  const { showAlert } = useAlert()

  const documentDetail = ref<IAssignEncryptDocument | null>(null)
  const assignEncryptionForm = ref<InstanceType<typeof InformationForm> | null>(
    null
  )

  const headerProps = {
    title: 'Editar cifrado',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Asignar cifrado',
        route: 'AssignEncryptionList',
      },
      {
        label: 'Editar',
        route: 'AssignEncryptionEdit',
        params: { id: route.query.assign_encrypt_id },
      },
      {
        label: String(route.query.assign_encrypt_id ?? ''),
      },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
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

  const onUpdate = async () => {
    if (!assignEncryptionForm.value) {
      showAlert('No se encontró el formulario', 'warning')
      return
    }

    const { payload, isCreate } =
      await assignEncryptionForm.value.getFormDataForUpdate()

    if (!payload) return

    const assignEncryptId = route.query.assign_encrypt_id as string

    if (isCreate) {
      router.push({ name: 'AssignEncryptionList' })
      return
    }

    const updated = await updateAssignEncryptDocument(assignEncryptId, payload)

    if (updated.success) {
      router.push({ name: 'AssignEncryptionList' })
    }
  }

  const isUpdateDisabled = computed(() => {
    if (!assignEncryptionForm.value) return true
    return !assignEncryptionForm.value.hasChanges
  })

  onMounted(async () => {
    const bankId = route.params.id as string
    documentDetail.value = await fetchAssignEncryptDocumentDetail(bankId)

    _getResources({ treasury: ['types_encrypt'] }, '', 'v2')
  })

  onBeforeMount(async () => {
    await _resetKeys({ treasury: ['types_encrypt'] })
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    documentDetail,
    assignEncryptionForm,
    isUpdateDisabled,
    onUpdate,
  }
}

export default useAssignEncryptionEdit

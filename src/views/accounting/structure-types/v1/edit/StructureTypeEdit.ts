import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { IStructureTypeFormModel } from '@/interfaces/customs'
import { useStructureTypesStore } from '@/stores'

const useStructureTypeEdit = () => {
  const route = useRoute()
  const router = useRouter()

  const structureTypeForm = ref()
  const { openMainLoader } = useMainLoader()
  const { _getStructureType, _updateStructureType } =
    useStructureTypesStore('v1')
  const structureTypeId = Number(route.params.id)

  const headerProps = {
    title: 'Editar tipo de estructura',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Tipos de estructuras', route: 'StructureTypeList' },
      {
        label: 'Editar',
        route: 'StructureTypeEdit',
        params: { id: structureTypeId },
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

  const model = ref<IStructureTypeFormModel>({
    code: '',
    name: '',
    status_id: 1,
  })

  const loadStructureType = async () => {
    openMainLoader(true)

    const structureTypeInfo = await _getStructureType(structureTypeId)
    if (structureTypeInfo) {
      model.value = {
        id: structureTypeInfo.id!,
        code: structureTypeInfo.code ?? '',
        name: structureTypeInfo.name ?? '',
        status_id: Number(structureTypeInfo.status ?? 1),
      }
    }

    openMainLoader(false)
  }

  onMounted(async () => {
    await loadStructureType()
  })

  const handleFormUpdate = () => {
    if (
      structureTypeForm.value &&
      typeof structureTypeForm.value.getFormData === 'function'
    ) {
      model.value = structureTypeForm.value.getFormData()
    }
  }

  const onUpdate = async () => {
    handleFormUpdate()

    const isValid = await structureTypeForm.value?.validate?.()
    if (!isValid) return

    const payloadToSend = {
      name: model.value.name,
      status: model.value.status_id,
    }

    const success = await _updateStructureType(structureTypeId, payloadToSend)
    if (success) {
      router.push({ name: 'StructureTypeList' })
    }
  }

  return {
    headerProps,
    model,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    structureTypeForm,
    handleFormUpdate,
    onUpdate,
  }
}

export default useStructureTypeEdit

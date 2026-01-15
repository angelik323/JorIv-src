import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { useStructureTypesStore } from '@/stores'
import { IStructureTypeFormModel } from '@/interfaces/customs'

const useStructureTypeCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _createStructureType } = useStructureTypesStore('v1')

  const structureTypeForm = ref()

  const headerProps = {
    title: 'Crear tipo de estructura',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Tipos de estructuras', route: 'StructureTypeList' },
      { label: 'Crear', route: 'StructureTypeCreate' },
    ],
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

  const models = ref<IStructureTypeFormModel>({
    code: '',
    name: '',
    status_id: 1,
  })

  const alertModalRef = ref()

  const validateForms = async () => structureTypeForm.value?.validate?.()

  const handleFormUpdate = () => {
    if (structureTypeForm.value?.getFormData) {
      models.value = structureTypeForm.value.getFormData()
    }
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      handleFormUpdate()

      const payload = {
        code: models.value.code?.trim() ?? '',
        name: models.value.name?.trim() ?? '',
        status_id: models.value.status_id,
      }

      if (await _createStructureType(payload)) {
        router.push({ name: 'StructureTypeList' })
      }

      setTimeout(() => openMainLoader(false), 1000)
    }
  }

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    models,
    alertModalRef,
    structureTypeForm,
    onSubmit,
    handleFormUpdate,
  }
}

export default useStructureTypeCreate

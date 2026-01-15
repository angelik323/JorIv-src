// Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { BusinessLineStatusID, ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBusinessLineStore } from '@/stores/fics/business-line'

const useBusinessLineEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { business_line, selected_type, business_lines_name, typeName } =
    storeToRefs(useBusinessLineStore('v1'))
  const { _updateBusinessLine, _getBusinessLine, _cleanData } =
    useBusinessLineStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const businessLineForm = ref()
  const alertModalRef = ref()

  const businessLineId = +route.params.id

  const keys = {
    fics: ['status_business_line'],
  }

  const headerProps = ref({
    title: `Editar ${typeName.value}`,
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Líneas de negocios y tipos de participación',
        route: 'BusinessLineList',
      },
      {
        label: `Editar ${typeName.value}`,
        route: 'BusinessLineEdit',
      },
      {
        label: `${businessLineId}`,
      },
    ],
  })

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const titleComplement = computed(() =>
    selected_type.value === business_lines_name.value
      ? `la ${typeName.value}`
      : `el ${typeName.value}`
  )

  const updateModalTitle = computed(() => {
    let status = 'activar'
    if (business_line.value.status_id === BusinessLineStatusID.INACTIVE) {
      status = 'inactivar'
    } else if (
      business_line.value.status_id === BusinessLineStatusID.CANCELLED
    ) {
      status = 'cancelar'
    }
    return `¿Desea ${status} ${titleComplement.value}?`
  })

  const updateModalDescription = computed(() =>
    business_line.value.status_id === BusinessLineStatusID.CANCELLED
      ? `Si se cancela, no se podrá editar ni activar/inactivar ${titleComplement.value}`
      : ''
  )

  const validateForms = async () => {
    return businessLineForm?.value?.validateForm()
  }

  const updateBusinessLine = async () => {
    if (!(await validateForms())) return
    if (
      business_line.value.status_id === business_line.value.initial_status_id
    ) {
      onSubmit()
      return
    }

    alertModalRef.value.openModal()
  }

  const onSubmit = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)
    const payload = businessLineForm.value.getFormData()
    if (await _updateBusinessLine(businessLineId, payload)) handleGoToList()

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToList = () =>
    goToURL('BusinessLineList', undefined, { reload: true })

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys)
    await _getBusinessLine(businessLineId)

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _cleanData()
  })

  watch(
    () => typeName.value,
    () => {
      headerProps.value.title = `Editar ${typeName.value}`
      headerProps.value.breadcrumbs[3].label = `Editar ${typeName.value}`
    }
  )

  return {
    tabs,
    onSubmit,
    tabActive,
    headerProps,
    tabActiveIdx,
    alertModalRef,
    business_line,
    handleGoToList,
    businessLineId,
    businessLineForm,
    updateModalTitle,
    updateBusinessLine,
    updateModalDescription,
  }
}

export default useBusinessLineEdit

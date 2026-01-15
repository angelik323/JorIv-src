// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICostCenterInformationForm,
  ICostCenterResponse,
  ICostCenterToEdit,
} from '@/interfaces/customs/accounting/CostCenterV2'

// Composables
import { useUtils, useMainLoader, useGoToUrl } from '@/composables'
import { useAlert } from '@/composables/useAlert'

// Stores
import { useCostCenterStore } from '@/stores/accounting/cost-centers'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCostCenterEdit = () => {
  const { showAlert } = useAlert()
  const { _getByStructureId, _updateCostCenter, _clearData } =
    useCostCenterStore('v2')
  const { headerPropsDefault, cost_center_response } = storeToRefs(
    useCostCenterStore('v2')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const router = useRouter()

  const structureId = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const information_form = ref<ICostCenterInformationForm | null>(null)

  // Referencias a formularios
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Editar centro de costos',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'CostCenterEdit',
      },
      {
        label: structureId.toString(),
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information_form',
      label: 'Datos básicos',
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

  const setFormEdit = (data: ICostCenterResponse) => {
    // Seteo del formulario
    information_form.value = {
      id: data.structure.id,
      account_structure: data.structure
        ? [data.structure.code, data.structure.purpose]
            .filter(Boolean)
            .join(' - ')
        : null,
      purpose: data.structure.purpose ?? null,
      structure: data.structure.structure ?? null,
      status: data.structure.status?.name ?? null,
      costCenters:
        data.cost_centers?.map((item) => ({
          id: item.id,
          code: item.code ?? null,
          type: item.type ?? null,
          name: item.name ?? null,
          isNew: false,
        })) ?? [],
    }
  }

  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }

    if (
      information_form.value &&
      information_form.value.costCenters.some((center) => center.code === '0')
    ) {
      showAlert(
        'No se puede crear con código de centro de costos igual a 0',
        'error'
      )
      return false
    }

    return valid
  }

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Confirmación',
    description: '¿Está seguro que desea eliminar este centro de costos?',
    entityId: null as number | null,
  })

  const openAlertModal = async (id: number) => {
    alertModalRef.value.openModal()
    alertModalConfig.value.entityId = id
  }

  // Delete row request
  const makeDeleteRequest = (id: number): ICostCenterToEdit => ({
    centers: [],
    centers_to_delete: [id],
  })

  const onDeleteRow = async () => {
    const { entityId } = alertModalConfig.value
    if (!entityId) return

    openMainLoader(true)

    const payload = makeDeleteRequest(entityId)
    const success = await _updateCostCenter(payload, structureId)

    if (success && Array.isArray(information_form.value?.costCenters)) {
      information_form.value.costCenters =
        information_form.value.costCenters.filter(({ id }) => id !== entityId)
      alertModalRef.value.closeModal()
    }

    openMainLoader(false)
  }

  // Information form request
  const makeInformationRequest = (data: ICostCenterInformationForm | null) => {
    if (!data) return {}

    const request: ICostCenterToEdit = {
      centers: data.costCenters.map((center) => ({
        ...(center.isNew
          ? {
              // Nuevo centro de costo
              code: center.code?.toString() ?? '',
              name: center.name ?? '',
              type: center.type ?? '',
            }
          : {
              // Edición de centro existente
              id: center.id,
              name: center.name ?? '',
              type: center.type ?? '',
            }),
      })),
      centers_to_delete: [],
    }

    return cleanEmptyFields(request, true)
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeInformationRequest(information_form.value)
    const success = await _updateCostCenter(payload, structureId)
    if (success) goToURL('CostCenterList')

    openMainLoader(false)
  }

  const keys = {
    accounting: ['cost_center_types'],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await Promise.all([_getResources(keys), _getByStructureId(structureId)])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => cost_center_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    cost_center_response,
    information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    alertModalRef,
    alertModalConfig,
    goToURL,
    openAlertModal,
    onDeleteRow,
    onSubmit,
  }
}

export default useCostCenterEdit

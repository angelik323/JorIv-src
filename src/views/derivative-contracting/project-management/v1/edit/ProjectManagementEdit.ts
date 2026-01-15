// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'

// Composables
import { useMainLoader, useGoToUrl, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { ProjectManagementFilter } from '@/interfaces/global/DerivativeContracting'
import {
  IProjectManagementBasicDataForm,
  IProjectManagementAssociatedBusinessForm,
  IProjectManagementAssociatedBusinessList,
  IProjectManagementRequest,
  IProjectManagementResponse,
} from '@/interfaces/customs/derivative-contracting/ProjectManagement'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useProjectManagementStore } from '@/stores/derivative-contracting/project-management'

const useProjectManagementEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatFiltersToParamsCustom } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getByIdAction, _updateAction, _clearData } =
    useProjectManagementStore('v1')

  const projectManagementId = +route.params.id

  const basicDataFormRef = ref()
  const basicDataForm = ref<IProjectManagementBasicDataForm | null>(null)
  const associatedBusinessFormRef = ref()
  const associatedBusinessForm =
    ref<IProjectManagementAssociatedBusinessForm | null>(null)
  const selectedAssociatedBusinessList =
    ref<IProjectManagementAssociatedBusinessList | null>(null)

  const keys = {
    trust_business: ['business_trusts_derivate_contracting'],
  }

  const statusIds = [57, 59]

  const headerProps = {
    title: 'Editar nuevos proyectos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
      },
      {
        label: 'Administración de proyectos',
        route: 'ProjectManagementList',
      },
      {
        label: 'Editar',
        route: 'ProjectManagementEdit',
      },
      {
        label: `${projectManagementId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
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

  const alertModalWarningRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
  })

  const setDataToForm = (data: IProjectManagementResponse) => {
    basicDataForm.value = {
      ...data,
      status_id: data.status?.id,
      start_date: data.start_date
        ? moment(data.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
      end_date: data.end_date
        ? moment(data.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null,
    }
  }

  const setAssociatedBusinessForm = (data: IProjectManagementResponse) => {
    associatedBusinessForm.value = {
      fiduciary_business_id: data.business_id ?? null,
      business_type_id: data.business_type_id ?? null,
      business_status_id: data.business_status_id ?? null,
    }
  }

  const validateFormBasicData = async () => {
    return (await basicDataFormRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = (): IProjectManagementRequest => {
    if (!basicDataForm.value) {
      return {} as IProjectManagementRequest
    }

    const businessIds = selectedAssociatedBusinessList.value
      ? selectedAssociatedBusinessList.value.map((item) => item.id)
      : []

    return {
      name: basicDataForm.value?.name ?? null,
      description: basicDataForm.value?.description ?? null,
      start_date: basicDataForm.value?.start_date ?? null,
      end_date: basicDataForm.value?.end_date ?? null,
      expenditure_computer: basicDataForm.value?.expenditure_computer ?? null,
      status_id: basicDataForm.value?.status_id ?? null,
      fiduciary_business_id: associatedBusinessForm.value?.fiduciary_business_id
        ? Number(associatedBusinessForm.value.fiduciary_business_id)
        : null,
      business_type_id: associatedBusinessForm.value?.business_type_id
        ? Number(associatedBusinessForm.value.business_type_id)
        : null,

      business_status_id: associatedBusinessForm.value?.business_status_id
        ? Number(associatedBusinessForm.value.business_status_id)
        : null,
      business_ids: businessIds,
    }
  }

  const onSubmit = async () => {
    if (!(await validateFormBasicData())) return

    if (
      !selectedAssociatedBusinessList.value ||
      selectedAssociatedBusinessList.value?.length === 0
    ) {
      openWarningModal()
      return
    }

    await handleSubmit()
  }

  const handleSubmit = async () => {
    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateAction(payload, projectManagementId)

    if (success) {
      goToURL('ProjectManagementList')
    }
    openMainLoader(false)
  }

  const openWarningModal = () => {
    alertModalConfig.value.title = `¿Estás seguro de no asociar algún negocio consolidador al proyecto?`
    alertModalWarningRef.value.openModal()
  }

  const warningAction = async () => {
    await handleSubmit()
    await alertModalWarningRef.value.closeModal()
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    const response = await _getByIdAction(projectManagementId)

    const filters = {
      [ProjectManagementFilter.DERIVATE_CONTRACTING]: 'true',
      [ProjectManagementFilter.BUSINESS_TYPES]: 'true',
      [ProjectManagementFilter.STATUS_ID]: statusIds.join(','),
    }

    const params = formatFiltersToParamsCustom(filters)
    await _getResources(keys, new URLSearchParams(params).toString())

    if (response) {
      await setDataToForm(response)
      await setAssociatedBusinessForm(response)
    }
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _clearData()
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basicDataForm,
    associatedBusinessFormRef,
    associatedBusinessForm,
    selectedAssociatedBusinessList,
    alertModalWarningRef,
    alertModalConfig,

    onSubmit,
    goToURL,
    warningAction,
  }
}

export default useProjectManagementEdit

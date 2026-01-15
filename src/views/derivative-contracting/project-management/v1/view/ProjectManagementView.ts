// Vue - Pinia - Router - Quasar
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'

// Composables
import { useMainLoader, useGoToUrl, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IProjectManagementBasicDataForm,
  IProjectManagementAssociatedBusinessForm,
  IProjectManagementResponse,
} from '@/interfaces/customs/derivative-contracting/ProjectManagement'

// Stores
import { useProjectManagementStore } from '@/stores/derivative-contracting/project-management'

const useProjectManagementView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getByIdAction, _clearData } = useProjectManagementStore('v1')

  const projectManagementId = +route.params.id

  const basicDataFormRef = ref()
  const basicDataForm = ref<IProjectManagementBasicDataForm | null>(null)
  const associatedBusinessFormRef = ref()
  const associatedBusinessForm =
    ref<IProjectManagementAssociatedBusinessForm | null>(null)

  const headerProps = {
    title: 'Ver nuevos proyectos',
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
        label: 'Ver',
        route: 'ProjectManagementView',
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

  onBeforeMount(async () => {
    openMainLoader(true)
    const response = await _getByIdAction(projectManagementId)
    if (response) {
      await setDataToForm(response)
      await setAssociatedBusinessForm(response)
    }
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
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

    goToURL,
  }
}

export default useProjectManagementView

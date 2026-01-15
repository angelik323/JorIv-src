// Utils & vue:
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { defaultIcons } from '@/utils'
// Stores
import {
  useAdditionalInformationFormStore,
  useDataFormStore,
  usePermissionFormStore,
  usePermissionStore,
  useResourcesStore,
  useUserStore,
} from '@/stores'
// Components & Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
// Interfaces
import { ITabs } from '@/interfaces/customs/Tab'

export const useReadUserView = () => {
  // Utils
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  // Stores
  const { userData, userRoleId } = storeToRefs(useUserStore())
  const { getUserById } = useUserStore()
  const { _loadPermissionsData } = usePermissionFormStore()
  const { permissions, permissionList } = storeToRefs(usePermissionFormStore())
  const { _loadAdditionalInformationData } = useAdditionalInformationFormStore()
  const {
    fileRowList,
    userAdditionalInformationForm,
    infoLoaded,
    isInactiveBank,
  } = storeToRefs(useAdditionalInformationFormStore())
  const { userDataForm, isInactiveRole } = storeToRefs(useDataFormStore())
  const { roleId } = storeToRefs(usePermissionStore())
  const { getResources } = useResourcesStore()
  // Reactive Variables
  const id = ref()
  const isActiveUser = computed(() => {
    return userData.value?.status_id === 1
  })

  const headerProps = reactive({
    title: 'Ver usuario..',
    breadcrumbs: [
      {
        label: 'Usuarios',
      },
      {
        label: 'Usuarios',
        route: 'ListUserView',
      },
      {
        label: 'Ver',
      },
      {
        label: route?.params?.id as string,
      },
    ],
    showBackBtn: true,
  })

  // tabs:
  const tabs = ref<ITabs[]>([
    {
      name: 'user_data',
      label: 'Datos del usuario',
      icon: defaultIcons.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'permissions',
      label: 'Permisos',
      icon: defaultIcons.key,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'additional_information',
      label: 'Información adicional',
      icon: defaultIcons.accountFile,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const goToView = async (route: string, id?: number) => {
    await router.push({ name: route, params: { id } })
  }

  const goToViewOnNewWindow = (route: string, id?: number) => {
    const url = router.resolve({ name: route, params: { id } }).href
    window.open(url, '_blank')
  }

  const nextTab = (tab: string) => {
    if (tab === 'user_data' || tab === 'permissions') {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    } else if (tab === 'additional_information') {
      goToView('ListUserView')
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const setDefaultValuesToStore = () => {
    userData.value = null
    userRoleId.value = null
    userDataForm.value = null
    permissions.value = []
    permissionList.value = []
    fileRowList.value = []
    userAdditionalInformationForm.value = null
    roleId.value = null
    infoLoaded.value = false
    isInactiveBank.value = false
    isInactiveRole.value = false
  }

  onMounted(async () => {
    openMainLoader(true)
    setDefaultValuesToStore()
    id.value = route?.params?.id
    await getUserById(id.value)
    await getResources('keys[]=module_app')
    _loadPermissionsData()
    await _loadAdditionalInformationData()
    openMainLoader(false)
  })

  onUnmounted(() => {
    setDefaultValuesToStore()
  })

  return {
    headerProps,
    isActiveUser,
    tabActive,
    tabs,
    tabActiveIdx,
    defaultIcons,
    id,
    nextTab,
    backTab,
    goToView,
    goToViewOnNewWindow,
  }
}

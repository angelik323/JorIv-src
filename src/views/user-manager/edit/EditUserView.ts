import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// Composables & utils:
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlertModal } from '@/composables/useAlertModal'
import { useAlert } from '@/composables'
import { defaultIcons } from '@/utils'
// Interfaces:
import { ITabs } from '@/interfaces/customs/Tab'
import { IShowAlertInformation } from '@/interfaces/global'
import { ICreateUpdateUser, IGetUserByDocument } from '@/interfaces/global/user'
// Stores:
import {
  useAdditionalInformationFormStore,
  useDataFormStore,
  usePermissionFormStore,
  usePermissionStore,
  useResourcesStore,
  useUserStore,
} from '@/stores'
// Assets:
import imageUrl from '@/assets/images/alert/caution-image.svg'

export const useEditUserView = () => {
  // Utils
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { showAlertInformation } = useAlertModal()
  // Stores
  const { getResources } = useResourcesStore()
  const { branches } = storeToRefs(useResourcesStore())
  const { userData, userRoleId } = storeToRefs(useUserStore())
  const { getUserById, updateUser, setUserDataByDocument, getUserByDocument } =
    useUserStore()
  const { userDataForm, isFormValid, isInactiveRole, isInactiveBranch } =
    storeToRefs(useDataFormStore())
  const { _loadPersonalData } = useDataFormStore()
  const { permissions, permissionList } = storeToRefs(usePermissionFormStore())
  const { _loadPermissionsData } = usePermissionFormStore()
  const {
    fileRowList,
    userAdditionalInformationForm,
    infoLoaded,
    isInactiveBank,
  } = storeToRefs(useAdditionalInformationFormStore())
  const { _loadAdditionalInformationData } = useAdditionalInformationFormStore()
  const { roleId } = storeToRefs(usePermissionStore())
  // Variables
  const id = ref()
  const isActiveUser = computed(() => {
    return userData.value?.status_id === 1
  })
  const isUpdateButtonDisabled = computed(() => {
    return (
      permissions.value.length === 0 ||
      !isFormValid.value ||
      isInactiveBank.value ||
      isInactiveRole.value
    )
  })

  const headerProps = reactive({
    title: 'Editar usuario',
    breadcrumbs: [
      {
        label: 'Usuarios',
      },
      {
        label: 'Usuarios',
        route: 'ListUserView',
      },
      {
        label: 'Editar',
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
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'permissions',
      label: 'Permisos',
      icon: defaultIcons.key,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'aditional_information',
      label: 'Información adicional',
      icon: defaultIcons.accountFile,
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

  const goToView = async (route: string, id?: number) => {
    await router.push({ name: route, params: { id } })
  }

  const nextTab = async (tab: string) => {
    if (tab === 'form-data' || tab === 'permissions') {
      tabActiveIdx.value = tabActiveIdx.value + 1
      tabActive.value = tabs.value[tabActiveIdx.value].name
    } else if (tab === 'additional-information') {
      await handleUpdateUser()
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

  const handleUpdateUser = async () => {
    const bodyRequest: ICreateUpdateUser = {
      ...userDataForm.value,
      permissions: JSON.parse(JSON.stringify(permissions.value)) ?? [],
      ...userAdditionalInformationForm.value,
    }
    openMainLoader(true)
    if (
      !isRequestForSameLoadedDocument(
        String(userData.value?.document),
        String(bodyRequest?.document)
      ) ||
      userData.value?.document_type?.id !== bodyRequest?.document_type_id
    ) {
      if (await existDocument()) {
        return await dispatchShowAlertInformation()
      }
    }
    if (userAdditionalInformationForm.value?.account_number)
      userAdditionalInformationForm.value.account_number = String(
        userAdditionalInformationForm.value.account_number
      )
    const response = await updateUser(Number(userData.value?.id), bodyRequest)
    if (response.success) {
      showAlert(response.message, 'success')
      setDefaultValuesToStore()
      await goToView('ListUserView')
    }
    openMainLoader(false)
  }

  const existDocument = async () => {
    const params: IGetUserByDocument = {
      document_type: userDataForm.value?.document_type_id,
      document: userDataForm.value?.document,
    }
    const exist = await getUserByDocument(params)
    if (exist.success) {
      openMainLoader(false)
      return true
    } else {
      return false
    }
  }

  const isRequestForSameLoadedDocument = (
    doc1: string,
    doc2: string
  ): boolean => {
    if (doc1.replace(/\s+/g, '') === doc2.replace(/\s+/g, '')) return true
    else return false
  }

  const dispatchShowAlertInformation = async () => {
    const alertParams: IShowAlertInformation = {
      image_url: imageUrl,
      params_html: `<p style="font-size: 25px;" class="text-indigo-10">Advertencia</p>El número y tipo de documento establecidos <br> se encuentra asociados a otro usuario en el sistema. <br> <br> ¿Desea editar el usuario ya registrado?`,
      confirm_button_text: 'Aceptar',
      cancel_button_text: 'Cancelar',
    }
    const acceptActionAlert = await showAlertInformation(alertParams)
    if (acceptActionAlert) {
      setUserDataByDocument()
      await goToView('EditUserView', userData.value?.id)
      router.go(0)
    }
  }

  const validateInactiveBranch = () => {
    const existingBranch = branches.value.find(
      (branch) => branch.value === userData.value?.branch?.id
    )
    if (!existingBranch && userData.value?.branch) {
      const newBranch = {
        label: userData.value.branch.name,
        value: userData.value.branch.id,
        status_id: userData.value.branch.status_id,
      }
      branches.value = [...branches.value, newBranch]
    }
  }

  watch(
    () => route?.params?.id,
    (val) => {
      id.value = val
      headerProps.breadcrumbs[3].label = val as string
    }
  )

  watch(isInactiveBank, (newVal) => {
    if (newVal) {
      showAlert('Banco inactivo', 'error')
    }
  })

  watch(isInactiveRole, (newVal) => {
    if (newVal) {
      showAlert('Rol inactivo', 'error')
    }
  })

  watch(isInactiveBranch, (newVal) => {
    if (newVal) {
      showAlert('Sede inactiva', 'error')
    }
  })

  onMounted(async () => {
    openMainLoader(true)
    await getResources(
      'keys[]=banks&keys[]=cities&keys[]=roles&keys[]=module_app'
    )
    await getResources('keys[]=branches&filter[status_id]=1')
    if (!userData.value?.role?.id) {
      id.value = route?.params?.id
      await getUserById(id.value)
    }
    validateInactiveBranch()
    _loadPersonalData()
    _loadPermissionsData()
    await _loadAdditionalInformationData()
    openMainLoader(false)
  })

  onUnmounted(() => {
    setDefaultValuesToStore()
  })

  return {
    headerProps,
    isUpdateButtonDisabled,
    isActiveUser,
    tabs,
    tabActive,
    tabActiveIdx,
    goToView,
    nextTab,
    backTab,
    handleUpdateUser,
  }
}

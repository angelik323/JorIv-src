import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// Composables & utils:
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlert } from '@/composables'
import { useAlertModal } from '@/composables/useAlertModal'
import { defaultIcons } from '@/utils'
// Interfaces:
import { ICreateUpdateUser, IGetUserByDocument } from '@/interfaces/global/user'
import { IShowAlertInformation } from '@/interfaces/global'
import { ITabs } from '@/interfaces/customs/Tab'
// Stores:
import {
  useResourcesStore,
  useDataFormStore,
  usePermissionFormStore,
  useAdditionalInformationFormStore,
  useUserStore,
  usePermissionStore,
} from '@/stores'
// Assets:
import imageUrl from '@/assets/images/alert/caution-image.svg'

export const useCreateUserView = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { showAlertInformation } = useAlertModal()

  const { getResources } = useResourcesStore()
  const { userDataForm, isFormValid, isInactiveRole } = storeToRefs(
    useDataFormStore()
  )
  const { userData, userRoleId } = storeToRefs(useUserStore())
  const { permissions, permissionList } = storeToRefs(usePermissionFormStore())
  const { roleId } = storeToRefs(usePermissionStore())
  const { userAdditionalInformationForm, fileRowList, isInactiveBank } =
    storeToRefs(useAdditionalInformationFormStore())
  const { createUser, getUserByDocument, setUserDataByDocument } =
    useUserStore()

  const isSaveButtonDisabled = computed(() => {
    return (
      permissions.value.length === 0 ||
      !isFormValid.value ||
      isInactiveBank.value ||
      isInactiveRole.value
    )
  })

  const headerProps = {
    title: 'Crear usuario',
    breadcrumbs: [
      {
        label: 'Usuarios',
      },
      {
        label: 'Usuarios',
        route: 'ListUserView',
      },
      {
        label: 'Crear',
        route: 'CreateUserView',
      },
    ],
    showBackBtn: true,
  }

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
      await handleCreateUser()
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const handleCreateUser = async () => {
    const bodyRequest: ICreateUpdateUser = {
      ...userDataForm.value,
      permissions: JSON.parse(JSON.stringify(permissions.value)) ?? [],
      ...userAdditionalInformationForm.value,
    }
    openMainLoader(true)

    if (await existDocument()) {
      return await dispatchShowAlertInformation()
    }

    const response = await createUser(bodyRequest)
    if (response.success) {
      showAlert(response.message, 'success')
      userDataForm.value = null
      permissions.value = []
      userAdditionalInformationForm.value = null
      goToView('ListUserView')
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
    }
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
    isInactiveBank.value = false
    isInactiveRole.value = false
  }

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

  onMounted(async () => {
    setDefaultValuesToStore()
    openMainLoader(true)
    await getResources(
      'keys[]=banks&keys[]=cities&keys[]=roles&keys[]=module_app'
    )
    await getResources('keys[]=branches&filter[status_id]=1')
    openMainLoader(false)
  })

  onUnmounted(() => {
    setDefaultValuesToStore()
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    isSaveButtonDisabled,
    goToView,
    nextTab,
    backTab,
    handleCreateUser,
  }
}

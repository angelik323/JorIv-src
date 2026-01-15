import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// Composables & utils
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlertModal } from '@/composables/useAlertModal'
import { useAlert } from '@/composables'
// Interfaces:
import { IShowAlertInformation } from '@/interfaces/global/ISweetAlerts'
import { IGetUserByDocument, IUserDataForm } from '@/interfaces/global/user'
// Stores:
import { useResourcesStore, useUserStore } from '@/stores'
import { useDataFormStore } from '@/stores/user/data-form'
// Assets:
import imageUrl from '@/assets/images/alert/caution-image.svg'

export const useDataForm = (props: any, emit: Function) => {
  const { showAlert } = useAlert()
  const router = useRouter()
  const { showAlertInformation } = useAlertModal()
  const { openMainLoader } = useMainLoader()
  const { getUserByDocument } = useUserStore()
  const { userData } = storeToRefs(useUserStore())
  const { sex, cities, roles, document_types_user, branches } = storeToRefs(
    useResourcesStore()
  )
  const { _setUserDataForm } = useDataFormStore()
  const { userDataForm, isInactiveRole, isInactiveBranch } = storeToRefs(
    useDataFormStore()
  )
  const { setUserDataByDocument } = useUserStore()

  const isRoleInactive = computed(() => {
    const selectedRole = roles.value.find(
      (role) => role.value === formValues.value.role
    )
    return selectedRole?.value ? selectedRole.status_id === 2 : false
  })
  const isBranchInactive = computed(() => {
    const selectedBranch = branches.value.find(
      (branch) => branch.value === formValues.value.branch_id
    )
    return selectedBranch ? selectedBranch.status_id === 2 : false
  })
  const isExpeditionPlaceRequired = computed(() => {
    return formValues.value.document_type_id === 1
  })
  const isDateRequired = computed(() => {
    return (
      formValues.value.expiration_date !== null ||
      formValues.value.expiration_date !== undefined ||
      formValues.value.expiration_date !== ''
    )
  })

  const formValues = ref<IUserDataForm>({
    // User data:
    role: null as number | null,
    expiration_date: null as string | null,
    branch_id: null as number | null,
    // Personal user data:
    document_type_id: null as number | null,
    document: null as string | null,
    name: null as string | null,
    last_name: null as string | null,
    expedition_place_id: null as number | null,
    sex: null as string | null,
    // Contact data:
    phone: null as string | null,
    email: null as string | null,
  })

  const setUserValues = () => {
    formValues.value.role = userDataForm.value?.role
    formValues.value.expiration_date = userDataForm.value?.expiration_date
    formValues.value.branch_id = userDataForm.value?.branch_id
    formValues.value.document_type_id = userDataForm.value?.document_type_id
    formValues.value.document = userDataForm.value?.document
    formValues.value.name = userDataForm.value?.name
    formValues.value.last_name = userDataForm.value?.last_name
    formValues.value.expedition_place_id =
      userDataForm.value?.expedition_place_id
    formValues.value.sex = userDataForm.value?.sex
    formValues.value.phone = userDataForm.value?.phone
    formValues.value.email = userDataForm.value?.email
  }

  const searchUserByDocument = async (params: IGetUserByDocument) => {
    if (!params.document_type)
      return showAlert('¡Debe elegir un tipo de documento!', 'error')
    if (!params.document)
      return showAlert('¡Debe ingresar un número de documento!', 'error')
    if (
      props.formType === 'update' &&
      isRequestForSameLoadedDocument(
        String(userData.value?.document),
        String(formValues.value?.document)
      ) &&
      userData.value?.document_type?.id === formValues.value?.document_type_id
    )
      return showAlert(
        '¡Ya se encuentra editando este número de documento!',
        'error'
      )
    openMainLoader(true)
    const response = await getUserByDocument(params)
    openMainLoader(false)
    if (response?.success) {
      return await dispatchShowAlertInformation()
    } else {
      return showAlert(response.message, 'error')
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
      if (props.formType === 'update') router.go(0)
    }
  }

  const goToView = async (route: string, id?: number) => {
    await router.push({ name: route, params: { id } })
  }

  const submit = () => {
    if (isInactiveBranch.value) return showAlert('Sede inactiva', 'error')
    if (isInactiveRole.value) {
      showAlert('Rol inactivo', 'error')
    } else {
      emit('onContinue', 'form-data')
    }
  }

  watch(formValues.value, (val) => {
    _setUserDataForm(val)
  })

  watch(isRoleInactive, (newVal) => {
    if (newVal) {
      isInactiveRole.value = isRoleInactive.value
    }
    if (!newVal) {
      isInactiveRole.value = isRoleInactive.value
    }
  })

  watch(isBranchInactive, (newVal) => {
    if (newVal) {
      isInactiveBranch.value = isBranchInactive.value
    }
    if (!newVal) {
      isInactiveBranch.value = isBranchInactive.value
    }
  })

  onMounted(() => {
    if (props.formType === 'create' && userDataForm.value) {
      setUserValues()
    }
    if (props.formType === 'update') {
      setUserValues()
    }
  })

  return {
    formValues,
    // Methods:
    submit,
    searchUserByDocument,

    // Select resources:
    sex,
    cities,
    roles,
    branches,
    document_types_user,
    isExpeditionPlaceRequired,
    isDateRequired,
  }
}

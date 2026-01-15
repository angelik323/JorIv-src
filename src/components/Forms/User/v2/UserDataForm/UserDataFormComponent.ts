import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Stores:
import { useUserModuleStore, useResourceStore } from '@/stores'
import { ICreateUpdateUserFormData } from '@/interfaces/global'
// Utils:
import { defaultIcons } from '@/utils'

export const useUserDataFormComponent = (props: any) => {
  const {
    document_types_user,
    user_types,
    user_profile,
    user_roles,
    user_status,
  } = storeToRefs(useResourceStore('v1'))
  const { user_data } = storeToRefs(useUserModuleStore('v1'))
  const { _setUserData } = useUserModuleStore('v1')

  const userDataForm = ref()
  const showPassword = ref<boolean>(false)

  const formValues = ref<ICreateUpdateUserFormData>({
    // User data:
    document: null as string | null,
    document_type_id: null as number | null,
    name: null as string | null,
    second_name: null as string | null,
    last_name: null as string | null,
    second_last_name: null as string | null,
    phone: null as string | null,
    user_code: null as string | null,
    email: null as string | null,
    profile_type: null as string | null,
    user_type: null as string | null,
    status_id: null as number | null,
    role: null as number | null,
    password: null as string | null,
    password_check: false as boolean,

    // Not backend:
    creation_date: null as string | null,
  })

  const setUserValues = () => {
    if (user_data.value) {
      formValues.value.creation_date = user_data.value.created_at
      formValues.value.user_type = user_data.value?.user_type
      formValues.value.user_code = user_data.value.user_code
      formValues.value.document_type_id = user_data.value.document_type_id
      formValues.value.document = user_data.value.document
      formValues.value.name = user_data.value.name
      formValues.value.second_name = user_data.value.second_name
      formValues.value.last_name = user_data.value.last_name
      formValues.value.second_last_name = user_data.value.second_last_name
      formValues.value.email = user_data.value.email
      formValues.value.phone = user_data.value.phone
        ? `(+57)${user_data.value?.phone.toString().replace('(+57)', '')}`
        : ''

      formValues.value.profile_type = user_data.value.profile_type
      formValues.value.role = user_data.value.roles[0].id
      formValues.value.status_id = user_data.value.status_id
    }
  }

  const validateForm = async () => {
    const isSuccessForm = await userDataForm.value
      .validate()
      .then((success: any) => {
        return success
      })
    return isSuccessForm
  }

  const handleFormType = () => {
    if (props.formType === 'update' && user_data.value) {
      setUserValues()
    }
  }

  watch(formValues.value, (val) => {
    _setUserData(val)
  })

  watch(
    () => user_data.value,
    () => {
      setUserValues()
    },
    { deep: true }
  )

  onMounted(() => {
    handleFormType()
  })

  return {
    // Values:
    formValues,
    userDataForm,
    showPassword,
    defaultIcons,
    // Select resources:
    document_types_user,
    user_types,
    user_profile,
    user_roles,
    user_status,

    // Methods:
    validateForm,
  }
}

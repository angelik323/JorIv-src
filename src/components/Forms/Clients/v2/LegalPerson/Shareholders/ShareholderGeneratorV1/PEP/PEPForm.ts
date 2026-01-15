import { IShareholder, IShareholderPEPForm } from '@/interfaces/customs/Clients'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores'

export const usePEPForm = (props: {
  formType: 'create' | 'edit' | 'view'
  data?: IShareholder | null
}) => {
  const { data_shareholder_pep_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataShareholderPEPForm } = useClientsStore('v1')

  const formValues = ref<IShareholderPEPForm>({
    is_pep: false,
    political_decree_830_2021: false,
    is_representative_intl_org: false,
    is_pep_international: false,
    has_pep_relative: false,
    related_pep_full_name: null,
    pep_relationship: null,
    position_held: null,
  })
  const formElementRef = ref()

  const setInitData = () => {
    if (!data_shareholder_pep_form.value) return
    formValues.value = { ...data_shareholder_pep_form.value }
  }

  const setForm = () => {
    const data = props.data
    if (data) {
      formValues.value.is_pep = data.is_pep ?? false
      formValues.value.political_decree_830_2021 =
        data.political_decree_830_2021 ?? false
      formValues.value.is_representative_intl_org =
        data.is_representative_intl_org ?? false
      formValues.value.is_pep_international = data.is_pep_international ?? false
      formValues.value.has_pep_relative = data.has_pep_relative ?? false
      formValues.value.related_pep_full_name =
        data.related_pep_full_name ?? null
      formValues.value.pep_relationship = data.pep_relationship ?? null
      formValues.value.position_held = data.position_held ?? null
    }
  }

  const handlerActionForm = (formType: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof formType, () => void> = {
      create: setInitData,
      edit: data_shareholder_pep_form.value ? setInitData : setForm,
      view: setForm,
    }
    actionHandlers[formType]?.()
  }

  onMounted(() => {
    handlerActionForm(props.formType)
  })

  watch(
    () => [formValues.value.is_pep],
    () => {
      if (!formValues.value.is_pep) {
        formValues.value.political_decree_830_2021 = false
        formValues.value.is_representative_intl_org = false
        formValues.value.is_pep_international = false
      }
    }
  )

  watch(
    () => [formValues.value.has_pep_relative],
    () => {
      if (!formValues.value.has_pep_relative) {
        formValues.value.related_pep_full_name = null
        formValues.value.pep_relationship = null
        formValues.value.position_held = null
      }
    }
  )

  watch(
    formValues,
    (newValue: IShareholderPEPForm) => {
      _setDataShareholderPEPForm(newValue)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.formType)
      }
    }
  )

  return {
    formValues,
    formElementRef,
    onlyLetters: /^(?! )[A-Za-zÁÉÍÓÚÜÑñáéíóúü]+(?: [A-Za-zÁÉÍÓÚÜÑñáéíóúü]+)*$/,
  }
}

import { IShareholderTributaryForm } from '@/interfaces/customs/Clients'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore, useResourceStore } from '@/stores'

export const useTributaryForm = (props: any) => {
  const { data_shareholder_tributary_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataShareholderTributaryForm } = useClientsStore('v1')
  const { countries } = storeToRefs(useResourceStore('v1'))

  const formValues = ref<IShareholderTributaryForm>({
    tributary_has_control_over_legal_entity: false,
    tributary_country: null,
    giin_code: null,
  })
  const formElementRef = ref()

  const setInitData = () => {
    if (!data_shareholder_tributary_form.value) return
    formValues.value = { ...data_shareholder_tributary_form.value }
  }

  const setForm = () => {
    const data = props.data
    if (data) {
      formValues.value.tributary_has_control_over_legal_entity =
        data.tributary_has_control_over_legal_entity ?? false
      formValues.value.tributary_country = data.tributary_country ?? null
      formValues.value.giin_code = data.giin_code ?? null
    }
  }

  const handlerActionForm = (formType: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof formType, () => void> = {
      create: setInitData,
      edit: data_shareholder_tributary_form.value ? setInitData : setForm,
      view: setForm,
    }
    actionHandlers[formType]?.()
  }

  onMounted(() => {
    handlerActionForm(props.formType)
  })

  watch(
    () => [formValues.value.tributary_has_control_over_legal_entity],
    () => {
      if (!formValues.value.tributary_has_control_over_legal_entity) {
        formValues.value.tributary_country = null
        formValues.value.giin_code = null
      }
    }
  )

  watch(
    formValues,
    (newValue: IShareholderTributaryForm) => {
      _setDataShareholderTributaryForm(newValue)
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
    countries,
  }
}

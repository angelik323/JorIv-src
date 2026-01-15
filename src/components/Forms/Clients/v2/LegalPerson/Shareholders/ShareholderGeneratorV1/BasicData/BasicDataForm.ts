import { IShareholder, IShareholderInfoForm } from '@/interfaces/customs'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore, useResourceStore } from '@/stores'

export const useShareholderInfoForm = (props: {
  formType: 'create' | 'edit' | 'view'
  data?: IShareholder | null
  isNaturalPerson: boolean
  isLegalPerson: boolean
}) => {
  const { data_shareholder_info_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataShareholderInfoForm } = useClientsStore('v1')
  const { shareholder_types, beneficiary_ownerships, beneficiary_benefits } =
    storeToRefs(useResourceStore('v1'))

  const formValues = ref<IShareholderInfoForm>({
    shareholder_type: null,
    beneficial_owner_by_ownership: null,
    beneficial_owner_by_beneficiaries: null,
    participation_percent: null,
    has_control_over_legal_entity: false,
  })
  const formElementRef = ref()

  const setInitData = () => {
    if (!data_shareholder_info_form.value) return
    formValues.value = { ...data_shareholder_info_form.value }
  }

  const setForm = () => {
    const data = props.data
    if (data) {
      formValues.value.shareholder_type = data.shareholder_type ?? null
      formValues.value.beneficial_owner_by_ownership =
        data.beneficial_owner_by_ownership ?? null
      formValues.value.beneficial_owner_by_beneficiaries =
        data.beneficial_owner_by_beneficiaries ?? null
      formValues.value.participation_percent =
        data.participation_percent ?? null
      formValues.value.has_control_over_legal_entity =
        data.has_control_over_legal_entity
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setInitData,
      edit: data_shareholder_info_form.value ? setInitData : setForm,
      view: setForm,
    }
    actionHandlers[action]?.()
  }

  onMounted(() => {
    handlerActionForm(props.formType)
  })

  watch(
    formValues,
    (newValue: IShareholderInfoForm) => {
      _setDataShareholderInfoForm(newValue)
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
    shareholder_types,
    beneficiary_ownerships,
    beneficiary_benefits,
  }
}

import { useAlert } from '@/composables'
import { IGeneralDataForm } from '@/interfaces/global'
import { useResourcesStore, useThirdPartiesStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

export const useGeneralDataForm = (props: any, emit: Function) => {
  const loadingCities = ref(false)
  const { showAlert } = useAlert()

  const { getResources } = useResourcesStore()
  const { branches } = storeToRefs(useResourcesStore())
  const { _setGeneralDataForm } = useThirdPartiesStore()
  const { generalDataForm, thirdPartiesData } = storeToRefs(
    useThirdPartiesStore()
  )

  const formValues = ref<IGeneralDataForm>({
    // General Data Third Party:
    classification: null as string | null,
    nature: null as string | null,
    document_type_id: null as string | null,
    document: null as string | null,
    branch_id: null as string | null,
    name: null as string | null,
    tax_regime: null as string | null,
    tax_manager: null as string | null,
    commercial_registration: null as string | null,
    validator_digit: null as string | null,
    ips_code: null as string | null,
    ciiu_id: null as string | null,
    email: null as string | null,
    phone: null as string | null,
    department_id: null as string | null,
    city_id: null as string | null,
    address: null as string | null,
    contact_name: null as string | null,
    contact_phone: null as string | null,

    //V2
    third_party_classification: null as string | null,
    organ: null as string | null,
    jurisdiction: null as string | null,
    manage_withholdings: false as boolean | null,
    observations: null as string | null,
  })

  const formattedBranches = computed(() => {
    if (props.formType === 'update')
      return branches.value.filter(
        (branch: any) =>
          branch.status_id === 1 ||
          branch.value === thirdPartiesData.value?.branch?.id
      )
    return branches.value.filter((branch: any) => branch.status_id === 1)
  })

  const submit = () => {
    emit('onContinue', 'GeneralData')
  }

  const setGeneralData = () => {
    formValues.value.classification =
      generalDataForm.value?.classification ??
      thirdPartiesData.value?.classification

    formValues.value.nature =
      generalDataForm.value?.nature ?? thirdPartiesData.value?.nature

    formValues.value.document_type_id =
      generalDataForm.value?.document_type_id ??
      thirdPartiesData.value?.document_type.id

    formValues.value.document =
      generalDataForm.value?.document ?? thirdPartiesData.value?.document

    formValues.value.branch_id =
      generalDataForm.value?.branch_id ?? thirdPartiesData.value?.branch?.id

    formValues.value.name =
      generalDataForm.value?.name ?? thirdPartiesData.value?.name

    formValues.value.tax_regime =
      generalDataForm.value?.tax_regime ?? thirdPartiesData.value?.tax_regime

    formValues.value.tax_manager =
      generalDataForm.value?.tax_manager ?? thirdPartiesData.value?.tax_manager

    formValues.value.commercial_registration =
      generalDataForm.value?.commercial_registration ??
      thirdPartiesData.value?.commercial_registration

    formValues.value.validator_digit =
      generalDataForm.value?.validator_digit ??
      thirdPartiesData.value?.validator_digit

    formValues.value.ips_code =
      generalDataForm.value?.ips_code ?? thirdPartiesData.value?.ips_code

    formValues.value.ciiu_id =
      generalDataForm.value?.ciiu_id ?? thirdPartiesData.value?.ciiu?.id

    formValues.value.email =
      generalDataForm.value?.email ?? thirdPartiesData.value?.email

    formValues.value.phone =
      generalDataForm.value?.phone ?? thirdPartiesData.value?.phone

    formValues.value.department_id =
      generalDataForm.value?.department_id ??
      thirdPartiesData.value?.department?.id

    formValues.value.city_id =
      generalDataForm.value?.city_id ?? thirdPartiesData.value?.city?.id

    formValues.value.address =
      generalDataForm.value?.address ?? thirdPartiesData.value?.address

    formValues.value.contact_name =
      generalDataForm.value?.contact_name ??
      thirdPartiesData.value?.contact_name

    formValues.value.contact_phone =
      generalDataForm.value?.contact_phone ??
      thirdPartiesData.value?.contact_phone

    //V2
    formValues.value.third_party_classification =
      generalDataForm.value?.third_party_classification ??
      thirdPartiesData.value?.third_party_classification

    formValues.value.organ =
      generalDataForm.value?.organ ?? thirdPartiesData.value?.organ

    formValues.value.jurisdiction =
      generalDataForm.value?.jurisdiction ??
      thirdPartiesData.value?.jurisdiction

    formValues.value.manage_withholdings =
      generalDataForm.value?.manage_withholdings ??
      thirdPartiesData.value?.manage_withholdings

    formValues.value.observations =
      generalDataForm.value?.observations ??
      thirdPartiesData.value?.observations
  }

  watch(formValues.value, (val) => {
    _setGeneralDataForm(val)
  })

  watch(
    () => formValues.value.department_id,
    async (newDepartmentId) => {
      if (newDepartmentId) {
        loadingCities.value = true
        try {
          await getResources(
            `keys[]=cities&filter[department_id]=${newDepartmentId}`
          )
        } finally {
          loadingCities.value = false
        }
      }
    }
  )

  watch(thirdPartiesData, () => {
    if (props.formType === 'update') {
      setGeneralData()
    }
    if (thirdPartiesData.value?.branch?.status_id === 2) {
      showAlert('Sede inactiva', 'error')
    }
  })

  onMounted(async () => {
    if (props.formType === 'create') {
      if (generalDataForm.value) {
        setGeneralData()
      }
    }
    if (props.formType === 'update') {
      setGeneralData()
    }
  })

  return {
    formValues,
    formattedBranches,
    loadingCities,

    submit,
  }
}

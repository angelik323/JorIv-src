import { IVouncherValidationModel } from '@/interfaces/customs'
import { useAccountStructuresStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { IResource } from '@/interfaces/global'

const useValidationVouchersForm = (props: {
  action: 'create' | 'edit'
  data?: IVouncherValidationModel
}) => {
  const {
    business_trusts_with_description_by_account_structure,
    account_structures_active,
  } = storeToRefs(useResourceStore('v1'))

  const { _getAccountingResources } = useResourceStore('v1')

  const { accounting_catalog_type } = useAccountStructuresStore('v1')

  const validationVouchersForm = ref()

  const selectedFromBusiness = ref()
  const selectedStructure = ref()
  const selectedToBusiness = ref()
  const isAccountingCatalog = computed(
    () => models?.value?.structure === accounting_catalog_type
  )

  const models = ref<IVouncherValidationModel>({
    period_date: '',
    structure: '',
  })

  const isEdit = computed(() => props.action === 'edit')

  const keys = [
    'account_structures_active',
    'business_trusts_with_description_by_account_structure',
  ]
  watch(
    () => models.value.structure,
    (newId, oldId) => {
      if (!newId) return
      _getAccountingResources(
        `filter[account_structures_id]=${newId.id}&keys[]=business_trusts_with_description_by_account_structure`
      )
      if (oldId && newId !== oldId) {
        models.value.from_business_trust_id = undefined
        models.value.to_business_trust_id = undefined
        selectedFromBusiness.value = undefined
        selectedToBusiness.value = undefined
      }
    }
  )
  const selectFromBusiness = (event: number) => {
    selectedFromBusiness.value = undefined
    models.value.from_business_trust_id = undefined

    if (event) {
      selectedFromBusiness.value =
        business_trusts_with_description_by_account_structure.value.find(
          (business: IResource) => business.id === event
        )
      models.value.from_business_trust_id = selectedFromBusiness.value
    }
  }

  const selectStructure = (event: number) => {
    selectedStructure.value = undefined
    models.value.structure = ''

    if (event) {
      selectedStructure.value = account_structures_active.value.find(
        (Strcture: IResource) => Strcture.id === event
      )
      models.value.structure = selectedStructure.value
    }
  }

  const selectToBusiness = (event: number) => {
    selectedToBusiness.value = undefined
    models.value.to_business_trust_id = undefined

    if (event) {
      selectedToBusiness.value =
        business_trusts_with_description_by_account_structure.value.find(
          (business: IResource) => business.id === event
        )
      models.value.to_business_trust_id = selectedToBusiness.value
    }
  }

  onMounted(async () => {
    _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  return {
    selectedFromBusiness,
    selectedToBusiness,
    selectedStructure,
    business_trusts_with_description_by_account_structure,
    account_structures_active,
    models,
    validationVouchersForm,
    isEdit,
    isAccountingCatalog,
    selectToBusiness,
    selectStructure,
    selectFromBusiness,
  }
}

export default useValidationVouchersForm

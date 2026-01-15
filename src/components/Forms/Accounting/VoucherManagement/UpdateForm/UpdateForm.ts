// Vue - pinia
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType, IResource } from '@/interfaces/global'
import { IVoucherManagementUpdateForm } from '@/interfaces/customs/accounting/VoucherManagement'
import { IAccountingStructureResource } from '@/interfaces/customs/resources/Accounting'

// Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useResourceManagerStore } from '@/stores/resources-manager'

// Composables
import { useMainLoader, useUtils } from '@/composables'

const DAYS_TO_ADD = 1

const createDefaultModels = (): IVoucherManagementUpdateForm => ({
  period_date: null,
  structure: null,
  from_business_trust_id: null,
  to_business_trust_id: null,
  daily_closing: null,
  update: '',
  day_to_update: null,
  needs_voucher: null,
  from_update: true,
})

const useUpdateForm = (
  _action: ActionType,
  _data: IVoucherManagementUpdateForm | null
) => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, getDateWithSumedDays } = useUtils()

  const basicDataFormRef = ref()
  const models = ref<IVoucherManagementUpdateForm>(createDefaultModels())
  const descriptionsFields = ref({
    accounting_structure_design: '',
    from_business_description: '',
    to_business_description: '',
  })

  const {
    business_trusts_with_description_by_account_structure_code,
    accounting_account_structures,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')

  const selectsOptions = computed(() => ({
    account_structures: accounting_account_structures.value,
    business_trusts:
      business_trusts_with_description_by_account_structure_code.value,
  }))

  const keyBusinessTrust = {
    accounting: ['business_trusts_with_description_by_account_structure'],
  }

  const onChangeStructure = async (event: number) => {
    openMainLoader(true)
    business_trusts_with_description_by_account_structure_code.value = []
    models.value.structure = ''
    descriptionsFields.value.accounting_structure_design = ''
    const selectedStructure = accounting_account_structures.value.find(
      (structure: IAccountingStructureResource) => structure.id === event
    )
    if (selectedStructure) {
      models.value.structure = selectedStructure.code ?? ''
      descriptionsFields.value.accounting_structure_design =
        selectedStructure.structure ?? ''

      await _getResources(
        keyBusinessTrust,
        `filter[account_structures_id]=${selectedStructure.id ?? 0}`
      )
    }
    models.value.from_business_trust_id = null
    descriptionsFields.value.from_business_description = ''
    models.value.to_business_trust_id = null
    descriptionsFields.value.to_business_description = ''

    openMainLoader(false)
  }

  const onChangeFromBusiness = (event: number) => {
    if (!event) {
      models.value.from_business_trust_id = null
      models.value.from_business_trust_code = null
      descriptionsFields.value.from_business_description = ''
      return
    }

    const selectedBusiness = selectsOptions.value.business_trusts.find(
      (business: IResource) => business.id === event
    )
    if (selectedBusiness) {
      models.value.from_business_trust_id = selectedBusiness.id ?? 0
      models.value.from_business_trust_code =
        selectedBusiness.business_code ?? null
      descriptionsFields.value.from_business_description =
        selectedBusiness.business_description ?? ''

      models.value.daily_closing = selectedBusiness.daily_closing ?? null
      models.value.update = selectedBusiness.daily_closing ? 'Día' : 'Mes'
      models.value.update_custom_label = selectedBusiness.daily_closing
        ? 'Diario'
        : 'Mensual'

      if (selectedBusiness.daily_closing) {
        // Si el negocio tiene cierre diario, se suma un día a la última fecha de cierre
        models.value.day_to_update = getDateWithSumedDays(
          selectedBusiness.last_closing_day ?? '',
          DAYS_TO_ADD
        )
      } else {
        models.value.day_to_update = selectedBusiness.last_closing_day ?? null
      }
    }
  }

  const onChangeToBusiness = (event: number) => {
    if (!event) {
      models.value.to_business_trust_id = null
      models.value.to_business_trust_code = null
      descriptionsFields.value.to_business_description = ''
      return
    }

    const selectedBusiness = selectsOptions.value.business_trusts.find(
      (business: IResource) => business.id === event
    )
    if (selectedBusiness) {
      models.value.to_business_trust_id = selectedBusiness.id ?? 0
      models.value.to_business_trust_code =
        selectedBusiness.business_code ?? null
      descriptionsFields.value.to_business_description =
        selectedBusiness.business_description ?? ''
    }
  }

  return {
    models,
    basicDataFormRef,
    defaultIconsLucide,
    selectsOptions,
    descriptionsFields,
    onChangeStructure,
    onChangeFromBusiness,
    onChangeToBusiness,
  }
}

export default useUpdateForm

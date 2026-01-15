import { onMounted, ref, watch } from 'vue'

import { storeToRefs } from 'pinia'
import { useClientsStore, useResourceStore } from '@/stores'
import { ILegalClientTributary } from '@/interfaces/customs/Clients'

const useTributaryForm = (props: any) => {
  const { data_tributary_legal_form } = storeToRefs(useClientsStore('v1'))
  const { countries } = storeToRefs(useResourceStore('v1'))
  const { _setDataLegalCLientsTributary } = useClientsStore('v1')

  const formTributary = ref()
  const isAddressGeneratorOpen = ref(false)

  const models = ref({
    declare_income_tributary: false as boolean | undefined,
    declare_taxes_another_country_tributary: false as boolean | undefined,
    country_tributary: null as string | null | number,
    ciiu_code_tributary: null as string | null,
    branches_other_countries_tributary: false as boolean | undefined,
    economic_activity_branches_tributary: null as string | null,
    address_tributary: null as string | null,
    country_address_tributary: null as string | number | null,
    department_tributary: null as string | number | null,
    city_tributary: null as string | number | null,
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_tributary_legal_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: ILegalClientTributary = props.data
    if (data) {
      const tributaryData = data?.tax_info
      models.value.declare_income_tributary =
        tributaryData?.files_tax_return ?? false

      models.value.declare_taxes_another_country_tributary =
        tributaryData?.files_foreign_taxes ?? false
      models.value.country_tributary = tributaryData?.country ?? null
      models.value.ciiu_code_tributary = tributaryData?.giin_code ?? null

      models.value.branches_other_countries_tributary =
        tributaryData?.is_branches ?? false

      models.value.economic_activity_branches_tributary =
        tributaryData?.description_economic_activity ?? null

      models.value.address_tributary = tributaryData?.branch_address ?? null
      models.value.country_address_tributary =
        tributaryData?.branch_country ?? null
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: ILegalClientTributary = props.data
    if (data) {
      const tributaryData = data?.tax_info
      models.value.declare_income_tributary =
        tributaryData?.files_tax_return ?? false

      models.value.declare_taxes_another_country_tributary =
        tributaryData?.files_foreign_taxes ?? false
      models.value.country_tributary = tributaryData?.country_id ?? null
      models.value.ciiu_code_tributary = tributaryData?.giin_code ?? null

      models.value.branches_other_countries_tributary =
        tributaryData?.is_branches ?? false

      models.value.economic_activity_branches_tributary =
        tributaryData?.description_economic_activity ?? null

      models.value.address_tributary = tributaryData?.branch_address ?? null
      models.value.country_address_tributary =
        tributaryData?.branch_country_id ?? null
    }
  }

  const _setValueModel = () => {
    if (data_tributary_legal_form.value) {
      models.value = { ...data_tributary_legal_form.value }
    }
  }

  const clearForm = () => {
    models.value.declare_income_tributary = false
    models.value.declare_taxes_another_country_tributary = false
    models.value.country_tributary = null
    models.value.ciiu_code_tributary = null
    models.value.branches_other_countries_tributary = false
    models.value.economic_activity_branches_tributary = null
    models.value.address_tributary = null
    models.value.country_address_tributary = null
    models.value.department_tributary = null
    models.value.city_tributary = null
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [models.value.declare_taxes_another_country_tributary],
    () => {
      if (!models.value.declare_taxes_another_country_tributary) {
        models.value.country_tributary = null
        models.value.ciiu_code_tributary = null
      }
    }
  )

  watch(
    () => [models.value.branches_other_countries_tributary],
    () => {
      if (!models.value.branches_other_countries_tributary) {
        models.value.economic_activity_branches_tributary = null
        models.value.address_tributary = null
        models.value.country_address_tributary = null
        models.value.department_tributary = null
        models.value.city_tributary = null
      }
    }
  )

  watch(
    () => [
      models.value.declare_income_tributary,
      models.value.declare_taxes_another_country_tributary,
      models.value.country_tributary,
      models.value.ciiu_code_tributary,
      models.value.branches_other_countries_tributary,
      models.value.economic_activity_branches_tributary,
      models.value.address_tributary,
      models.value.country_address_tributary,
      models.value.department_tributary,
      models.value.city_tributary,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataLegalCLientsTributary(null)
      } else {
        _setDataLegalCLientsTributary({
          declare_income_tributary:
            models.value.declare_income_tributary ?? false,
          declare_taxes_another_country_tributary:
            models.value.declare_taxes_another_country_tributary ?? false,
          country_tributary: models.value.country_tributary ?? null,
          ciiu_code_tributary: models.value.ciiu_code_tributary ?? null,
          branches_other_countries_tributary:
            models.value.branches_other_countries_tributary ?? false,
          economic_activity_branches_tributary:
            models.value.economic_activity_branches_tributary ?? null,
          address_tributary: models.value.address_tributary ?? null,
          country_address_tributary:
            models.value.country_address_tributary ?? null,
          department_tributary: models.value.department_tributary ?? null,
          city_tributary: models.value.city_tributary ?? null,
        })
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return { models, formTributary, countries, isAddressGeneratorOpen }
}

export default useTributaryForm

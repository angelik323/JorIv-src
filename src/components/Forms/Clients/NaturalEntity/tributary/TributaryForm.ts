import { watch, onMounted, ref } from 'vue'
import { useClientsStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { IClientNaturalPersonRequest } from '@/interfaces/customs/Clients'

const useTributaryForm = (props: any) => {
  const { data_tributary_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataNaturalClientsTributary } = useClientsStore('v1')

  const { countries, third_party_taxpayer_types, third_party_tin_options } =
    storeToRefs(useResourceStore('v1'))

  const formTributary = ref()
  const isAddressGeneratorOpen = ref(false)

  const models = ref({
    tax_info: {
      taxpayer_type: '' as string | null | number,
      withholding_tax: false as boolean | undefined,
      has_different_nationality: false as boolean | undefined,
      foreign_responsibility: false as boolean | undefined,
      granted_power_attorney: false as boolean | undefined,
      tin_option_id: '' as string | null,
      tin_number: '' as string | null | number,
      country_id: '' as string | null | number,
      foreign_phone: '' as string | null,
      address: '' as string | null,
    },
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_tributary_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: IClientNaturalPersonRequest = props.data
    if (data) {
      models.value.tax_info.taxpayer_type =
        data?.third_party?.tax_info.taxpayer_type?.name ?? null
      models.value.tax_info.withholding_tax =
        data?.third_party?.tax_info.is_withholding_subject ?? false
      models.value.tax_info.has_different_nationality =
        data?.third_party?.tax_info.has_different_nationality ?? false
      models.value.tax_info.foreign_responsibility =
        data?.third_party?.tax_info.foreign_responsibility ?? false
      models.value.tax_info.granted_power_attorney =
        data?.third_party?.tax_info.has_notarial_power ?? false
      models.value.tax_info.tin_option_id =
        data?.third_party?.tax_info.tin_option ?? null
      models.value.tax_info.tin_number = data?.third_party?.tax_info.tin ?? ''
      models.value.tax_info.country_id =
        countries.value.find(
          (c) => c.value === (data?.third_party?.tax_info.country_id ?? '')
        )?.label ?? null // RECURSIVO, CAMBIAR POR NAME DEL COUNTRY QUE VENGA DESDE BACK
      models.value.tax_info.foreign_phone =
        data?.third_party?.tax_info.foreign_phone ?? null
      models.value.tax_info.address =
        data?.third_party?.tax_info.postal_address ?? null
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: IClientNaturalPersonRequest = props.data
    if (data) {
      models.value.tax_info.taxpayer_type =
        data?.third_party?.tax_info.taxpayer_type?.id ?? null
      models.value.tax_info.withholding_tax =
        data?.third_party?.tax_info.is_withholding_subject ?? false
      models.value.tax_info.has_different_nationality =
        data?.third_party?.tax_info.has_different_nationality ?? false
      models.value.tax_info.foreign_responsibility =
        data?.third_party?.tax_info.foreign_responsibility ?? false
      models.value.tax_info.granted_power_attorney =
        data?.third_party?.tax_info.has_notarial_power ?? false
      models.value.tax_info.tin_option_id =
        data?.third_party?.tax_info.tin_option ?? null
      models.value.tax_info.tin_number = data?.third_party?.tax_info.tin ?? ''
      models.value.tax_info.country_id =
        data?.third_party?.tax_info.country_id ?? null
      models.value.tax_info.foreign_phone =
        data?.third_party?.tax_info.foreign_phone ?? null
      models.value.tax_info.address =
        data?.third_party?.tax_info.postal_address ?? null
    }
  }

  const _setValueModel = () => {
    if (data_tributary_form.value) {
      models.value = { ...data_tributary_form.value }
    }
  }

  const clearForm = () => {
    models.value.tax_info.taxpayer_type = null
    models.value.tax_info.withholding_tax = false
    models.value.tax_info.has_different_nationality = false
    models.value.tax_info.foreign_responsibility = false
    models.value.tax_info.granted_power_attorney = false
    models.value.tax_info.tin_option_id = null
    models.value.tax_info.tin_number = null
    models.value.tax_info.country_id = null
    models.value.tax_info.foreign_phone = null
    models.value.tax_info.address = null
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.tax_info.foreign_responsibility,
      models.value.tax_info.has_different_nationality,
    ],
    () => {
      if (
        !models.value.tax_info.foreign_responsibility &&
        !models.value.tax_info.has_different_nationality
      ) {
        models.value.tax_info.tin_option_id = null
        models.value.tax_info.foreign_phone = ''
        models.value.tax_info.address = ''
        models.value.tax_info.country_id = null
      }
    }
  )

  watch(
    () => models.value.tax_info.tin_option_id,
    () => {
      if (models.value.tax_info.tin_option_id !== 'Posee TIN') {
        models.value.tax_info.tin_number = null
      }
    }
  )

  watch(
    () => [
      models.value.tax_info.taxpayer_type,
      models.value.tax_info.withholding_tax,
      models.value.tax_info.has_different_nationality,
      models.value.tax_info.foreign_responsibility,
      models.value.tax_info.granted_power_attorney,
      models.value.tax_info.tin_option_id,
      models.value.tax_info.tin_number,
      models.value.tax_info.country_id,
      models.value.tax_info.foreign_phone,
      models.value.tax_info.address,
    ],
    () => {
      if (isEmpty(models.value.tax_info)) {
        _setDataNaturalClientsTributary(null)
      } else {
        _setDataNaturalClientsTributary({
          tax_info: {
            taxpayer_type: models.value.tax_info.taxpayer_type ?? null,
            withholding_tax: models.value.tax_info.withholding_tax ?? false,
            has_different_nationality:
              models.value.tax_info.has_different_nationality ?? false,
            foreign_responsibility:
              models.value.tax_info.foreign_responsibility ?? false,
            granted_power_attorney:
              models.value.tax_info.granted_power_attorney ?? false,
            tin_option_id: models.value.tax_info.tin_option_id ?? null,
            tin_number: models.value.tax_info.tin_number ?? null,
            country_id: models.value.tax_info.country_id ?? null,
            foreign_phone: models.value.tax_info.foreign_phone ?? null,
            address: models.value.tax_info.address ?? null,
          },
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

  return {
    models,
    formTributary,
    third_party_tin_options,
    third_party_taxpayer_types,
    countries,
    isAddressGeneratorOpen,
  }
}

export default useTributaryForm

import { useClientsStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useUtils } from '@/composables'

const useEstateForm = (props: any) => {
  const { data_estate_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataNaturalClientsEstate } = useClientsStore('v1')
  const { estate_origin } = storeToRefs(useResourceStore('v1'))
  const { formatCurrencyString } = useUtils()

  const formEstate = ref()

  const models = ref<{
    resource_type: string | null
    asset_identification: string | null
    asset_value: string | number | null
    different_contributor: boolean | undefined
    asset_source: string | null
    other_asset_source: string | null
    purpose: string | null
  }>({
    resource_type: '',
    asset_identification: '',
    asset_value: '',
    different_contributor: false,
    asset_source: '',
    other_asset_source: '',
    purpose: '',
  })

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_estate_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    const data: any = props.data?.third_party.estate
    models.value.resource_type = data?.resource_to_deliver ?? ''
    models.value.asset_identification = data?.estate_identification ?? ''
    models.value.asset_value = data?.total_value_to_delivered ?? ''
    models.value.different_contributor =
      data?.is_contributor_different_trustor ?? false
    models.value.asset_source = data?.source_of_goods ?? ''
    models.value.other_asset_source = data?.other_source_of_goods ?? ''
    models.value.purpose = data?.contractual_relationship ?? ''
  }

  const setFormEdit = () => {
    const data: any = props.data?.third_party.estate
    models.value.resource_type = data?.resource_to_deliver ?? ''
    models.value.asset_identification = data?.estate_identification ?? ''
    models.value.asset_value = data?.total_value_to_delivered ?? ''
    models.value.different_contributor =
      data?.is_contributor_different_trustor ?? false
    models.value.asset_source = data?.source_of_goods ?? ''
    models.value.other_asset_source = data?.other_source_of_goods ?? ''
    models.value.purpose = data?.contractual_relationship ?? ''
  }

  const _setValueModel = () => {
    if (data_estate_form.value) {
      models.value = { ...data_estate_form.value }
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.resource_type,
      models.value.asset_identification,
      models.value.asset_value,
      models.value.different_contributor,
      models.value.asset_source,
      models.value.other_asset_source,
      models.value.purpose,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataNaturalClientsEstate(null)
      } else {
        _setDataNaturalClientsEstate({
          resource_type: models.value.resource_type ?? '',
          asset_identification: models.value.asset_identification ?? '',
          asset_value: models.value.asset_value ?? '',
          different_contributor: models.value.different_contributor ?? false,
          asset_source: models.value.asset_source ?? '',
          other_asset_source: models.value.other_asset_source ?? '',
          purpose: models.value.purpose ?? '',
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
    estate_origin,
    formEstate,
    formatCurrencyString,
  }
}

export default useEstateForm

import { IClientNaturalPersonRequest } from '@/interfaces/customs/Clients'
import { onMounted, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientsStore } from '@/stores'
import { useRules } from '@/composables'

const usePepForm = (props: any) => {
  const { data_pep_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataNaturalClientsPep } = useClientsStore('v1')
  const {
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
  } = useRules()

  const formPep = ref()

  const models = ref({
    is_pep: false as boolean | undefined,
    pep_info: {
      is_politician: false as boolean | undefined,
      legal_representative: false as boolean | undefined,
      is_pep_international: false as boolean | undefined,
      position: '' as string | null,
      date_entry: '' as string | null,
      date_exit: '' as string | null,
    },
    pep_info_relative: {
      familiar_politician: false as boolean | undefined,
      full_name: '' as string | null,
      relationship: '' as string | null,
      position: '' as string | null,
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
      edit: data_pep_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data: IClientNaturalPersonRequest = props.data
    if (data) {
      models.value.is_pep = data?.third_party?.pep_info.is_pep ?? false
      models.value.pep_info.is_politician =
        data?.third_party?.pep_info?.is_politician ?? false
      models.value.pep_info.legal_representative =
        data?.third_party?.pep_info?.is_pep_international ?? false
      models.value.pep_info.is_pep_international =
        data?.third_party?.pep_info?.is_international_pep ?? false
      models.value.pep_info.position =
        data?.third_party?.pep_info?.position ?? ''
      models.value.pep_info.date_entry =
        data?.third_party?.pep_info?.date_entry ?? ''
      models.value.pep_info.date_exit =
        data?.third_party?.pep_info?.date_exit ?? ''
      models.value.pep_info_relative.familiar_politician =
        data?.third_party?.pep_info?.has_pep_relatives ?? false
      models.value.pep_info_relative.full_name =
        // @ts-ignore
        data?.third_party?.pep_info?.relatives?.full_name || ''
      models.value.pep_info_relative.relationship =
        // @ts-ignore
        data?.third_party?.pep_info?.relatives?.relationship ?? ''
      models.value.pep_info_relative.position =
        // @ts-ignore
        data?.third_party?.pep_info?.relatives?.position ?? ''
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: IClientNaturalPersonRequest = props.data
    if (data) {
      models.value.is_pep = data?.third_party?.pep_info.is_pep ?? false
      models.value.pep_info.is_politician =
        data?.third_party?.pep_info?.is_politician ?? false
      models.value.pep_info.legal_representative =
        data?.third_party?.pep_info?.is_pep_international ?? false
      models.value.pep_info.is_pep_international =
        data?.third_party?.pep_info?.is_international_pep ?? false
      models.value.pep_info.position =
        data?.third_party?.pep_info?.position ?? ''
      models.value.pep_info.date_entry =
        data?.third_party?.pep_info?.date_entry ?? ''
      models.value.pep_info.date_exit =
        data?.third_party?.pep_info?.date_exit ?? ''
      models.value.pep_info_relative.familiar_politician =
        data?.third_party?.pep_info?.has_pep_relatives ?? false
      models.value.pep_info_relative.full_name =
        // @ts-ignore
        data?.third_party?.pep_info?.relatives?.full_name || ''
      models.value.pep_info_relative.relationship =
        // @ts-ignore
        data?.third_party?.pep_info?.relatives?.relationship ?? ''
      models.value.pep_info_relative.position =
        // @ts-ignore
        data?.third_party?.pep_info?.relatives?.position ?? ''
    }
  }

  const _setValueModel = () => {
    if (data_pep_form.value) {
      models.value = { ...data_pep_form.value }
    }
  }

  const clearForm = () => {
    models.value.is_pep = false
    models.value.pep_info.is_politician = false
    models.value.pep_info.legal_representative = false
    models.value.pep_info.is_pep_international = false
    models.value.pep_info.position = ''
    models.value.pep_info.date_entry = ''
    models.value.pep_info.date_exit = ''
    models.value.pep_info_relative.familiar_politician = false
    models.value.pep_info_relative.full_name = ''
    models.value.pep_info_relative.relationship = ''
    models.value.pep_info_relative.position = ''
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [
      models.value.is_pep,
      models.value.pep_info.is_politician,
      models.value.pep_info.legal_representative,
      models.value.pep_info.is_pep_international,
      models.value.pep_info.position,
      models.value.pep_info.date_entry,
      models.value.pep_info.date_exit,
      models.value.pep_info_relative.familiar_politician,
      models.value.pep_info_relative.full_name,
      models.value.pep_info_relative.relationship,
      models.value.pep_info_relative.position,
    ],
    () => {
      if (isEmpty(models.value)) {
        _setDataNaturalClientsPep(null)
      } else {
        _setDataNaturalClientsPep({
          is_pep: models.value.is_pep ?? false,
          pep_info: {
            is_politician: models.value.pep_info.is_politician ?? false,
            legal_representative:
              models.value.pep_info.legal_representative ?? false,
            is_pep_international:
              models.value.pep_info.is_pep_international ?? false,
            position: models.value.pep_info.position ?? '',
            date_entry: models.value.pep_info.date_entry ?? '',
            date_exit: models.value.pep_info.date_exit ?? '',
          },
          pep_info_relative: {
            familiar_politician:
              models.value.pep_info_relative.familiar_politician ?? false,
            full_name: models.value.pep_info_relative.full_name ?? '',
            relationship: models.value.pep_info_relative.relationship ?? '',
            position: models.value.pep_info_relative.position ?? '',
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

  watch(
    () => models.value.is_pep,
    () => {
      if (!models.value.is_pep) {
        models.value.pep_info.is_pep_international = false
        models.value.pep_info.is_politician = false
        models.value.pep_info.legal_representative = false
        models.value.pep_info.position = ''
        models.value.pep_info.date_entry = ''
        models.value.pep_info.date_exit = ''
      }
    }
  )
  watch(
    () => models.value.pep_info_relative.familiar_politician,
    () => {
      if (!models.value.pep_info_relative.familiar_politician) {
        models.value.pep_info_relative.full_name = ''
        models.value.pep_info_relative.relationship = ''
        models.value.pep_info_relative.position = ''
      }
    }
  )

  return {
    models,
    formPep,
    date_before_or_equal_to_the_current_date,
    date_after_or_equal_to_specific_date,
  }
}

export default usePepForm

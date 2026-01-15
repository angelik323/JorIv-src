// vue - router - quasar
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// Interfaces
import {
  ITypeCommissionsInformationFormV2,
  ITypeCommissionsResponseV2,
} from '@/interfaces/customs/settlement-commissions/TypeCommissionsV2'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTypeCommissionsStore } from '@/stores/settlement-commissions/type-commissions'

const useTypeCommissionsEdit = () => {
  const { _updateTypeCommissions, _getByIdTypeCommissions, _clearData } =
    useTypeCommissionsStore('v2')
  const { headerPropsDefault, type_commissions_response } = storeToRefs(
    useTypeCommissionsStore('v2')
  )

  // Data de formularios
  const data_information_form = ref<ITypeCommissionsInformationFormV2 | null>(
    null
  )

  // Referencias a formularios
  const informationFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    settlement_commissions: [
      'commission_class_catalogs',
      'commission_type_catalogs',
    ],
  }

  const headerProperties = {
    title: 'Editar tipo de comisión',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'TypeCommissionsEdit',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const setFormEdit = (data: ITypeCommissionsResponseV2) => {
    const {
      commission_class_catalog_id,
      commission_type_catalog_id,
      description,
      code,
    } = data

    data_information_form.value = {
      code: code ?? null,
      description: description,
      commission_type_catalog_id: commission_type_catalog_id ?? null,
      commission_class_catalog_id: commission_class_catalog_id ?? null,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: ITypeCommissionsInformationFormV2 | null
  ) => {
    if (!data) return {}

    const request: Partial<ITypeCommissionsInformationFormV2> = {
      description: data.description ?? null,
      commission_type_catalog_id: data.commission_type_catalog_id ?? null,
      commission_class_catalog_id: data.commission_class_catalog_id ?? null,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ITypeCommissionsInformationFormV2> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    try {
      valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
    } catch {
      valid = false
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateTypeCommissions(payload, searchId)
    if (success) {
      goToURL('CommissionTypesList')
    }
    openMainLoader(false)
  }

  const isFormValid = computed(() => {
    return Boolean(
      data_information_form.value?.description &&
        data_information_form.value?.commission_class_catalog_id &&
        data_information_form.value?.commission_type_catalog_id
    )
  })

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdTypeCommissions(searchId)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => type_commissions_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    type_commissions_response,
    data_information_form,
    informationFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    isFormValid,

    onSubmit,
    goToURL,
  }
}

export default useTypeCommissionsEdit

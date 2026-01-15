import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainLoader, useRules, useUtils } from '@/composables'

import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBankingNetworkUploadAnnulate } from '@/interfaces/customs/treasury/CancelLoadBanks'

import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

import { useCancelBankLoadsStore } from '@/stores/treasury/cancel-load-banks'

const useCancelBankLoadsList = () => {
  const {
    _getBankingNetworkUploads,
    _getBankingNetworkUploadsRecords,
    _postBankingNetworkUploadsAnnulate,
    _getBankingNetworkUploadsExport,
  } = useCancelBankLoadsStore('v1')

  const {
    banking_network_upload_request_types,
    banking_network_uploads_annulated,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const { banking_network_upload_business_trusts } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const key_v1_fics = ['offices']
  const keys_v2_treasury = [
    'banking_network_upload_request_types',
    'treasury_cancellation_codes',
  ]

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProperties = ref({
    title: 'Anulaciones cargue bancos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      { label: 'Anulaciones cargue bancos', route: 'CancelLoadBanksList' },
    ],
  })

  const fileType = ref<string | null>(null)
  const office = ref<string | null>(null)
  const business = ref<number | null>(null)
  const cargueNro = ref<number | null>(null)
  const showDetails = ref(false)
  const filterRef = ref()

  const selectedBusiness = (businessId: number | null) => {
    if (!filterRef.value) return

    if (businessId) {
      const negocio = banking_network_upload_business_trusts.value.find(
        (item) => item.id === businessId
      )

      if (negocio) {
        filterRef.value.setFieldValueByName('nombre_negocio', negocio.name)
        business.value = businessId
        return
      }
    }

    filterRef.value.setFieldValueByName('nombre_negocio', '-')
    business.value = null
    filterRef.value.setFieldValueByName('cargue_nro', null)
    cargueNro.value = null
  }

  const selectedOffice = (officeId: string | null) => {
    if (officeId) {
      office.value = officeId
      return
    }

    filterRef.value.setFieldValueByName('nombre_negocio', '-')
    filterRef.value.setFieldValueByName('negocio', null)
    business.value = null
    filterRef.value.setFieldValueByName('cargue_nro', null)
    cargueNro.value = null
    office.value = null
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'tipo_archivo',
      label: 'Tipo de archivo*',
      type: 'q-select',
      value: null,
      options: banking_network_upload_request_types,
      placeholder: 'Seleccione',
      class: 'col-12',
      disable: false,
      clean_value: true,
      onChange: (value: string) => {
        fileType.value = value
      },
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'offices',
      label: 'Oficina*',
      type: 'q-select',
      value: null,
      options: offices,
      placeholder: 'Seleccione',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      onChange: selectedOffice,
      rules: [(v: string) => useRules().is_required(v)],
      autocomplete: true,
    },
    {
      name: 'negocio',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      options: banking_network_upload_business_trusts,
      placeholder: 'Seleccione',
      class: 'col-12 col-md-3',
      disable: true,
      autocomplete: true,
      clean_value: true,
      onChange: selectedBusiness,
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'nombre_negocio',
      label: 'Nombre negocio',
      type: 'q-input',
      value: '-',
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: false,
    },
    {
      name: 'cargue_nro',
      label: 'Cargue número*',
      type: 'q-select',
      value: null,
      options: banking_network_uploads_annulated,
      placeholder: 'Seleccione',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      onChange: (value: string) => {
        cargueNro.value = Number(value) || null
      },
      autocomplete: true,
      rules: [(v: string) => useRules().is_required(v)],
    },
  ])

  const data_information_form = ref<IBankingNetworkUploadAnnulate | null>(null)
  const informationFormRef = ref()

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: '¿Desea anular estos registros?',
    description_message: '',
    id: null as number | null,
  })

  watch(
    [fileType, office, business, cargueNro],
    ([newFileType, newOffice, newBusiness, newCargueNro]) => {
      if (!newFileType || !newOffice || !newBusiness || !newCargueNro) {
        showDetails.value = false
      }
    }
  )

  const clearRows = () => {
    showDetails.value = false
  }

  const handleFilter = ($filter: { 'filter[cargue_nro]': string }) => {
    cargueNro.value = Number($filter['filter[cargue_nro]']) || null

    if (!cargueNro.value) return
    showDetails.value = true
    listAction()
  }

  const listAction = async () => {
    if (!cargueNro.value) return

    openMainLoader(true)
    await _getBankingNetworkUploads(cargueNro.value)
    await _getBankingNetworkUploadsRecords(cargueNro.value)
    openMainLoader(false)
  }

  const makeBaseInfoRequest = (data: IBankingNetworkUploadAnnulate | null) => {
    if (!data) return {}

    const request: Partial<IBankingNetworkUploadAnnulate> = {
      income_record_ids: [...data.income_record_ids],
      annulate_date: data.annulate_date ?? '',
      annulate_period: data.annulate_period ?? '',
      annulate_code_id: data.annulate_code_id ?? 0,
      annulate_observations: data.annulate_observations ?? '',
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IBankingNetworkUploadAnnulate> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const onShowAlert = () => {
    alertModalConfig.value.description_message =
      '¿Desea anular estos registros? Esta acción no se puede deshacer.'
    alertModalRef.value?.openModal()
  }

  const confirmAnular = async () => {
    alertModalRef.value?.closeModal()

    openMainLoader(true)
    const payload = makeDataRequest()
    await _postBankingNetworkUploadsAnnulate(
      cargueNro.value as number,
      payload as IBankingNetworkUploadAnnulate
    )
    informationFormRef.value?.cleanDetailForm()
    listAction()
    openMainLoader(false)
  }

  const logsErrors = async () => {
    await _getBankingNetworkUploadsExport(cargueNro.value as number)
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(
      {
        treasury: keys_v2_treasury,
      },
      '',
      'v2'
    )

    await _getResources({
      fics: key_v1_fics,
    })
    openMainLoader(false)
  })

  watch(
    () => fileType.value,
    async (newType) => {
      const negocioField = filterConfig.value.find((f) => f.name === 'negocio')
      const nombreNegocioField = filterConfig.value.find(
        (f) => f.name === 'nombre_negocio'
      )
      const cargueNroField = filterConfig.value.find(
        (f) => f.name === 'cargue_nro'
      )

      business.value = null
      cargueNro.value = null

      if (filterRef.value) {
        filterRef.value.setFieldValueByName('negocio', null)
        filterRef.value.setFieldValueByName('nombre_negocio', '-')
        filterRef.value.setFieldValueByName('cargue_nro', null)
      }

      if (negocioField) negocioField.value = null
      if (nombreNegocioField) nombreNegocioField.value = '-'
      if (cargueNroField) cargueNroField.value = null

      if (newType === 'Multicash') {
        negocioField!.disable = true
        openMainLoader(true)

        await _getResources(
          { treasury: ['banking_network_uploads'] },
          `filter[request_type]=${newType}`,
          'v2'
        )

        openMainLoader(false)
        return
      }

      if (!newType) {
        negocioField!.disable = true
        return
      }

      negocioField!.disable = false

      await _getResources(
        { trust_business: ['banking_network_upload_business_trusts'] },
        `filter[request_type]=${newType}`
      )
    }
  )

  watch(
    [fileType, office, business],
    async ([newFileType, newOffice, newBusiness]) => {
      if (!newFileType || !newOffice || !newBusiness) return

      openMainLoader(true)

      await _getResources(
        { treasury: ['banking_network_uploads_annulated'] },
        `filter[request_type]=${newFileType}&filter[office_id]=${newOffice}&business_from_id=${newBusiness}&business_to_id=${newBusiness}`,
        'v2'
      )

      openMainLoader(false)
    }
  )

  onBeforeUnmount(() => {
    _resetKeys({
      treasury: keys_v2_treasury,
    })

    _resetKeys({
      treasury: ['banking_network_uploads_annulated'],
    })
  })

  return {
    headerProperties,
    filterConfig,
    alertModalRef,
    alertModalConfig,
    data_information_form,
    informationFormRef,
    filterRef,
    showDetails,
    handleFilter,
    onShowAlert,
    confirmAnular,
    logsErrors,
    clearRows,
  }
}

export default useCancelBankLoadsList

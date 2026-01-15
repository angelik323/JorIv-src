import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// Interfaces
import {
  IFiduciaryBusinessCommissionsForm,
  IFiduciaryBusinessCommissionsResponse,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores/settlement-commissions/fiduciary-business-commissions'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryBusinessCommissionsRead = () => {
  const {
    _updateRFiduciaryBusinessCommissions,
    _getByIdFiduciaryBusinessCommissions,
    _getByIdDescriptionsFiduciaryBusinessCommissions,
    _clearData,
  } = useFiduciaryBusinessCommissionsStore('v1')
  const { fiduciary_business_commissions_response } = storeToRefs(
    useFiduciaryBusinessCommissionsStore('v1')
  )

  // Data de formularios
  const basic_data_form = ref<IFiduciaryBusinessCommissionsForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()
  const descriptionsFormRef = ref()

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Editar comisión de negocios fiduciarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Definir Comisiones de negocios fiduciarios',
        route: 'BusinessTrustCommissionsList',
      },
      {
        label: 'Editar',
        route: 'FiduciaryBusinessCommissionsEdit',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic-data',
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

  const setFormEdit = (data: IFiduciaryBusinessCommissionsResponse) => {
    const {
      business_code_snapshot,
      business_name_snapshot,
      commission_type,
      commission_type_catalog_id,
      periodicity,
      colllection,
      iva,
      observation,
      third_party_billings_id,
      third_party_billings,
      comission_settlement_statuses_id,
    } = data

    basic_data_form.value = {
      business_code: business_code_snapshot ?? null,
      name: business_name_snapshot ?? null,
      commission_class_catalog_id: commission_type?.id ?? null,
      commission_type_catalog_id: commission_type_catalog_id ?? null,
      periodicity: periodicity ?? null,
      colllection: colllection ?? null,
      iva: iva ? 'si' : 'no',
      observation: observation ?? null,
      third_party_billings_id: third_party_billings_id ?? null,
      third_party_billings: third_party_billings ?? null,
      comission_settlement_statuses_id:
        comission_settlement_statuses_id ?? null,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: IFiduciaryBusinessCommissionsForm | null
  ) => {
    if (!data) return {}

    const request: Partial<IFiduciaryBusinessCommissionsForm> = {
      commission_type_id: data.commission_class_catalog_id ?? null,
      periodicity: data.periodicity ?? null,
      colllection: data.colllection ?? null,
      iva: data.iva === 'si',
      observation: data.observation ?? null,
      third_party_billings_id: data.third_party_billings_id ?? null,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IFiduciaryBusinessCommissionsForm> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    try {
      valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
    } catch {
      valid = false
    }
    return valid
  }

  const updateDescriptions = async (
    data: IFiduciaryBusinessCommissionsForm
  ) => {
    if (basic_data_form.value) {
      basic_data_form.value.observation = data.observation ?? null
    }
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateRFiduciaryBusinessCommissions(
      payload,
      searchId
    )
    if (success) {
      router.push({ name: 'BusinessTrustCommissionsList' })
    }
    openMainLoader(false)
  }

  const keys = {
    settlement_commissions: [
      'commission_types',
      'commission_type_catalogs',
      'periodicities',
    ],
  }

  const keysToClear = {
    settlement_commissions: [
      'commission_types',
      'commission_type_catalogs',
      'periodicities',
      'third_party_billings',
    ],
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[status_id]=59,57'
    )
    await _getByIdFiduciaryBusinessCommissions(searchId)
    await _getByIdDescriptionsFiduciaryBusinessCommissions(searchId)
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    _resetKeys(keysToClear)
  })

  watch(
    () => fiduciary_business_commissions_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    fiduciary_business_commissions_response,
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    descriptionsFormRef,

    updateDescriptions,
    onSubmit,
  }
}

export default useFiduciaryBusinessCommissionsRead

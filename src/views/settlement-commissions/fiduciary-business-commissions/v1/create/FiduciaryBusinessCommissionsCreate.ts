import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores/settlement-commissions/fiduciary-business-commissions'
import { useResourceManagerStore } from '@/stores/resources-manager'

// Interfaces
import { IFiduciaryBusinessCommissionsForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const useFiduciaryBusinessCommissionsCreate = () => {
  const { _createFiduciaryBusinessCommissions, _clearData } =
    useFiduciaryBusinessCommissionsStore('v1')

  // Data de formularios
  const basic_data_form = ref<IFiduciaryBusinessCommissionsForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Crear comisión de negocios fiduciarios',
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
        label: 'Definir comisiones de negocios fiduciarios',
        route: 'BusinessTrustCommissionsList',
      },
      {
        label: 'Crear',
        route: 'FiduciaryBusinessCommissionsCreate',
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

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: IFiduciaryBusinessCommissionsForm | null
  ) => {
    if (!data) return {}

    const request: Partial<IFiduciaryBusinessCommissionsForm> = {
      business_code: data.business_code ?? null,
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

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createFiduciaryBusinessCommissions(payload)
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
    openMainLoader(true)
    _clearData()
    await _getResources(keys)
    await _getResources(
      { trust_business: ['business_trusts'] },
      'filter[status_id]=59,57'
    )
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    _resetKeys(keysToClear)
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
  }
}

export default useFiduciaryBusinessCommissionsCreate

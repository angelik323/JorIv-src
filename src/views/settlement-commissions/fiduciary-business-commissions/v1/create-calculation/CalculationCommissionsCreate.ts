import { ref, onBeforeMount, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import {
  IFiduciaryBusinessCommissionsCalculationForm,
  IFiduciaryBusinessCommissionsResponse,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import {
  useFiduciaryBusinessCommissionsStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'

const useCalculationCommissionsCreate = () => {
  const {
    _createCalculationCommissions,
    _getByIdFiduciaryBusinessCommissions,
    _clearData,
  } = useFiduciaryBusinessCommissionsStore('v1')
  const { fiduciary_business_commissions_response } = storeToRefs(
    useFiduciaryBusinessCommissionsStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Data de formularios
  const basic_data_form =
    ref<IFiduciaryBusinessCommissionsCalculationForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const keys = {
    settlement_commissions: ['calculation_types'],
  }

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProps = {
    title: 'Crear cálculo de comisión fiduciaria',
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
        label: 'Ver',
        route: 'FiduciaryBusinessCommissionsRead',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const setFormCreate = (data: IFiduciaryBusinessCommissionsResponse) => {
    const {
      commission_type,
      commission_class_catalog_id,
      commission_type_catalog_id,
      iva,
    } = data

    basic_data_form.value = {
      calculation_type: null,
      smlmv_amount: 1423500,
      payment_amount: commission_type.value ?? null,
      returns_percentage: null,
      balances_percentage: null,
      other_amount: null,

      smlmv_quantity: null,
      payments_count: commission_type.value ? 1 : null,
      balances_amount: null,
      returns_amount: null,
      other_value_amount: null,

      base_amount: null,
      iva_percentage: iva ? 19 : 0,
      iva_amount: null,
      total_amount: null,

      commission_type_catalog_id: commission_type_catalog_id ?? null,
      commission_class_catalog_id: commission_class_catalog_id ?? null,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: IFiduciaryBusinessCommissionsCalculationForm | null
  ) => {
    if (!data) return {}

    const zeroFields: Record<string, number> = {}
    if (data.iva_percentage === 0) zeroFields.iva_percentage = 0
    if (data.iva_amount === 0) zeroFields.iva_amount = 0

    const request: Partial<IFiduciaryBusinessCommissionsCalculationForm> = {
      calculation_type: data.calculation_type,
      smlmv_amount: data.smlmv_amount,
      payment_amount: data.payment_amount,
      returns_percentage: data.returns_percentage,
      balances_percentage: data.balances_percentage,
      other_amount: data.other_amount,
      smlmv_quantity: data.smlmv_quantity,
      payments_count: data.payments_count,
      balances_amount: data.balances_amount,
      returns_amount: data.returns_amount,
      other_value_amount: data.other_value_amount,
      base_amount: data.base_amount,
      iva_percentage: data.iva_percentage,
      iva_amount: data.iva_amount,
      total_amount: data.total_amount,
    }

    const cleanedRequest = cleanEmptyFields(request)

    return { ...cleanedRequest, ...zeroFields }
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IFiduciaryBusinessCommissionsCalculationForm> =
      {
        ...makeBaseInfoRequest(basic_data_form.value),
      }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createCalculationCommissions(searchId, payload)
    if (success) {
      router.push({ name: 'BusinessTrustCommissionsList' })
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources(keys)
  })

  watch(
    () => fiduciary_business_commissions_response.value,
    (val) => {
      if (!val) return
      setFormCreate(val)
    }
  )

  watch(
    () => basic_data_form.value,
    (val) => {
      if (!val) return

      const type = val.calculation_type?.toLowerCase()

      switch (type) {
        case 'salario minimo legal vigente':
          if (val.smlmv_amount && val.smlmv_quantity) {
            val.base_amount = Number(
              (Number(val.smlmv_amount) * Number(val.smlmv_quantity)).toFixed(2)
            )
          }
          break
        case 'valor del pago':
          if (val.payment_amount && val.payments_count) {
            val.base_amount = Number(
              (Number(val.payment_amount) * Number(val.payments_count)).toFixed(
                2
              )
            )
          }
          break
        case '% sobre el rendimiento':
          if (val.returns_percentage && val.returns_amount) {
            val.base_amount = Number(
              (
                Number(val.returns_percentage) * Number(val.returns_amount)
              ).toFixed(2)
            )
          }
          break
        case '% sobre el saldos':
          if (val.balances_percentage && val.balances_amount) {
            val.base_amount = Number(
              (
                Number(val.balances_percentage) * Number(val.balances_amount)
              ).toFixed(2)
            )
          }
          break
        case 'otros valores':
          if (val.other_value_amount) {
            val.base_amount = Number(val.other_value_amount)
            val.other_amount = Number(val.other_value_amount)
          }
          break
      }

      if (val.base_amount) {
        val.iva_amount =
          (Number(val.base_amount) * Number(val.iva_percentage)) / 100
        val.total_amount = Number(val.base_amount) + Number(val.iva_amount || 0)
      }
    }
  )

  onBeforeMount(async () => {
    _clearData()
    _resetKeys(keys)
    openMainLoader(true)
    await _getByIdFiduciaryBusinessCommissions(searchId)
    openMainLoader(false)
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useCalculationCommissionsCreate

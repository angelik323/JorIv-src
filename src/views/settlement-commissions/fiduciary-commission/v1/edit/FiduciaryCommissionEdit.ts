import { ref, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryCommissionsStore } from '@/stores'

// Interfaces
import {
  IFiduciaryCommissionForm,
  IFiduciaryCommissionResponse,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

const useFiduciaryCommissionEdit = () => {
  const {
    _updateFiduciaryCommission,
    _getByIdFiduciaryCommission,
    _clearData,
  } = useFiduciaryCommissionsStore('v1')
  const { fiduciary_commission_response } = storeToRefs(
    useFiduciaryCommissionsStore('v1')
  )

  // Data de formularios
  const data_information_form = ref<IFiduciaryCommissionForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const headerProps = {
    title: 'Editar liquidación de comisión fiduciaria',
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
        label: 'Liquidación de comisión fiduciaria',
        route: 'SettlementFiduciaryCommissionsList',
      },
      {
        label: 'Editar',
        route: 'SettlementFiduciaryCommissionEdit',
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

  const setFormEdit = (data: IFiduciaryCommissionResponse) => {
    const { base_amount, iva_amount, total_amount, iva_percentage } = data

    data_information_form.value = {
      base_amount: base_amount,
      iva_amount: iva_amount,
      iva_percentage: iva_percentage,
      total_amount: total_amount,
    }
  }

  // Datos básicos form
  const makeBaseInfoRequest = (data: IFiduciaryCommissionForm | null) => {
    if (!data) return {}

    const request: Partial<IFiduciaryCommissionForm> = {
      base_amount: data.base_amount ? Number(data.base_amount) : null,
      iva_amount: data.iva_amount ? Number(data.iva_amount) : null,
      total_amount: data.total_amount ? Number(data.total_amount) : null,
      iva_percentage: data.iva_percentage ? Number(data.iva_percentage) : null,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IFiduciaryCommissionForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
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
    const success = await _updateFiduciaryCommission(payload, searchId)
    if (success) {
      router.push({ name: 'SettlementFiduciaryCommissionsList' })
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdFiduciaryCommission(searchId)
    openMainLoader(false)
  })

  watch(
    () => fiduciary_commission_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  return {
    fiduciary_commission_response,
    data_information_form,
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

export default useFiduciaryCommissionEdit

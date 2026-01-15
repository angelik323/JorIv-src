// Vue
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { IAnnualPaymentAmountsForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useAnnualPaymentAmountsStore } from '@/stores'

export const useAnnualPaymentAmountsEdit = () => {
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const AnnualPaymentAmountsId = +route.params.id

  const { openMainLoader } = useMainLoader()

  const { _getAnnualPaymentAmountsById, _updateAnnualPaymentAmounts } =
    useAnnualPaymentAmountsStore('v1')

  const { defaultIconsLucide } = useUtils()
  const basic_data_form = ref<IAnnualPaymentAmountsForm | null>(null)

  const basicDataFormRef = ref()

  const headerProps = {
    title: 'Editar montos anuales de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Montos anuales de pago',
        route: 'AnnualPaymentAmountsList',
      },
      {
        label: 'Editar',
        route: 'AnnualPaymentAmountsEdit',
      },
      {
        label: `${AnnualPaymentAmountsId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
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

  const setEditData = async () => {
    const data = await _getAnnualPaymentAmountsById(AnnualPaymentAmountsId)
    if (data) {
      basic_data_form.value = {
        year: data.year,
        minimum_salary: data.minimum_salary?.toString() ?? null,
        transport_subsidy: data.transport_subsidy?.toString() ?? null,
        uvt: data.uvt?.toString() ?? null,
        obligated_iva_uvt_pn: data.obligated_iva_uvt_pn?.toString() ?? null,
      }
    }
  }

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    openMainLoader(true)
    const payload = { ...basic_data_form.value }
    if (await _updateAnnualPaymentAmounts(payload, AnnualPaymentAmountsId)) {
      goToURL('AnnualPaymentAmountsList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(async () => {
    openMainLoader(true)
    await setEditData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    handleEdit,
    goToURL,
  }
}

export default useAnnualPaymentAmountsEdit

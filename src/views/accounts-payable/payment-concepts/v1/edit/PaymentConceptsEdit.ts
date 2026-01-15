// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { IPaymentConceptsForm } from '@/interfaces/customs/accounts-payable/PaymentConcepts'
import { ITabs } from '@/interfaces/global'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { usePaymentConceptsStore } from '@/stores/accounts-payable/payment-concepts'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const usePaymentConceptsEdit = () => {
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const PaymentConceptsId = +route.params.id

  const { showAlert } = useAlert()

  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const { _getPaymentConceptsById, _updatePaymentConcepts } =
    usePaymentConceptsStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    accounting: ['account_structures'],
    accounts_payable: [
      'payment_concept_types',
      'payment_concept_nature_types',
      'payment_concept_activity_types',
      'payment_concept_obligation_types',
      'payment_concept_pension_types',
    ],
  }

  const basicDataFormRef = ref()

  const basic_data_form = ref<IPaymentConceptsForm | null>(null)

  const headerProps = {
    title: 'Editar concepto de pago',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Conceptos de pago',
        route: 'PaymentConceptsList',
      },
      {
        label: 'Editar',
        route: 'PaymentConceptsEdit',
      },
      {
        label: `${PaymentConceptsId}`,
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

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    if (!basic_data_form.value.concept_type) {
      showAlert(`Debes seleccionar el tipo de concepto de pago`, 'error')
      return
    }
    openMainLoader(true)
    const payload = { ...basic_data_form.value }
    if (await _updatePaymentConcepts(payload, PaymentConceptsId)) {
      goToURL('PaymentConceptsList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const setEditData = async () => {
    const data = await _getPaymentConceptsById(PaymentConceptsId)
    if (data) {
      basic_data_form.value = {
        structure_id: data.structure_id ?? null,
        concept_code: data.concept_code ?? '',
        concept_name: data.concept_name ?? '',
        concept_type: data.concept_type.value ?? null,
        nature_type: data.nature_type.value ?? null,
        activity_type: data.activity_type.value ?? null,
        obligation_type: data.obligation_type.value ?? null,
        pension_type: data.pension_type?.value ?? null,
        liquidates_taxes: data.liquidates_taxes ?? null,
        is_advance: data.is_advance ?? null,
      }
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(
      keys,
      'filter[type]=Catálogo%20de%20conceptos%20pago&filter[status_id]=1'
    )
    await setEditData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(() => _resetKeys(keys))

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

export default usePaymentConceptsEdit

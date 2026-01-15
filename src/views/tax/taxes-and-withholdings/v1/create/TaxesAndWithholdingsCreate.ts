import { onMounted, ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

// Interfaces
import { ITaxesAndWithholdingsForm } from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Stores
import { useTaxesAndWithholdingsStore } from '@/stores/tax/taxes-and-withholdings'
import { useResourceManagerStore } from '@/stores'

const useTaxesAndWithholdingsCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const keys = {
    tax: ['tax_types', 'jurisdictions', 'dian_tax_types'],
    investment_portfolio: ['coins'],
  }

  const title: string = 'Crear impuestos y retenciones'
  const breadcrumbs = [
    {
      label: 'Inicio',
      route: 'HomeView',
    },
    {
      label: 'Tributario',
      route: '',
    },
    {
      label: 'Impuestos y retenciones',
      route: 'TaxesAndWithholdingsList',
    },
    {
      label: 'Crear',
      route: 'TaxesAndWithholdingsCreate',
    },
  ]

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'billing',
      label: 'Facturación',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const basic_data_form = ref<ITaxesAndWithholdingsForm | null>(null)

  const informationFormRef = ref()
  const billingFormRef = ref()

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef, billingFormRef]

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
  const makeDataRequest = () => {
    const data = basic_data_form.value

    const apiRequestBody: Partial<ITaxesAndWithholdingsForm> = {
      ...data,
      rounding_mode: 'techo',
      fixed_amount:
        data?.calculation === 'valor_fijo' ? data?.base_value : null,
    }

    return apiRequestBody
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()

    const successResponse =
      await useTaxesAndWithholdingsStore()._createTaxAndWithholding(payload)

    if (successResponse) {
      goToURL('TaxesAndWithholdingsList')
    }
    openMainLoader(false)
  }

  const backTab = () => {
    for (let i = tabActiveIdx.value - 1; i >= 0; i--) {
      if (tabs[i].show) {
        tabActiveIdx.value = i
        tabActive.value = tabs[i].name
        return
      }
    }
  }

  const nextTab = async () => {
    if (await validateForms()) {
      const start = tabActiveIdx.value + 1
      const nextIdx = tabs.findIndex((t, i) => i >= start && t.show)
      if (nextIdx !== -1) {
        tabActiveIdx.value = nextIdx
        tabActive.value = tabs[nextIdx].name
      }
    }
  }

  onMounted(() => {
    useResourceManagerStore('v1')._getResources(keys)
  })

  return {
    title,
    breadcrumbs,
    tabs,
    tabActive,
    tabActiveIdx,
    basic_data_form,
    informationFormRef,
    billingFormRef,
    defaultIconsLucide,
    backTab,
    nextTab,
    onSubmit,
    goToURL,
  }
}

export default useTaxesAndWithholdingsCreate

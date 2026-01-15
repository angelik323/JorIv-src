import { onMounted, ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { ITaxesAndWithholdingsForm } from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Stores
import { useTaxesAndWithholdingsStore } from '@/stores/tax/taxes-and-withholdings'
import { useResourceManagerStore } from '@/stores'

// Router
import { useRoute } from 'vue-router'

const useTaxesAndWithholdingsEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const keys = {
    tax: ['tax_types', 'jurisdictions', 'dian_tax_types'],
    investment_portfolio: ['coins'],
  }

  const id = useRoute().params?.id || null

  const title: string = 'Editar impuestos y retenciones'
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
      label: 'Editar',
      route: 'TaxesAndWithholdingsEdit',
    },
    {
      label: id!.toString(),
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

  // Referencias a formularios
  const informationFormRef = ref()
  const billingFormRef = ref()

  const basic_data_form = ref<ITaxesAndWithholdingsForm | null>(null)

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

  const showById = async () => {
    if (!id) {
      goToURL('TaxesAndWithholdingsList')
    }
    basic_data_form.value =
      await useTaxesAndWithholdingsStore()._getTaxAndWithholdingById(Number(id))
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const successResponse =
      await useTaxesAndWithholdingsStore()._updateTaxAndWithholding(
        Number(id),
        basic_data_form.value as ITaxesAndWithholdingsForm
      )

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

  onMounted(async () => {
    showById()
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

export default useTaxesAndWithholdingsEdit

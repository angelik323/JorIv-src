import { onMounted, ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITaxesAndWithholdingsForm,
  ITaxesAndWithholdingsValidities,
} from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Composables
import { useGoToUrl, useUtils } from '@/composables'

// Stores
import { useTaxesAndWithholdingsStore } from '@/stores/tax/taxes-and-withholdings'

// Router
import { useRoute } from 'vue-router'
import { useResourceManagerStore } from '@/stores'

const useTaxesAndWithholdingsRead = () => {
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const keys = {
    tax: ['tax_types', 'jurisdictions', 'dian_tax_types'],
    investment_portfolio: ['coins'],
  }

  const id = useRoute().params?.id || null

  const title: string = 'Ver impuestos y retenciones'
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
      label: 'Ver',
      route: 'TaxesAndWithholdingsRead',
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
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'validities',
      label: 'Vigencias',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'billing',
      label: 'Facturación',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
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
  const validitiesFormRef = ref()
  const billingFormRef = ref()

  const basic_data_form = ref<ITaxesAndWithholdingsForm | null>(null)
  const validities_form = ref<ITaxesAndWithholdingsValidities | null>(null)

  const showById = async () => {
    if (!id) {
      goToURL('TaxesAndWithholdingsList')
    }
    basic_data_form.value =
      await useTaxesAndWithholdingsStore()._getTaxAndWithholdingById(Number(id))

    const data = await useTaxesAndWithholdingsStore()._getValiditiesById(
      Number(id)
    )

    if (data)
      validities_form.value = {
        validities: data,
      }
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
    const start = tabActiveIdx.value + 1
    const nextIdx = tabs.findIndex((t, i) => i >= start && t.show)
    if (nextIdx !== -1) {
      tabActiveIdx.value = nextIdx
      tabActive.value = tabs[nextIdx].name
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
    validities_form,
    informationFormRef,
    validitiesFormRef,
    billingFormRef,
    defaultIconsLucide,
    backTab,
    nextTab,
    goToURL,
  }
}

export default useTaxesAndWithholdingsRead

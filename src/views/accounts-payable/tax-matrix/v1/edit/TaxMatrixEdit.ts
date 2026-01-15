// Vue
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITaxMatrixRow,
  ITaxMatrixUpdatePayload,
  TAX_TYPE_LABELS,
  TaxType,
  TaxTypeEnum,
} from '@/interfaces/customs/accounts-payable/TaxMatrix'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useTaxMatrixStoreV1 } from '@/stores/accounts-payable/tax-matrix/tax-matrix-v1'

const useTaxMatrixEdit = () => {
  const route = useRoute()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  const { _getTaxMatrixList, _updateTaxMatrix, getMatrixByType } =
    useTaxMatrixStoreV1()

  const taxMatrixFormRFTRef = ref()
  const taxMatrixFormRIVRef = ref()
  const taxMatrixFormRICRef = ref()
  const taxMatrixFormRTERef = ref()

  const originalData = ref<Record<TaxType, string>>({
    [TaxTypeEnum.RFT]: '',
    [TaxTypeEnum.RIV]: '',
    [TaxTypeEnum.RIC]: '',
    [TaxTypeEnum.RTE]: '',
  })

  const currentData = ref<Record<TaxType, ITaxMatrixRow[] | null>>({
    [TaxTypeEnum.RFT]: null,
    [TaxTypeEnum.RIV]: null,
    [TaxTypeEnum.RIC]: null,
    [TaxTypeEnum.RTE]: null,
  })

  const taxTypeFromRoute = route.params.taxType as string

  const headerProps = {
    title: 'Editar matriz tributaria',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      { label: 'Matriz tributaria', route: 'TaxMatrixList' },
      { label: 'Editar', route: 'TaxMatrixEdit' },
      {
        label:
          TAX_TYPE_LABELS[taxTypeFromRoute.toUpperCase() as TaxType] ||
          taxTypeFromRoute,
        route: '',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'rft',
      label: 'Retención en la fuente',
      icon: defaultIconsLucide.fileText,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'riv',
      label: 'Retención de IVA',
      icon: defaultIconsLucide.fileText,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'ric',
      label: 'Retención de ICA',
      icon: defaultIconsLucide.fileText,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'rte',
      label: 'Impuestos territoriales',
      icon: defaultIconsLucide.fileText,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const initialTab = (taxTypeFromRoute?.toLowerCase() as string) || 'rft'

  const tabActive = ref(initialTab)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const taxTypeMap: Record<string, TaxTypeEnum> = {
    rft: TaxTypeEnum.RFT,
    riv: TaxTypeEnum.RIV,
    ric: TaxTypeEnum.RIC,
    rte: TaxTypeEnum.RTE,
  }

  const getCurrentTabData = computed(() => {
    const taxType = taxTypeMap[tabActive.value]
    return getMatrixByType(taxType)
  })

  const transformToPayload = (
    rows: ITaxMatrixRow[]
  ): ITaxMatrixUpdatePayload => {
    const combinations: Array<{
      third_obligation: string
      nit_obligation: string
      applies: string
    }> = []

    rows.forEach((row) => {
      Object.keys(row.columns).forEach((nit_obligation) => {
        combinations.push({
          third_obligation: row.third_obligation,
          nit_obligation: nit_obligation,
          applies: row.columns[nit_obligation] ? '1' : '0',
        })
      })
    })

    return { combinations }
  }

  const getTabFormData = (tabName: string) => {
    switch (tabName) {
      case 'rft':
        return taxMatrixFormRFTRef.value?.getValues()
      case 'riv':
        return taxMatrixFormRIVRef.value?.getValues()
      case 'ric':
        return taxMatrixFormRICRef.value?.getValues()
      case 'rte':
        return taxMatrixFormRTERef.value?.getValues()
      default:
        return null
    }
  }

  const saveTabState = (tabName: string) => {
    const formData = getTabFormData(tabName)
    if (formData) {
      const taxType = taxTypeMap[tabName]
      currentData.value[taxType] = JSON.parse(JSON.stringify(formData.rows))
    }
  }

  const hasChanges = (taxType: TaxType): boolean => {
    const current = currentData.value[taxType]
    const original = originalData.value[taxType]

    if (!current || !original) return false

    return JSON.stringify(current) !== original
  }

  watch(tabActive, (_newVal, oldVal) => {
    if (oldVal) {
      saveTabState(oldVal)
    }
  })

  const nextTab = () => {
    saveTabState(tabActive.value)

    const nextIdx = tabActiveIdx.value + 1
    if (nextIdx >= filteredTabs.value.length) return

    tabActiveIdx.value = nextIdx
    tabActive.value = filteredTabs.value[nextIdx].name
  }

  const backTab = () => {
    saveTabState(tabActive.value)

    const prevIdx = tabActiveIdx.value - 1
    if (prevIdx < 0) return

    tabActiveIdx.value = prevIdx
    tabActive.value = filteredTabs.value[prevIdx].name
  }

  const handleSubmit = async () => {
    openMainLoader(true)

    saveTabState(tabActive.value)

    const updatePromises: Promise<boolean>[] = []

    Object.keys(taxTypeMap).forEach((tabName) => {
      const taxType = taxTypeMap[tabName]

      if (hasChanges(taxType)) {
        const rows = currentData.value[taxType]
        if (rows) {
          const payload = transformToPayload(rows)
          updatePromises.push(_updateTaxMatrix(taxType, payload))
        }
      }
    })

    if (updatePromises.length === 0) {
      openMainLoader(false)
      return
    }

    const results = await Promise.all(updatePromises)

    if (results.every((success) => success)) {
      handleGoToList()
    }

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToList = () => {
    goToURL('TaxMatrixList', {}, { tab: tabActive.value })
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getTaxMatrixList()

    Object.values(TaxTypeEnum).forEach((taxType) => {
      const data = getMatrixByType(taxType)
      if (data && data.rows) {
        originalData.value[taxType] = JSON.stringify(data.rows)
        currentData.value[taxType] = JSON.parse(JSON.stringify(data.rows))
      }
    })

    setTimeout(() => openMainLoader(false), 1000)
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    getCurrentTabData,
    taxMatrixFormRFTRef,
    taxMatrixFormRIVRef,
    taxMatrixFormRICRef,
    taxMatrixFormRTERef,
    defaultIconsLucide,
    nextTab,
    backTab,
    handleSubmit,
    handleGoToList,
  }
}

export default useTaxMatrixEdit

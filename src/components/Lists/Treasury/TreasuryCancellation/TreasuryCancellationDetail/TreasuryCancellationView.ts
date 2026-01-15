import { computed, onMounted, ref } from 'vue'

import { treasury_cancellation_fields } from '@/constants/resources'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

import { ITabs } from '@/interfaces/global'
import { IFieldConfig, ITreasureCancellations } from '@/interfaces/customs/treasury/TreasureCancellations'

import { useTreasuryCancellationsStore } from '@/stores/treasury/treasury-cancellations'

const useTreasuryCancellationsView = (props: {
  action: 'view'
  id?: number
  type?: string
  documentType?: string
}) => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()

  const { _showAction } = useTreasuryCancellationsStore('v1')

  const authorizationType = props.type as string | null
  const documentType = props.documentType as string | null
  const consecutive = `${props.id}` as string | null
  const id = props.id as number

  const isLoaded = ref(false)

  const initialData = ref<ITreasureCancellations>({})

  const headerProperties = {
    title: '',
    breadcrumbs: [],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const getFieldValue = (
    obj: Record<string, unknown>,
    field: IFieldConfig
  ): string => {
    const { key, format } = field
    if (!key) return '-'

    const value = key.includes(' - ')
      ? key
          .split(' - ')
          .map((k) => getFieldValue(obj, { key: k.trim() }))
          .join(' - ')
      : ((key.split('.').reduce((o: unknown, k) => {
          if (o && typeof o === 'object' && k in o) {
            return (o as Record<string, unknown>)[k]
          }
          return undefined
        }, obj) ?? '-') as unknown)

    if (typeof format === 'function') {
      return format(value)
    }

    return typeof value === 'string' ? value : String(value ?? '-')
  }

  const loadData = async () => {
    openMainLoader(true)

    const params = formatParamsCustom({
      document_query: documentType,
      authorization_type: authorizationType,
      consecutive: consecutive,
    })

    const success = await _showAction(`${id}`, params)

    if (success) {
      const data = success
      initialData.value = data
      isLoaded.value = true
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const filteredSections = computed(() =>
    treasury_cancellation_fields.filter(
      (section) => section.showIfType === documentType
    )
  )

  onMounted(() => loadData())

  return {
    tabs,
    isLoaded,
    tabActive,
    treasury_cancellation_fields,
    initialData,
    tabActiveIdx,
    getFieldValue,
    headerProperties,
    filteredSections,
  }
}

export default useTreasuryCancellationsView
